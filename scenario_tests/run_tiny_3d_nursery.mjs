import fs from "node:fs/promises";
import path from "node:path";
import { createPhysics3DNurseryWorld } from "../digital_world/physics_3d_nursery_world.mjs";
import { buildCompactRows3D, readNursery3DSensors } from "../digital_world/physics_3d_nursery_sensors.mjs";

const outputDir = path.resolve("outputs/tiny_3d_nursery");
const runId = "tiny_3d_nursery_v0";
const watcherPath = path.join(outputDir, "tiny_3d_nursery_watcher.html");
const watcherDataPath = path.join(outputDir, "watcher_frames.json");

function compactSummary(rows) {
  if (rows.length === 0) return "compact 3d stream quiet";
  return rows
    .slice(0, 6)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function hasRow(rows, text) {
  return rows.some((row) => row.stream.includes(text) || row.event.includes(text));
}

function robotFacingTextHasTruthLeak(text) {
  return /\b(true x|true y|true z|baseZ|topZ|coordinate|position|room\.|lowCeilingZone|stepBlock|dropGap|hangingBar)\b/i.test(text);
}

function createRehearsalPolicy() {
  const memory = {
    overheadAhead: false,
    stepUpAhead: false,
    dropAhead: false,
    loweredForClearance: false,
    raisedForStep: false,
    loweredForDrop: false,
    lastAction: "",
    lastOutcome: "settled",
  };
  const log = [];

  function activeText() {
    return Object.entries(memory)
      .filter(([key, value]) => typeof value === "boolean" && value)
      .map(([key]) => key)
      .join(", ") || "none";
  }

  function observe({ tick, action, sensors, compactRows }) {
    const before = activeText();
    if (hasRow(compactRows, "overhead_clearance") || hasRow(compactRows, "vertical_echo") || sensors.overhead_clearance >= 0.58) {
      memory.overheadAhead = true;
    }
    if (hasRow(compactRows, "foot_step_warning") || sensors.foot_step_warning >= 0.58) {
      memory.stepUpAhead = true;
    }
    if (hasRow(compactRows, "foot_drop_warning") || sensors.foot_drop_warning >= 0.58) {
      memory.dropAhead = true;
    }
    if (action === "crouch_body") {
      memory.loweredForClearance = true;
    }
    if (action === "step_up") {
      memory.raisedForStep = true;
      memory.stepUpAhead = false;
    }
    if (action === "step_down") {
      memory.loweredForDrop = true;
      memory.dropAhead = false;
    }
    if (action === "probe_forward" && sensors.overhead_clearance < 0.58 && sensors.foot_step_warning < 0.58 && sensors.foot_drop_warning < 0.58) {
      memory.overheadAhead = false;
      memory.stepUpAhead = false;
      memory.dropAhead = false;
    }
    if (action === "step_forward" && sensors.overhead_clearance < 0.58 && sensors.vertical_echo < 0.58) {
      memory.overheadAhead = false;
    }
    if (action === "step_forward" && sensors.foot_step_warning < 0.58) {
      memory.stepUpAhead = false;
      memory.raisedForStep = false;
    }
    if (action === "step_forward" && sensors.foot_drop_warning < 0.58) {
      memory.dropAhead = false;
      memory.loweredForDrop = false;
    }
    if (action === "stand_body") {
      memory.loweredForClearance = false;
    }

    memory.lastAction = action;
    memory.lastOutcome =
      sensors.movement_result >= 0.95
        ? "blocked_or_contact"
        : sensors.movement_result >= 0.82
          ? "probe_or_drop_warning"
          : sensors.movement_result >= 0.68
            ? "height_warning"
            : sensors.movement_result >= 0.3
              ? "vertical_body_action"
              : "settled_or_moved";

    log.push({
      tick,
      action,
      before,
      compactEvidence: compactSummary(compactRows),
      after: activeText(),
      outcome: memory.lastOutcome,
    });
  }

  function choose() {
    if (memory.overheadAhead && !memory.loweredForClearance) {
      return {
        action: memory.lastAction === "probe_forward" ? "crouch_body" : "probe_forward",
        reason:
          memory.lastAction === "probe_forward"
            ? "compact upper-volume warning was probed, so lower the body before committing"
            : "compact upper-volume risk asks for a probe before upper-body commitment",
        mapBelief: "upper body volume may be constrained ahead",
      };
    }
    if (memory.stepUpAhead && !memory.raisedForStep) {
      return {
        action: memory.lastAction === "probe_forward" ? "step_up" : "probe_forward",
        reason:
          memory.lastAction === "probe_forward"
            ? "compact raised-support warning was probed, so lift base height before crossing"
            : "compact foot support says the next floor support may be higher",
        mapBelief: "floor support ahead may be raised",
      };
    }
    if (memory.dropAhead && !memory.loweredForDrop) {
      return {
        action: memory.lastAction === "probe_forward" ? "step_down" : "probe_forward",
        reason:
          memory.lastAction === "probe_forward"
            ? "compact lower-support warning was probed, so lower base height before crossing"
            : "compact foot support says the next floor support may be lower",
        mapBelief: "floor support ahead may drop downward",
      };
    }
    if (memory.overheadAhead && memory.loweredForClearance) {
      return {
        action: memory.lastAction === "probe_forward" ? "pause" : "probe_forward",
        reason:
          memory.lastAction === "probe_forward"
            ? "compact upper-volume risk persists even while lowered, so hold instead of committing"
            : "body is lowered but compact upper-volume risk still asks for a probe before moving",
        mapBelief: "upper body volume may still be constrained after lowering",
      };
    }
    if (memory.loweredForClearance && memory.lastAction === "probe_forward" && !memory.overheadAhead) {
      return {
        action: "step_forward",
        reason: "crouched probe did not keep upper-volume risk active, so cross while lowered",
        mapBelief: "lowered body posture appears sufficient for the constrained passage",
      };
    }
    return {
      action: "step_forward",
      reason: "no compact 3d risk memory asks for probe, height change, or posture change",
      mapBelief: "local 3d passage is open enough for one small forward sample",
    };
  }

  return {
    choose,
    observe,
    activeText,
    log: () => log.map((row) => ({ ...row })),
  };
}

function predictionFor(action) {
  if (action === "probe_forward") return "compact probe should reveal upper or floor-height risk before body commitment";
  if (action === "crouch_body") return "body top pressure should reduce before forward movement";
  if (action === "stand_body") return "body can return to standing after upper clearance risk clears";
  if (action === "step_up") return "base height shift should rise toward raised support";
  if (action === "step_down") return "base height shift should fall toward lower support";
  if (action === "recenter_body") return "body pitch pressure should settle";
  return "forward movement should gather compact 3d evidence without hidden geometry";
}

function comparePrediction({ action, sensors }) {
  if (action === "probe_forward") return sensors.movement_result >= 0.68 || sensors.movement_result < 0.35;
  if (action === "crouch_body") return sensors.base_height_shift >= 0.75 || sensors.overhead_clearance < 0.75;
  if (action === "stand_body") return sensors.movement_result < 0.3;
  if (action === "step_up" || action === "step_down") return sensors.base_height_shift >= 0.55;
  if (action === "recenter_body") return sensors.body_pitch_pressure < 0.75;
  return sensors.movement_result < 0.95;
}

function mapBeliefFor({ action, compactRows, fallback }) {
  if (hasRow(compactRows, "overhead_clearance") || hasRow(compactRows, "vertical_echo")) {
    return "upper_body_space: possible_low_clearance_or_hanging_obstacle";
  }
  if (hasRow(compactRows, "foot_step_warning")) return "floor_support: possible_raised_step";
  if (hasRow(compactRows, "foot_drop_warning")) return "floor_support: possible_lower_drop";
  if (hasRow(compactRows, "base_height_shift")) return "self_body: base_height_changed";
  if (action === "step_up") return "self_body: base lifted to test raised support";
  if (action === "step_down") return "self_body: base lowered to test lower support";
  return fallback;
}

function renderTruth(frame) {
  const interaction = frame.snapshot.lastInteraction;
  return `| ${[
    frame.tick,
    frame.action,
    frame.snapshot.x.toFixed(2),
    frame.snapshot.y.toFixed(2),
    frame.snapshot.baseZ.toFixed(2),
    frame.snapshot.topZ.toFixed(2),
    frame.snapshot.posture,
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.overheadContact ? "yes" : "no",
    interaction.footStepWarning ? "yes" : "no",
    interaction.footDropWarning ? "yes" : "no",
  ].join(" | ")} |`;
}

function renderTranscript(row) {
  return `| ${[
    row.tick,
    row.compactInput,
    row.riskMemory,
    row.prediction,
    row.action,
    row.reason,
    row.comparison,
    row.mapBelief,
  ].join(" | ")} |`;
}

function renderRisk(row) {
  return `| ${[row.tick, row.action, row.before, row.compactEvidence, row.after, row.outcome].join(" | ")} |`;
}

function watcherFrame({ snapshot, sensors, compactRows, transcriptRow, riskMemory }) {
  const interaction = snapshot.lastInteraction;
  return {
    tick: snapshot.tick,
    action: transcriptRow.action,
    reason: transcriptRow.reason,
    riskMemory,
    prediction: transcriptRow.prediction,
    comparison: transcriptRow.comparison,
    mapBelief: transcriptRow.mapBelief,
    compactSummary: compactRows.map((row) => `${row.stream} ${row.layer} ${row.direction}`),
    sensors,
    hiddenEvaluation: {
      x: snapshot.x,
      y: snapshot.y,
      baseZ: snapshot.baseZ,
      topZ: snapshot.topZ,
      posture: snapshot.posture,
      movementResult: interaction.movementResult,
      blocker: interaction.blockedBy || "none",
      terrain: interaction.terrain,
      overheadContact: interaction.overheadContact,
      footStepWarning: interaction.footStepWarning,
      footDropWarning: interaction.footDropWarning,
    },
  };
}

function buildWatcherHtml(data) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tiny 3D Nursery Watcher</title>
  <style>
    :root { color-scheme: light; --ink:#1f2933; --muted:#5d6875; --line:#c7d0da; --panel:#ffffff; --floor:#eef3ed; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:var(--ink); background:#e7edf3; display:grid; grid-template-rows:auto 1fr; }
    .toolbar { display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--panel); border-bottom:1px solid var(--line); flex-wrap:wrap; }
    h1,h2 { margin:0; letter-spacing:0; }
    h1 { font-size:18px; }
    h2 { font-size:14px; margin:16px 0 6px; }
    button { width:42px; height:34px; border:1px solid var(--line); border-radius:6px; background:#fff; color:var(--ink); font:inherit; cursor:pointer; }
    button.primary { width:auto; padding:0 12px; background:#176b87; border-color:#176b87; color:#fff; }
    input[type="range"] { width:240px; }
    .layout { min-height:0; display:grid; grid-template-columns:minmax(380px,1fr) 380px; }
    .stage { min-height:0; display:grid; padding:14px; }
    canvas { width:100%; height:100%; min-height:520px; background:var(--floor); border:1px solid var(--line); }
    aside { min-height:0; overflow:auto; background:#f8fafc; border-left:1px solid var(--line); padding:14px; }
    .readout { color:var(--muted); font-size:13px; }
    .status { display:grid; gap:8px; padding:10px; border:1px solid #2f855a; background:#fff; border-radius:6px; }
    .status-title { font-weight:700; }
    .pill-row { display:flex; flex-wrap:wrap; gap:6px; }
    .pill { display:inline-flex; min-height:24px; align-items:center; padding:2px 8px; border:1px solid var(--line); border-radius:999px; color:var(--muted); font-size:12px; background:#fff; }
    .pill.good { border-color:#2f855a; color:#276749; background:#f0fff4; }
    .pill.warn { border-color:#b7791f; color:#975a16; background:#fffaf0; }
    .pill.hot { border-color:#b91c1c; color:#991b1b; background:#fff5f5; }
    .row { display:grid; grid-template-columns:1fr auto; gap:8px; padding:5px 0; border-bottom:1px solid #e2e8f0; font-size:13px; }
    ul { margin:8px 0 0; padding-left:18px; color:var(--muted); font-size:13px; }
    .note { padding:8px; border:1px solid #d6bc7c; background:#fffaf0; border-radius:6px; color:#744210; font-size:13px; }
    @media (max-width:860px) { .layout { grid-template-columns:1fr; } aside { border-left:0; border-top:1px solid var(--line); } canvas { min-height:420px; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>Tiny 3D Nursery Watcher</h1>
    <button id="play" class="primary" type="button">Play</button>
    <button id="back" type="button">Prev</button>
    <button id="next" type="button">Next</button>
    <input id="scrub" type="range" min="0" value="0">
    <span id="label" class="readout"></span>
  </div>
  <main class="layout">
    <section class="stage"><canvas id="nursery" aria-label="Tiny 3D nursery watcher"></canvas></section>
    <aside>
      <div class="note">Human evaluator view. The agent still sees compact logs only, never hidden coordinates, vertical truth, or room geometry.</div>
      <h2>Run Status</h2><div id="status" class="status"></div>
      <h2>Action</h2><div id="action" class="readout"></div>
      <h2>Compact Evidence</h2><ul id="compact"></ul>
      <h2>Map Belief</h2><div id="belief" class="readout"></div>
      <h2>Hidden Evaluator</h2><div id="hidden"></div>
      <h2>Sensor Values</h2><div id="sensors"></div>
    </aside>
  </main>
  <script>
    const WATCHER_DATA = ${JSON.stringify(data, null, 2)};
    const canvas = document.getElementById("nursery");
    const ctx = canvas.getContext("2d");
    const play = document.getElementById("play");
    const back = document.getElementById("back");
    const next = document.getElementById("next");
    const scrub = document.getElementById("scrub");
    const label = document.getElementById("label");
    const statusBox = document.getElementById("status");
    const actionBox = document.getElementById("action");
    const compactList = document.getElementById("compact");
    const beliefBox = document.getElementById("belief");
    const hiddenBox = document.getElementById("hidden");
    const sensorsBox = document.getElementById("sensors");
    let index = 0;
    let timer = null;

    scrub.max = Math.max(0, WATCHER_DATA.frames.length - 1);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.max(640, Math.floor(rect.width * scale));
      canvas.height = Math.max(420, Math.floor(rect.height * scale));
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      draw();
    }

    function iso(x, y, z = 0) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const scale = Math.min(w / 16, h / 13);
      return {
        x: w * 0.5 + (x - y) * scale * 0.72,
        y: h * 0.18 + (x + y) * scale * 0.36 - z * scale * 0.95,
      };
    }

    function rectPrism(rect, z0, z1, color, stroke) {
      const a = iso(rect.x1, rect.y1, z0), b = iso(rect.x2, rect.y1, z0), c = iso(rect.x2, rect.y2, z0), d = iso(rect.x1, rect.y2, z0);
      const at = iso(rect.x1, rect.y1, z1), bt = iso(rect.x2, rect.y1, z1), ct = iso(rect.x2, rect.y2, z1), dt = iso(rect.x1, rect.y2, z1);
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(at.x, at.y); ctx.lineTo(bt.x, bt.y); ctx.lineTo(ct.x, ct.y); ctx.lineTo(dt.x, dt.y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 0.55;
      for (const [p, q] of [[a, at], [b, bt], [c, ct], [d, dt]]) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawFloor(room) {
      const corners = [iso(0,0,0), iso(room.width,0,0), iso(room.width,room.depth,0), iso(0,room.depth,0)];
      ctx.fillStyle = "#f5f8ef";
      ctx.strokeStyle = "#8fa3b5";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      corners.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#d4dde5";
      for (let i = 1; i < room.width; i += 1) {
        const p = iso(i, 0, 0), q = iso(i, room.depth, 0);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      for (let i = 1; i < room.depth; i += 1) {
        const p = iso(0, i, 0), q = iso(room.width, i, 0);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }

    function drawRobot(frame) {
      const h = frame.hiddenEvaluation;
      const size = WATCHER_DATA.room.robotHalfSize;
      rectPrism({ x1: h.x - size, y1: h.y - size, x2: h.x + size, y2: h.y + size }, h.baseZ, h.topZ, "#4c78a8", "#1f4e79");
      const head = iso(h.x, h.y, h.topZ + 0.12);
      ctx.fillStyle = h.overheadContact ? "#c53030" : "#183b56";
      ctx.beginPath(); ctx.arc(head.x, head.y, 5, 0, Math.PI * 2); ctx.fill();
    }

    function draw() {
      const frame = WATCHER_DATA.frames[index];
      const room = WATCHER_DATA.room;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      drawFloor(room);
      rectPrism(room.stepBlock, 0, room.stepBlock.z, "#d7b46a", "#9c6f19");
      rectPrism(room.dropGap, room.dropGap.z, 0, "rgba(104, 129, 164, 0.38)", "#57708f");
      rectPrism(room.lowCeilingZone, room.lowCeilingZone.ceilingZ, room.lowCeilingZone.ceilingZ + 0.12, "rgba(129, 92, 174, 0.35)", "#6b46a3");
      rectPrism(room.hangingBar, room.hangingBar.bottomZ, room.hangingBar.bottomZ + 0.18, "rgba(197, 90, 90, 0.42)", "#9b2c2c");
      drawRobot(frame);
      label.textContent = "Frame " + (index + 1) + " / " + WATCHER_DATA.frames.length + " · tick " + frame.tick;
      scrub.value = index;
      renderSide(frame);
    }

    function renderSide(frame) {
      statusBox.innerHTML = '<div class="status-title">' + WATCHER_DATA.summary.verdict + '</div><div class="pill-row">' +
        '<span class="pill good">crouch ' + WATCHER_DATA.summary.metrics.crouchActions + '</span>' +
        '<span class="pill good">step_up ' + WATCHER_DATA.summary.metrics.stepUpActions + '</span>' +
        '<span class="pill good">step_down ' + WATCHER_DATA.summary.metrics.stepDownActions + '</span>' +
        '<span class="pill good">contacts ' + WATCHER_DATA.summary.metrics.overheadStepContacts + '</span></div>';
      actionBox.textContent = frame.action + " · " + frame.reason;
      compactList.innerHTML = (frame.compactSummary.length ? frame.compactSummary : ["compact 3d stream quiet"]).map(item => '<li>' + item + '</li>').join("");
      beliefBox.textContent = frame.mapBelief + " · " + frame.comparison;
      const h = frame.hiddenEvaluation;
      hiddenBox.innerHTML = [
        ["posture", h.posture],
        ["movement", h.movementResult],
        ["blocker", h.blocker],
        ["terrain", h.terrain.join(", ") || "plain_floor"],
        ["base/top", h.baseZ.toFixed(2) + " / " + h.topZ.toFixed(2)]
      ].map(([k,v]) => '<div class="row"><span>' + k + '</span><strong>' + v + '</strong></div>').join("");
      sensorsBox.innerHTML = Object.entries(frame.sensors).map(([k,v]) => '<div class="row"><span>' + k + '</span><strong>' + v + '</strong></div>').join("");
    }

    function setIndex(nextIndex) {
      index = (nextIndex + WATCHER_DATA.frames.length) % WATCHER_DATA.frames.length;
      draw();
    }

    play.addEventListener("click", () => {
      if (timer) { clearInterval(timer); timer = null; play.textContent = "Play"; return; }
      play.textContent = "Pause";
      timer = setInterval(() => setIndex(index + 1), 850);
    });
    back.addEventListener("click", () => setIndex(index - 1));
    next.addEventListener("click", () => setIndex(index + 1));
    scrub.addEventListener("input", () => setIndex(Number(scrub.value)));
    window.addEventListener("resize", resize);
    resize();
  </script>
</body>
</html>`;
}

await fs.mkdir(outputDir, { recursive: true });

const world = createPhysics3DNurseryWorld();
const policy = createRehearsalPolicy();
let olderSensors = null;
let previousSensors = null;
let currentSensors = readNursery3DSensors(world.snapshot());
let currentCompactRows = [];
const transcript = [];
const mapBeliefs = [];
const hiddenFrames = [];
const watcherFrames = [];
const compactRowsAll = [];

for (let turn = 1; turn <= 16; turn += 1) {
  const compactInput = compactSummary(currentCompactRows);
  const riskMemory = policy.activeText();
  const choice = policy.choose();
  const snapshot = world.step(choice.action);
  const sensors = readNursery3DSensors(snapshot);
  const compactRows = buildCompactRows3D({
    runId,
    tick: snapshot.tick,
    action: choice.action,
    sensors,
    previousSensors: currentSensors ?? previousSensors,
    olderSensors: previousSensors ?? olderSensors,
  });
  const comparison = comparePrediction({ action: choice.action, sensors }) ? "matched_or_explained" : "mismatch_needs_map_update";
  const mapBelief = {
    tick: snapshot.tick,
    belief: mapBeliefFor({ action: choice.action, compactRows, fallback: choice.mapBelief }),
    confidence: compactRows.length ? "medium" : "low",
    evidence: compactSummary(compactRows),
    nextPrediction: comparison,
  };

  policy.observe({ tick: snapshot.tick, action: choice.action, sensors, compactRows });
  const transcriptRow = {
    tick: snapshot.tick,
    compactInput,
    riskMemory,
    prediction: predictionFor(choice.action),
    action: choice.action,
    reason: choice.reason,
    comparison,
    mapBelief: mapBelief.belief,
  };
  transcript.push(transcriptRow);
  mapBeliefs.push(mapBelief);
  hiddenFrames.push({ tick: snapshot.tick, action: choice.action, snapshot });
  watcherFrames.push(watcherFrame({ snapshot, sensors, compactRows, transcriptRow, riskMemory }));
  compactRowsAll.push(...compactRows);
  olderSensors = previousSensors;
  previousSensors = currentSensors;
  currentSensors = sensors;
  currentCompactRows = compactRows;
}

const compactLog = `# Tiny 3D Nursery Compact Trigger Log

Agent-facing compact rows only. Hidden geometry and true coordinates are not included.

| tick | action | layer | event | stream | value | change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- |
${compactRowsAll
  .map((row) => `| ${[row.tick, row.action, row.layer, row.event, row.stream, row.value, row.signedChange, row.direction].join(" | ")} |`)
  .join("\n")}
`;

const transcriptMarkdown = `# Tiny 3D Nursery Decision Transcript

This is the first compact-only 3D rehearsal. The policy sees compact evidence and risk memory, not hidden simulator geometry.

| tick | compact input | risk memory | prediction | action | reason | comparison | map belief |
| --- | --- | --- | --- | --- | --- | --- | --- |
${transcript.map(renderTranscript).join("\n")}
`;

const riskMemoryMarkdown = `# Tiny 3D Nursery Risk Memory Log

| tick | action | before | compact evidence | after | outcome |
| --- | --- | --- | --- | --- | --- |
${policy.log().map(renderRisk).join("\n")}
`;

const mapMarkdown = `# Tiny 3D Nursery Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
${mapBeliefs.map((row) => `| ${[row.tick, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`).join("\n")}
`;

const hiddenTruthMarkdown = `# Tiny 3D Nursery Hidden Truth Log

Human evaluation only. Agent-facing compact logs do not read this file.

| tick | action | true x | true y | true base z | true top z | posture | movement result | blocker | terrain | overhead contact | step warning | drop warning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${hiddenFrames.map(renderTruth).join("\n")}
`;

const robotFacingText = [compactLog, transcriptMarkdown, riskMemoryMarkdown, mapMarkdown].join("\n");
const noTruthLeaks = !robotFacingTextHasTruthLeak(robotFacingText);
const metrics = {
  turns: transcript.length,
  compactRows: compactRowsAll.length,
  mapBeliefs: mapBeliefs.length,
  overheadContacts: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.overheadContact && frame.action === "step_forward").length,
  stepBlocks: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.movementResult === "step_height_blocked").length,
  dropWarnings: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.movementResult === "drop_warning").length,
  crouchActions: hiddenFrames.filter((frame) => frame.action === "crouch_body").length,
  stepUpActions: hiddenFrames.filter((frame) => frame.action === "step_up").length,
  stepDownActions: hiddenFrames.filter((frame) => frame.action === "step_down").length,
  predictionMismatches: transcript.filter((row) => row.comparison !== "matched_or_explained").length,
  watcherFrames: watcherFrames.length,
};

const checks = [
  ["agent-facing logs do not include hidden coordinates or feature objects", noTruthLeaks],
  ["3D run produces compact trigger evidence", metrics.compactRows > 0],
  ["policy crouches for upper-volume risk", metrics.crouchActions >= 1],
  ["policy uses step_up for raised floor support", metrics.stepUpActions >= 1],
  ["policy uses step_down for lower floor support", metrics.stepDownActions >= 1],
  ["hidden evaluator sees zero overhead step contacts", metrics.overheadContacts === 0],
  ["hidden evaluator sees zero unhandled step blocks", metrics.stepBlocks === 0],
  ["hidden evaluator sees zero unhandled drop warnings", metrics.dropWarnings === 0],
  ["every turn writes a compact map belief", metrics.mapBeliefs === metrics.turns],
  ["predictions all match or are explained", metrics.predictionMismatches === 0],
  ["watcher frames cover every turn", metrics.watcherFrames === metrics.turns],
];
const passed = checks.every(([, ok]) => ok);
const watcherData = {
  note: "Human watcher/evaluation data only. Agent-facing compact logs do not read this file.",
  room: hiddenFrames[0]?.snapshot.room ?? createPhysics3DNurseryWorld().room,
  summary: {
    verdict: passed ? "PASS" : "FAIL",
    note: "The watcher uses hidden evaluator frames. Robot-facing logs still see compact 3D streams only.",
    metrics,
  },
  frames: watcherFrames,
};

const resultMarkdown = `# Tiny 3D Nursery Result

Purpose: create the first hidden 3D embodied nursery while preserving compact-only perception.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | value |
| --- | --- |
| transcript turns | ${metrics.turns} |
| compact rows | ${metrics.compactRows} |
| compact map beliefs | ${metrics.mapBeliefs} |
| crouch actions | ${metrics.crouchActions} |
| step_up actions | ${metrics.stepUpActions} |
| step_down actions | ${metrics.stepDownActions} |
| watcher frames | ${metrics.watcherFrames} |
| overhead step contacts in hidden evaluator | ${metrics.overheadContacts} |
| unhandled raised-step blocks in hidden evaluator | ${metrics.stepBlocks} |
| unhandled drop warnings in hidden evaluator | ${metrics.dropWarnings} |
| prediction mismatches | ${metrics.predictionMismatches} |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| compact trigger log | \`outputs/tiny_3d_nursery/compact_trigger_log.md\` |
| decision transcript | \`outputs/tiny_3d_nursery/decision_transcript.md\` |
| risk memory log | \`outputs/tiny_3d_nursery/risk_memory_log.md\` |
| map beliefs | \`outputs/tiny_3d_nursery/map_beliefs.md\` |
| hidden truth log | \`outputs/tiny_3d_nursery/hidden_truth_log.md\` |
| watcher page | \`outputs/tiny_3d_nursery/tiny_3d_nursery_watcher.html\` |
| watcher frames | \`outputs/tiny_3d_nursery/watcher_frames.json\` |
| result report | \`outputs/tiny_3d_nursery/tiny_3d_nursery_result.md\` |
`;

await fs.writeFile(path.join(outputDir, "compact_trigger_log.md"), compactLog);
await fs.writeFile(path.join(outputDir, "decision_transcript.md"), transcriptMarkdown);
await fs.writeFile(path.join(outputDir, "risk_memory_log.md"), riskMemoryMarkdown);
await fs.writeFile(path.join(outputDir, "map_beliefs.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), hiddenTruthMarkdown);
await fs.writeFile(watcherDataPath, JSON.stringify(watcherData, null, 2));
await fs.writeFile(watcherPath, buildWatcherHtml(watcherData));
await fs.writeFile(path.join(outputDir, "tiny_3d_nursery_result.md"), resultMarkdown);

console.log(resultMarkdown);
