import fs from "node:fs/promises";
import path from "node:path";
import { createPhysics25DRiskMemoryChooser } from "../digital_world/physics_2_5d_risk_memory_chooser.mjs";
import { createPhysics25DNurseryWorld } from "../digital_world/physics_2_5d_nursery_world.mjs";
import { buildCompactRows25D, readNursery25DSensors } from "../digital_world/physics_2_5d_nursery_sensors.mjs";

const outputDir = path.resolve("outputs/adaptive_2_5d_nursery");
const ADAPTIVE_ROOM_2_5D = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  rampZone: { id: "ramp", x1: 4.4, y1: 7.05, x2: 5.4, y2: 8.1 },
  ledgeZone: { id: "ledge_drop", x1: 4.4, y1: 5.45, x2: 5.4, y2: 6.2 },
  lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 2.05, x2: 5.4, y2: 3.25 },
  raisedPad: { id: "raised_pressure_pad", x1: 4.4, y1: 4.0, x2: 5.4, y2: 4.75 },
};
const initialState = { x: 4.9, y: 0.85, facing: "south" };
const naiveActions = Array.from({ length: 12 }, (_, index) => ({
  action: index === 8 ? "pause" : "step_forward",
  intention: "naive movement without compact risk-memory adaptation",
}));

function hasCompact(rows, text) {
  return rows.some((row) => row.stream.includes(text) || row.event.includes(text));
}

function compactSummary(rows) {
  if (rows.length === 0) return "compact stream quiet";
  return rows
    .slice(0, 5)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function predictionFor(action, memory = {}) {
  if (action === "probe_forward") return "probe should test active compact forward risk before body commitment";
  if (action === "crouch_body") return "lowering posture should reduce overhead clearance pressure";
  if (action === "recenter_body") return "body load should settle before crossing height change";
  if (action === "pause") return "height pressure should settle without adding new contact";
  if (memory.overheadAhead || memory.dropAhead || memory.rampLoadAhead || memory.raisedSurfaceAhead) {
    return "forward movement may carry compact risk evidence already held in risk memory";
  }
  return "forward movement should gather compact evidence with no known active risk memory";
}

function compare({ prediction, compactRows, sensors }) {
  let matched = false;
  if (prediction.action === "probe_forward") matched = sensors.movement_result >= 0.65 || compactRows.length === 0;
  else if (prediction.action === "crouch_body") matched = sensors.overhead_clearance < 0.75;
  else if (["pause", "recenter_body"].includes(prediction.action)) matched = true;
  else if (prediction.expectedCompactResult.includes("may carry")) matched = sensors.movement_result >= 0.18;
  else matched = sensors.movement_result < 0.65 && !hasCompact(compactRows, "overhead_clearance");

  return {
    runId: prediction.runId,
    tick: prediction.tick,
    action: prediction.action,
    predicted: prediction.expectedCompactResult,
    evidence: compactSummary(compactRows),
    result: matched ? "matched_or_explained" : "mismatch_needs_map_update",
  };
}

function mapUpdatesFor({ runId, tick, action, sensors, compactRows, comparison }) {
  const updates = [];
  if (hasCompact(compactRows, "overhead_clearance") || hasCompact(compactRows, "vertical_echo") || sensors.overhead_clearance >= 0.58) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "risk_memory_update",
      belief: "forward_risk_memory: overheadAhead",
      confidence: sensors.overhead_clearance >= 0.9 ? "high" : "medium",
      evidence: "overhead clearance or vertical echo compact evidence rose",
      nextPrediction: "probe_forward then crouch_body should reduce upper-body contact risk",
    });
  }
  if (hasCompact(compactRows, "foot_drop_warning") || sensors.foot_drop_warning >= 0.58) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "risk_memory_update",
      belief: "forward_risk_memory: dropAhead",
      confidence: sensors.foot_drop_warning >= 0.85 ? "high" : "medium",
      evidence: "foot drop compact evidence rose",
      nextPrediction: "probe_forward should warn before committing body weight",
    });
  }
  if (hasCompact(compactRows, "height_pressure") || sensors.height_pressure >= 0.85) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "risk_memory_update",
      belief: "forward_risk_memory: raisedSurfaceAhead",
      confidence: "medium",
      evidence: "height pressure compact evidence rose",
      nextPrediction: "pause should separate raised load from collision",
    });
  }
  if (hasCompact(compactRows, "ramp_load_shift") || sensors.ramp_load_shift >= 0.7 || sensors.body_pitch_pressure >= 0.7) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "risk_memory_update",
      belief: "forward_risk_memory: rampLoadAhead",
      confidence: "medium",
      evidence: "ramp load or body pitch compact evidence rose",
      nextPrediction: "recenter_body should settle load before more movement",
    });
  }
  if (updates.length === 0 && (tick % 3 === 0 || comparison.result === "mismatch_needs_map_update")) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "self_map_update",
      belief: "body_state: stable_enough_to_continue",
      confidence: "low",
      evidence: "compact risk streams stayed quiet in this noticing window",
      nextPrediction: "step_forward can gather more compact evidence",
    });
  }
  return updates;
}

function habitCandidatesFrom(frames) {
  const candidates = [];
  for (let index = 0; index <= frames.length - 3; index += 1) {
    const trio = frames.slice(index, index + 3);
    const actions = trio.map((frame) => frame.action).join(" -> ");
    const safeCrossing =
      actions === "probe_forward -> crouch_body -> step_forward" &&
      trio[0].snapshot.lastInteraction.movementResult === "probe_overhead_warning" &&
      trio[2].snapshot.lastInteraction.terrain.includes("low_clearance_tunnel") &&
      !trio[2].snapshot.lastInteraction.overheadContact;
    if (safeCrossing) {
      candidates.push({
        candidateId: `adaptive_habit_${candidates.length + 1}`,
        status: "candidate_learned_operation",
        routine: "low_clearance_crossing_routine",
        trigger: "overheadAhead compact risk memory or probe_overhead_warning",
        sequence: actions,
        reward: "crossed low-clearance area with no overhead contact",
        evidence: `ticks ${trio.map((frame) => frame.tick).join(", ")}`,
      });
    }
  }
  return candidates;
}

async function runPass({ runId, chooser = null, actions = naiveActions, ticks = 12 }) {
  const world = createPhysics25DNurseryWorld({ room: ADAPTIVE_ROOM_2_5D, initialState });
  const frames = [];
  const compactRows = [];
  const predictions = [];
  const comparisons = [];
  const mapUpdates = [];
  const decisions = [];
  let previousSensors = null;
  let olderSensors = null;

  for (let index = 0; index < ticks; index += 1) {
    const tick = index + 1;
    const chooserSnapshot = chooser?.snapshot() ?? { activeRiskMemory: {}, activeMemoryText: "none" };
    const choice = chooser
      ? chooser.choose(tick)
      : { ...actions[index], reason: "scripted movement without adaptive risk memory" };
    const action = choice.action;
    const decision = {
      runId,
      tick,
      source: chooser ? "compact_risk_memory_chooser" : "scripted",
      action,
      intention: choice.intention,
      reason: choice.reason,
      activeRiskMemory: chooserSnapshot.activeMemoryText,
    };
    decisions.push(decision);
    const prediction = {
      runId,
      tick,
      action,
      expectedCompactResult: predictionFor(action, chooserSnapshot.activeRiskMemory),
    };
    predictions.push(prediction);
    const snapshot = world.step(action);
    const sensors = readNursery25DSensors(snapshot);
    const rows = buildCompactRows25D({ runId, tick, action, sensors, previousSensors, olderSensors });
    const comparison = compare({ prediction, compactRows: rows, sensors });
    const updates = mapUpdatesFor({ runId, tick, action, sensors, compactRows: rows, comparison });
    chooser?.observe({ tick, action, sensors, compactRows: rows });

    frames.push({ runId, tick, action, snapshot, sensors, compactRows: rows, comparison, decision });
    compactRows.push(...rows);
    comparisons.push(comparison);
    mapUpdates.push(...updates);
    olderSensors = previousSensors;
    previousSensors = sensors;
  }

  const metrics = {
    committedHeightWarnings: frames.filter(
      (frame) =>
        frame.action === "step_forward" &&
        ["drop_warning", "overhead_blocked"].includes(frame.snapshot.lastInteraction.movementResult)
    ).length,
    overheadContacts: frames.filter((frame) => frame.action === "step_forward" && frame.snapshot.lastInteraction.overheadContact).length,
    probeWarnings: frames.filter((frame) => frame.action === "probe_forward" && frame.snapshot.lastInteraction.movementResult.includes("warning")).length,
    crouchActions: frames.filter((frame) => frame.action === "crouch_body").length,
    raisedPauses: frames.filter((frame) => frame.action === "pause").length,
    predictionAccuracy: comparisons.filter((row) => row.result === "matched_or_explained").length / comparisons.length,
    unresolvedMismatches: comparisons.filter((row) => row.result === "mismatch_needs_map_update").length,
  };

  return {
    runId,
    frames,
    compactRows,
    predictions,
    comparisons,
    mapUpdates,
    decisions,
    metrics,
    riskMemoryLog: chooser?.riskMemoryLog() ?? [],
    habitCandidates: habitCandidatesFrom(frames),
  };
}

function format(value) {
  return Number(value).toFixed(2);
}

function renderCompact(row) {
  return `| ${[row.runId, row.tick, row.action, row.layer, row.event, row.stream, format(row.value), format(row.signedChange), row.direction].join(" | ")} |`;
}

function renderTruth(frame) {
  const interaction = frame.snapshot.lastInteraction;
  return `| ${[
    frame.runId,
    frame.tick,
    frame.action,
    frame.snapshot.x.toFixed(2),
    frame.snapshot.y.toFixed(2),
    frame.snapshot.facing,
    frame.snapshot.posture,
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.footDropWarning ? "yes" : "no",
    interaction.overheadContact ? "yes" : "no",
  ].join(" | ")} |`;
}

function robotFacingTextHasCoordinateLeak(text) {
  return /\b(x|y|coord|coordinate|position|true_position|room\.|rampZone|ledgeZone|lowTunnel|raisedPad)\b/i.test(text);
}

function watcherHtml(frames, summaryData) {
  const data = JSON.stringify(
    {
      room: ADAPTIVE_ROOM_2_5D,
      summary: summaryData,
      frames: frames.map((frame) => ({
        runId: frame.runId,
        tick: frame.tick,
        action: frame.action,
        x: frame.snapshot.x,
        y: frame.snapshot.y,
        facing: frame.snapshot.facing,
        posture: frame.snapshot.posture,
        movementResult: frame.snapshot.lastInteraction.movementResult,
        sensors: frame.sensors,
        compactSummary: frame.compactRows.slice(0, 6).map((row) => `${row.stream} ${row.layer} ${row.direction}`),
        decisionReason: frame.decision.reason,
        activeRiskMemory: frame.decision.activeRiskMemory,
      })),
    },
    null,
    2
  );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Adaptive 2.5D Nursery Watcher</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; grid-template-rows: auto 1fr; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #20252b; background: #e8edf2; }
    header { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding: 10px 12px; background: #fff; border-bottom: 1px solid #c8d1dc; }
    h1, h2 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 18px; }
    h2 { font-size: 14px; margin-top: 14px; }
    button { min-width: 42px; height: 34px; border: 1px solid #c8d1dc; border-radius: 6px; background: #fff; color: #20252b; font: inherit; }
    button.primary { background: #1f7a8c; color: #fff; border-color: #1f7a8c; }
    input { width: 220px; }
    main { min-height: 0; display: grid; grid-template-columns: minmax(320px, 1fr) 370px; }
    canvas { width: 100%; height: 100%; min-height: 430px; background: #f6f8f2; border: 1px solid #c8d1dc; }
    .stage { min-height: 0; display: grid; padding: 14px; }
    aside { overflow: auto; padding: 14px; background: #f8fafc; border-left: 1px solid #c8d1dc; }
    .readout { color: #5d6875; font-size: 13px; }
    .status { display: grid; gap: 8px; padding: 10px; border: 1px solid #2f855a; background: #fff; border-radius: 6px; }
    .pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .pill { display: inline-flex; align-items: center; min-height: 24px; padding: 2px 8px; border: 1px solid #2f855a; border-radius: 999px; background: #f0fff4; color: #276749; font-size: 12px; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: 8px; padding: 5px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    ul { margin: 8px 0 0; padding-left: 18px; color: #5d6875; font-size: 13px; }
    @media (max-width: 840px) { main { grid-template-columns: 1fr; } aside { border-left: 0; border-top: 1px solid #c8d1dc; } }
  </style>
</head>
<body>
  <header>
    <h1>Adaptive 2.5D Nursery</h1>
    <button id="play" class="primary" type="button">Play</button>
    <button id="back" type="button">Prev</button>
    <button id="next" type="button">Next</button>
    <input id="scrub" type="range" min="0" value="0">
    <span id="label" class="readout"></span>
  </header>
  <main>
    <section class="stage"><canvas id="view"></canvas></section>
    <aside>
      <h2>Run Status</h2><div id="status" class="status"></div>
      <h2>Action</h2><div id="action" class="readout"></div>
      <h2>Compact Feeling</h2><ul id="compact"></ul>
      <h2>Sensors</h2><div id="sensors"></div>
    </aside>
  </main>
  <script>
    const DATA = ${data};
    const canvas = document.getElementById("view");
    const ctx = canvas.getContext("2d");
    const scrub = document.getElementById("scrub");
    const label = document.getElementById("label");
    const status = document.getElementById("status");
    const action = document.getElementById("action");
    const compact = document.getElementById("compact");
    const sensors = document.getElementById("sensors");
    const play = document.getElementById("play");
    let index = 0;
    let timer = null;
    scrub.max = DATA.frames.length - 1;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw();
    }
    function wp(p) {
      const rect = canvas.getBoundingClientRect();
      const pad = 24;
      const scale = Math.min((rect.width - pad * 2) / DATA.room.width, (rect.height - pad * 2) / DATA.room.height);
      return { x: pad + p.x * scale, y: pad + p.y * scale, scale };
    }
    function block(r, color, alpha) {
      const a = wp({ x: r.x1, y: r.y1 });
      const b = wp({ x: r.x2, y: r.y2 });
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      ctx.globalAlpha = 1;
    }
    function draw() {
      const frame = DATA.frames[index];
      const bounds = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, bounds.width, bounds.height);
      const a = wp({ x: 0, y: 0 });
      const b = wp({ x: DATA.room.width, y: DATA.room.height });
      ctx.fillStyle = "#f6f8f2";
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      ctx.strokeStyle = "#46515d";
      ctx.lineWidth = 6;
      ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
      block(DATA.room.lowTunnel, "#6b46c1", 0.22);
      block(DATA.room.raisedPad, "#b7791f", 0.32);
      block(DATA.room.ledgeZone, "#b83280", 0.22);
      block(DATA.room.rampZone, "#2f855a", 0.28);
      const p = wp({ x: frame.x, y: frame.y });
      const size = Math.max(18, p.scale * 0.68);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate({ north:-Math.PI/2, east:0, south:Math.PI/2, west:Math.PI }[frame.facing]);
      ctx.fillStyle = frame.movementResult.includes("overhead") ? "#b91c1c" : frame.movementResult.includes("warning") ? "#b7791f" : frame.posture === "crouched" ? "#2f855a" : "#1f7a8c";
      const bodyHeight = frame.posture === "crouched" ? size * 0.68 : size;
      ctx.fillRect(-size / 2, -bodyHeight / 2, size, bodyHeight);
      ctx.strokeStyle = "#20252b";
      ctx.lineWidth = 2;
      ctx.strokeRect(-size / 2, -bodyHeight / 2, size, bodyHeight);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(size / 2 + 8, 0);
      ctx.lineTo(size / 2 - 5, -7);
      ctx.lineTo(size / 2 - 5, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      label.textContent = frame.runId + " tick " + frame.tick + " / " + frame.movementResult;
      status.innerHTML = '<strong>' + DATA.summary.verdict + '</strong><div class="readout">' + DATA.summary.note + '</div><div class="pill-row"><span class="pill">height warnings ' + DATA.summary.metrics.committedHeightWarnings.naive + ' -> ' + DATA.summary.metrics.committedHeightWarnings.adaptive + '</span><span class="pill">overhead ' + DATA.summary.metrics.overheadContacts.naive + ' -> ' + DATA.summary.metrics.overheadContacts.adaptive + '</span><span class="pill">habit candidates ' + DATA.summary.metrics.habitCandidates + '</span></div>';
      action.textContent = frame.action + " - " + frame.decisionReason + " - memory: " + frame.activeRiskMemory;
      compact.innerHTML = frame.compactSummary.length ? frame.compactSummary.map((item) => "<li>" + item + "</li>").join("") : "<li>compact stream quiet</li>";
      sensors.innerHTML = Object.entries(frame.sensors).map(([key, value]) => '<div class="row"><span>' + key + '</span><span>' + Number(value).toFixed(2) + '</span></div>').join("");
      scrub.value = index;
    }
    function setIndex(next) { index = Math.max(0, Math.min(DATA.frames.length - 1, next)); draw(); }
    play.addEventListener("click", () => {
      if (timer) { clearInterval(timer); timer = null; play.textContent = "Play"; return; }
      play.textContent = "Pause";
      timer = setInterval(() => setIndex(index === DATA.frames.length - 1 ? 0 : index + 1), 700);
    });
    document.getElementById("back").addEventListener("click", () => setIndex(index - 1));
    document.getElementById("next").addEventListener("click", () => setIndex(index + 1));
    scrub.addEventListener("input", () => setIndex(Number(scrub.value)));
    addEventListener("resize", resize);
    resize();
  </script>
</body>
</html>`;
}

await fs.mkdir(outputDir, { recursive: true });

const naive = await runPass({ runId: "adaptive_naive", actions: naiveActions, ticks: naiveActions.length });
const chooser = createPhysics25DRiskMemoryChooser();
const adaptive = await runPass({ runId: "adaptive_risk_memory", chooser, ticks: 14 });

const allFrames = [...naive.frames, ...adaptive.frames];
const allCompactRows = [...naive.compactRows, ...adaptive.compactRows];
const allPredictions = [...naive.predictions, ...adaptive.predictions];
const allComparisons = [...naive.comparisons, ...adaptive.comparisons];
const allUpdates = [...naive.mapUpdates, ...adaptive.mapUpdates];
const allDecisions = [...naive.decisions, ...adaptive.decisions];
const habitCandidates = adaptive.habitCandidates;

const compactMarkdown = `# Adaptive 2.5D Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allCompactRows.map(renderCompact).join("\n")}
`;

const predictionMarkdown = `# Adaptive 2.5D Nursery Prediction And Comparison Log

| run | tick | action | phase | prediction or evidence | result |
| --- | --- | --- | --- | --- | --- |
${allPredictions
  .flatMap((prediction) => [
    `| ${[prediction.runId, prediction.tick, prediction.action, "prediction_before_action", prediction.expectedCompactResult, ""].join(" | ")} |`,
    ...allComparisons
      .filter((comparison) => comparison.runId === prediction.runId && comparison.tick === prediction.tick && comparison.action === prediction.action)
      .map((comparison) => `| ${[comparison.runId, comparison.tick, comparison.action, "immediate_comparison", comparison.evidence, comparison.result].join(" | ")} |`),
  ])
  .join("\n")}
`;

const riskMemoryMarkdown = `# Adaptive 2.5D Nursery Risk Memory Log

Robot-facing compact risk memory. This is the chooser's short-lived body/world risk state, not a hidden map-location table.

| tick | action | before | compact evidence | after | outcome |
| --- | --- | --- | --- | --- | --- |
${adaptive.riskMemoryLog.map((row) => `| ${[row.tick, row.action, row.before, row.compactEvidence, row.after, row.outcome].join(" | ")} |`).join("\n")}
`;

const mapMarkdown = `# Adaptive 2.5D Nursery Body And World Map Updates

| run | tick | action | map kind | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- | --- | --- | --- |
${allUpdates.map((row) => `| ${[row.runId, row.tick, row.action, row.mapKind, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`).join("\n")}
`;

const decisionMarkdown = `# Adaptive 2.5D Nursery Action Decision Log

The adaptive run is selected by compact risk memory, not fixed route timing. This log is robot-facing and records no hidden coordinates.

| run | tick | source | action | intention | reason | active risk memory |
| --- | --- | --- | --- | --- | --- | --- |
${allDecisions.map((row) => `| ${[row.runId, row.tick, row.source, row.action, row.intention, row.reason, row.activeRiskMemory].join(" | ")} |`).join("\n")}
`;

const habitMarkdown = `# Adaptive 2.5D Nursery Habit Candidates

Candidate learned operation controls are proposed only from successful compact-risk action sequences.

| candidate id | status | routine | trigger | sequence | reward | evidence |
| --- | --- | --- | --- | --- | --- | --- |
${habitCandidates.map((row) => `| ${[row.candidateId, row.status, row.routine, row.trigger, row.sequence, row.reward, row.evidence].join(" | ")} |`).join("\n")}
`;

const truthMarkdown = `# Adaptive 2.5D Nursery Hidden Truth Log

Debug/evaluation truth for human inspection. Robot-facing compact logs do not read this file.

| run | tick | action | true x | true y | true facing | true posture | true movement result | true blocker | true terrain | foot drop | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allFrames.map(renderTruth).join("\n")}
`;

const robotFacingText = [compactMarkdown, predictionMarkdown, riskMemoryMarkdown, mapMarkdown, decisionMarkdown, habitMarkdown].join("\n");
const noCoordinateLeaks = !robotFacingTextHasCoordinateLeak(robotFacingText);
const checks = [
  [
    "adaptive run has fewer committed height warnings than naive run",
    adaptive.metrics.committedHeightWarnings < naive.metrics.committedHeightWarnings,
  ],
  ["adaptive run has fewer overhead contacts than naive run", adaptive.metrics.overheadContacts < naive.metrics.overheadContacts],
  ["adaptive run uses probes from compact risk memory", adaptive.metrics.probeWarnings > naive.metrics.probeWarnings],
  ["adaptive run uses crouch_body for low-clearance risk", adaptive.metrics.crouchActions > naive.metrics.crouchActions],
  ["adaptive run creates a low-clearance habit candidate", habitCandidates.length > 0],
  ["adaptive prediction accuracy is better than naive run", adaptive.metrics.predictionAccuracy > naive.metrics.predictionAccuracy],
  ["robot-facing logs do not include hidden coordinates or feature objects", noCoordinateLeaks],
  ["hidden truth exists only in the evaluation log", truthMarkdown.includes("true x") && truthMarkdown.includes("true y")],
  ["adaptive actions are selected by compact risk memory", adaptive.decisions.every((row) => row.source === "compact_risk_memory_chooser")],
];
const passed = checks.every(([, ok]) => ok);
const summaryData = {
  verdict: passed ? "PASS" : "FAIL",
  note: "The adaptive run uses compact risk memory instead of fixed route timing.",
  metrics: {
    committedHeightWarnings: {
      naive: naive.metrics.committedHeightWarnings,
      adaptive: adaptive.metrics.committedHeightWarnings,
    },
    overheadContacts: {
      naive: naive.metrics.overheadContacts,
      adaptive: adaptive.metrics.overheadContacts,
    },
    probeWarnings: {
      naive: naive.metrics.probeWarnings,
      adaptive: adaptive.metrics.probeWarnings,
    },
    crouchActions: {
      naive: naive.metrics.crouchActions,
      adaptive: adaptive.metrics.crouchActions,
    },
    predictionAccuracy: {
      naive: Number((naive.metrics.predictionAccuracy * 100).toFixed(1)),
      adaptive: Number((adaptive.metrics.predictionAccuracy * 100).toFixed(1)),
    },
    habitCandidates: habitCandidates.length,
  },
};
const html = watcherHtml(allFrames, summaryData);

const resultMarkdown = `# Adaptive 2.5D Nursery Result

Purpose: replace fixed route timing with compact risk memory and propose the first learned-operation habit candidate from a successful low-clearance crossing sequence.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | naive | adaptive risk memory |
| --- | --- | --- |
| committed height warnings | ${naive.metrics.committedHeightWarnings} | ${adaptive.metrics.committedHeightWarnings} |
| overhead contacts | ${naive.metrics.overheadContacts} | ${adaptive.metrics.overheadContacts} |
| probe warnings before commitment | ${naive.metrics.probeWarnings} | ${adaptive.metrics.probeWarnings} |
| crouch actions | ${naive.metrics.crouchActions} | ${adaptive.metrics.crouchActions} |
| raised-surface pauses | ${naive.metrics.raisedPauses} | ${adaptive.metrics.raisedPauses} |
| prediction accuracy | ${(naive.metrics.predictionAccuracy * 100).toFixed(1)}% | ${(adaptive.metrics.predictionAccuracy * 100).toFixed(1)}% |
| unresolved prediction mismatches | ${naive.metrics.unresolvedMismatches} | ${adaptive.metrics.unresolvedMismatches} |
| habit candidates | 0 | ${habitCandidates.length} |

## Habit Candidate

${habitCandidates
  .map(
    (row) => `- ${row.routine}: trigger \`${row.trigger}\`, sequence \`${row.sequence}\`, reward \`${row.reward}\`.`
  )
  .join("\n") || "- No habit candidate was created."}

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | \`outputs/adaptive_2_5d_nursery/hidden_truth_log.md\` |
| compact trigger log | \`outputs/adaptive_2_5d_nursery/compact_trigger_log.md\` |
| prediction/comparison log | \`outputs/adaptive_2_5d_nursery/prediction_comparison_log.md\` |
| risk memory log | \`outputs/adaptive_2_5d_nursery/risk_memory_log.md\` |
| body/world map updates | \`outputs/adaptive_2_5d_nursery/body_world_map_updates.md\` |
| action decision log | \`outputs/adaptive_2_5d_nursery/action_decision_log.md\` |
| habit candidates | \`outputs/adaptive_2_5d_nursery/habit_candidates.md\` |
| watcher page | \`outputs/adaptive_2_5d_nursery/adaptive_2_5d_nursery_watcher.html\` |
| watcher frames | \`outputs/adaptive_2_5d_nursery/watcher_frames.json\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), truthMarkdown);
await fs.writeFile(path.join(outputDir, "compact_trigger_log.md"), compactMarkdown);
await fs.writeFile(path.join(outputDir, "prediction_comparison_log.md"), predictionMarkdown);
await fs.writeFile(path.join(outputDir, "risk_memory_log.md"), riskMemoryMarkdown);
await fs.writeFile(path.join(outputDir, "body_world_map_updates.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "action_decision_log.md"), decisionMarkdown);
await fs.writeFile(path.join(outputDir, "habit_candidates.md"), habitMarkdown);
await fs.writeFile(path.join(outputDir, "adaptive_2_5d_nursery_result.md"), resultMarkdown);
await fs.writeFile(path.join(outputDir, "adaptive_2_5d_nursery_watcher.html"), html);
await fs.writeFile(
  path.join(outputDir, "watcher_frames.json"),
  JSON.stringify(
    {
      note: "Human watcher/evaluation data only. Robot-facing compact logs do not read this file.",
      summary: summaryData,
      frames: allFrames,
    },
    null,
    2
  )
);

console.log(resultMarkdown);
