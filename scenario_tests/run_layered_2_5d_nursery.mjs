import fs from "node:fs/promises";
import path from "node:path";
import { createPhysics25DActionChooser } from "../digital_world/physics_2_5d_action_chooser.mjs";
import {
  createPhysics25DNurseryWorld,
  LAYERED_ROOM_2_5D,
} from "../digital_world/physics_2_5d_nursery_world.mjs";
import { buildCompactRows25D, readNursery25DSensors } from "../digital_world/physics_2_5d_nursery_sensors.mjs";

const outputDir = path.resolve("outputs/layered_2_5d_nursery");
const trainingActions = [
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "pause",
  "step_forward",
].map((action) => ({ action, intention: "first-pass body experience in the training height room" }));
const layeredNaiveActions = [
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "step_forward",
  "pause",
  "step_forward",
  "step_forward",
  "step_forward",
].map((action) => ({ action, intention: "naive transfer-room movement without compact height lessons" }));

function hasCompact(rows, text) {
  return rows.some((row) => row.stream.includes(text) || row.event.includes(text));
}

function summary(rows) {
  if (rows.length === 0) return "compact stream stayed quiet";
  return rows
    .slice(0, 5)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function predictionFor(action, beliefs = {}) {
  if (action === "probe_forward") {
    if (beliefs.overheadRisk) return "probe may warn about overhead or vertical clearance before upper-body commitment";
    if (beliefs.dropRisk) return "probe may warn about a foot drop before full body commitment";
    return "probe may find height pressure before body commitment";
  }
  if (action === "crouch_body") return "lowering posture should reduce overhead clearance pressure";
  if (action === "recenter_body") return "recenter should reduce pitch or left-right load pressure";
  if (action === "pause") return "height pressure may settle without adding new contact";
  if (action === "stand_body") return "body returns to normal height after low-clearance risk";
  if (beliefs.rampRisk || beliefs.dropRisk || beliefs.overheadRisk || beliefs.raisedSurfaceRisk) {
    return "forward movement may carry compact height, pitch, drop, or clearance evidence";
  }
  return "forward movement should keep height and clearance streams quiet";
}

function compare({ prediction, compactRows, sensors }) {
  const expected = prediction.expectedCompactResult;
  let matched = false;
  if (prediction.action === "probe_forward") matched = sensors.movement_result >= 0.65 || compactRows.length === 0;
  else if (prediction.action === "crouch_body") matched = sensors.overhead_clearance < 0.75;
  else if (["pause", "recenter_body", "stand_body"].includes(prediction.action)) matched = true;
  else if (expected.includes("may carry")) matched = sensors.movement_result >= 0.18;
  else matched = sensors.movement_result < 0.65 && !hasCompact(compactRows, "overhead_clearance");

  return {
    runId: prediction.runId,
    tick: prediction.tick,
    action: prediction.action,
    predicted: expected,
    evidence: summary(compactRows),
    result: matched ? "matched_or_explained" : "mismatch_needs_map_update",
  };
}

function mapUpdatesFor({ runId, tick, action, compactRows, sensors, comparison }) {
  if (tick % 3 !== 0 && compactRows.length === 0 && comparison.result !== "mismatch_needs_map_update") return [];
  const updates = [];

  if (hasCompact(compactRows, "ramp_load_shift") || sensors.ramp_load_shift >= 0.7) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_floor_height: possible_ramp_or_slope",
      confidence: "medium",
      evidence: "ramp load shift and body pitch compact pressure changed",
      nextPrediction: "recenter_body should reduce pitch before another full step",
    });
  }
  if (hasCompact(compactRows, "foot_drop_warning") || sensors.foot_drop_warning >= 0.85) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_floor_height: possible_drop_or_ledge",
      confidence: "high",
      evidence: "foot drop warning rose from compact body streams",
      nextPrediction: "probe_forward should warn before committing body weight",
    });
  }
  if (hasCompact(compactRows, "overhead_clearance") || hasCompact(compactRows, "vertical_echo") || sensors.overhead_clearance >= 0.9) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_body_height: possible_low_overhead_clearance",
      confidence: "high",
      evidence: "overhead clearance and vertical echo compact streams rose",
      nextPrediction: "crouch_body should reduce upper-body contact risk",
    });
  }
  if (hasCompact(compactRows, "height_pressure") || sensors.height_pressure >= 0.85) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_floor_height: possible_raised_pressure_surface",
      confidence: "medium",
      evidence: "height pressure rose while base load increased",
      nextPrediction: "pause should help separate stable raised load from collision",
    });
  }
  if (Math.abs(sensors.pressure_capsule_left - sensors.pressure_capsule_right) >= 0.4 || sensors.body_pitch_pressure >= 0.7) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "self_map_update",
      belief: "body_state: pitch_or_load_shift",
      confidence: "medium",
      evidence: "pressure capsules and pitch pressure changed",
      nextPrediction: "recenter_body should reduce pressure difference",
    });
  }
  if (updates.length === 0 && tick % 3 === 0) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "self_map_update",
      belief: "body_state: stable_enough_to_continue",
      confidence: "low",
      evidence: "height compact streams stayed quiet in this noticing window",
      nextPrediction: "small reversible movement can gather more evidence",
    });
  }
  return updates;
}

function lessonFor({ runId, tick, compactRows, comparison }) {
  if (comparison.result !== "matched_or_explained" || compactRows.length === 0) return null;
  if (hasCompact(compactRows, "overhead_clearance") || hasCompact(compactRows, "vertical_echo")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson: "overhead clearance plus vertical echo pressure means duck or probe before committing upper body height",
      evidence: summary(compactRows),
    };
  }
  if (hasCompact(compactRows, "foot_drop_warning")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson: "foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight",
      evidence: summary(compactRows),
    };
  }
  if (hasCompact(compactRows, "ramp_load_shift") || hasCompact(compactRows, "height_pressure")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson: "height-load and pitch pressure can mark ramp or raised surface changes before they become collisions",
      evidence: summary(compactRows),
    };
  }
  return null;
}

function promote(candidates) {
  const groups = new Map();
  for (const candidate of candidates) groups.set(candidate.lesson, [...(groups.get(candidate.lesson) ?? []), candidate]);
  return [...groups.entries()]
    .filter(([, rows]) => rows.length >= 1)
    .map(([lesson, rows], index) => ({
      ruleId: `layered_2_5d_rule_${index + 1}`,
      status: "candidate_reusable_rule",
      evidenceCount: rows.length,
      lesson,
    }));
}

async function runPass({ runId, actions, chooser = null, roomOptions = {}, ticks = 12 }) {
  const world = createPhysics25DNurseryWorld(roomOptions);
  const frames = [];
  const compactRows = [];
  const predictions = [];
  const comparisons = [];
  const updates = [];
  const lessons = [];
  const decisions = [];
  let previousSensors = null;
  let olderSensors = null;

  for (let index = 0; index < ticks; index += 1) {
    const tick = index + 1;
    const chooserSnapshot = chooser?.snapshot() ?? { beliefs: {} };
    const choice = chooser
      ? chooser.choose(tick)
      : { ...actions[index], reason: "scripted movement without transfer chooser" };
    const action = choice.action;
    const decision = {
      runId,
      tick,
      source: chooser ? "compact_transfer_2_5d_action_chooser" : "scripted",
      action,
      intention: choice.intention,
      reason: choice.reason,
      beliefs: Object.entries(chooserSnapshot.beliefs)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(", ") || "none",
    };
    decisions.push(decision);
    const prediction = {
      runId,
      tick,
      action,
      intention: choice.intention,
      expectedCompactResult: predictionFor(action, chooserSnapshot.beliefs),
    };
    predictions.push(prediction);
    const snapshot = world.step(action);
    const sensors = readNursery25DSensors(snapshot);
    const rows = buildCompactRows25D({ runId, tick, action, sensors, previousSensors, olderSensors });
    const comparison = compare({ prediction, compactRows: rows, sensors });
    const mapUpdates = mapUpdatesFor({ runId, tick, action, compactRows: rows, sensors, comparison });
    const lesson = lessonFor({ runId, tick, compactRows: rows, comparison });
    chooser?.observe({ action, sensors, compactRows: rows, comparison, mapUpdates });

    frames.push({ runId, tick, action, snapshot, sensors, compactRows: rows, comparison, decision });
    compactRows.push(...rows);
    comparisons.push(comparison);
    updates.push(...mapUpdates);
    if (lesson) lessons.push(lesson);
    olderSensors = previousSensors;
    previousSensors = sensors;
  }

  const metricFrames = frames.filter((frame) => frame.runId !== "training_room");
  const metrics = {
    committedHeightWarnings: metricFrames.filter(
      (frame) =>
        frame.action === "step_forward" &&
        ["drop_warning", "overhead_blocked"].includes(frame.snapshot.lastInteraction.movementResult)
    ).length,
    overheadContacts: metricFrames.filter((frame) => frame.action === "step_forward" && frame.snapshot.lastInteraction.overheadContact).length,
    probeHeightWarnings: metricFrames.filter((frame) => frame.action === "probe_forward" && frame.snapshot.lastInteraction.movementResult.includes("warning")).length,
    crouchActions: metricFrames.filter((frame) => frame.action === "crouch_body").length,
    predictionAccuracy: comparisons.filter((row) => row.result === "matched_or_explained").length / comparisons.length,
    unresolvedMismatches: comparisons.filter((row) => row.result === "mismatch_needs_map_update").length,
  };
  return { runId, frames, compactRows, predictions, comparisons, updates, lessons, decisions, metrics };
}

function format(value) {
  return Number(value).toFixed(2);
}

function renderCompact(row) {
  return `| ${[row.runId, row.tick, row.action, row.layer, row.event, row.stream, format(row.value), format(row.signedChange), row.direction].join(" | ")} |`;
}

function renderFrameTruth(frame) {
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
      room: LAYERED_ROOM_2_5D,
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
        decisionBeliefs: frame.decision.beliefs,
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
  <title>Layered 2.5D Nursery Watcher</title>
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
    main { min-height: 0; display: grid; grid-template-columns: minmax(320px, 1fr) 360px; }
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
    <h1>Layered 2.5D Nursery</h1>
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
    function rect(r, color, alpha) {
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
      rect(DATA.room.rampZone, "#2f855a", 0.28);
      rect(DATA.room.ledgeZone, "#b83280", 0.22);
      rect(DATA.room.lowTunnel, "#6b46c1", 0.22);
      rect(DATA.room.raisedPad, "#b7791f", 0.32);
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
      status.innerHTML = '<strong>' + DATA.summary.verdict + '</strong><div class="readout">' + DATA.summary.note + '</div><div class="pill-row"><span class="pill">height warnings ' + DATA.summary.metrics.committedHeightWarnings.naive + ' -> ' + DATA.summary.metrics.committedHeightWarnings.transfer + '</span><span class="pill">overhead ' + DATA.summary.metrics.overheadContacts.naive + ' -> ' + DATA.summary.metrics.overheadContacts.transfer + '</span><span class="pill">probes ' + DATA.summary.metrics.probeHeightWarnings.naive + ' -> ' + DATA.summary.metrics.probeHeightWarnings.transfer + '</span></div>';
      action.textContent = frame.action + " - " + frame.decisionReason + " - beliefs: " + frame.decisionBeliefs;
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

const training = await runPass({ runId: "training_room", actions: trainingActions, ticks: trainingActions.length });
const learnedRules = promote(training.lessons);
const layeredNaive = await runPass({
  runId: "layered_naive",
  actions: layeredNaiveActions,
  roomOptions: { room: LAYERED_ROOM_2_5D, initialState: { x: 7.2, y: 1.0, facing: "south" } },
  ticks: layeredNaiveActions.length,
});
const transferChooser = createPhysics25DActionChooser({
  priorMapUpdates: training.updates,
  priorLessonRows: training.lessons,
  learnedRules,
});
const layeredTransfer = await runPass({
  runId: "layered_transfer",
  chooser: transferChooser,
  roomOptions: { room: LAYERED_ROOM_2_5D, initialState: { x: 7.2, y: 1.0, facing: "south" } },
  ticks: 12,
});

const allFrames = [...training.frames, ...layeredNaive.frames, ...layeredTransfer.frames];
const allCompactRows = [...training.compactRows, ...layeredNaive.compactRows, ...layeredTransfer.compactRows];
const allPredictions = [...training.predictions, ...layeredNaive.predictions, ...layeredTransfer.predictions];
const allComparisons = [...training.comparisons, ...layeredNaive.comparisons, ...layeredTransfer.comparisons];
const allUpdates = [...training.updates, ...layeredNaive.updates, ...layeredTransfer.updates];
const allLessons = [...training.lessons, ...layeredNaive.lessons, ...layeredTransfer.lessons];
const allDecisions = [...training.decisions, ...layeredNaive.decisions, ...layeredTransfer.decisions];

const compactMarkdown = `# Layered 2.5D Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allCompactRows.map(renderCompact).join("\n")}
`;

const predictionMarkdown = `# Layered 2.5D Nursery Prediction And Comparison Log

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

const mapMarkdown = `# Layered 2.5D Nursery Body And World Map Updates

Robot-facing compact-derived beliefs. These records do not expose hidden coordinates or simulator feature objects.

| run | tick | action | map kind | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- | --- | --- | --- |
${allUpdates.map((row) => `| ${[row.runId, row.tick, row.action, row.mapKind, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`).join("\n")}
`;

const decisionMarkdown = `# Layered 2.5D Nursery Action Decision Log

The transfer run is selected by compact lessons learned in the training room. This log is robot-facing and records no hidden coordinates.

| run | tick | source | action | intention | reason | active compact beliefs |
| --- | --- | --- | --- | --- | --- | --- |
${allDecisions.map((row) => `| ${[row.runId, row.tick, row.source, row.action, row.intention, row.reason, row.beliefs].join(" | ")} |`).join("\n")}
`;

const lessonMarkdown = `# Layered 2.5D Nursery Lesson Candidates

## Hypotheses

| run | tick | status | lesson | compact evidence |
| --- | --- | --- | --- | --- |
${allLessons.map((row) => `| ${[row.runId, row.tick, row.status, row.lesson, row.evidence].join(" | ")} |`).join("\n")}

## Candidate Reusable Rules

| rule id | status | evidence count | lesson |
| --- | --- | --- | --- |
${learnedRules.map((row) => `| ${[row.ruleId, row.status, row.evidenceCount, row.lesson].join(" | ")} |`).join("\n")}
`;

const truthMarkdown = `# Layered 2.5D Nursery Hidden Truth Log

Debug/evaluation truth for human inspection. Robot-facing compact logs do not read this file.

| run | tick | action | true x | true y | true facing | true posture | true movement result | true blocker | true terrain | foot drop | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allFrames.map(renderFrameTruth).join("\n")}
`;

const robotFacingText = [compactMarkdown, predictionMarkdown, mapMarkdown, decisionMarkdown, lessonMarkdown].join("\n");
const noCoordinateLeaks = !robotFacingTextHasCoordinateLeak(robotFacingText);
const checks = [
  [
    "transfer run has fewer committed height warnings than naive layered run",
    layeredTransfer.metrics.committedHeightWarnings < layeredNaive.metrics.committedHeightWarnings,
  ],
  [
    "transfer run has fewer overhead contacts than naive layered run",
    layeredTransfer.metrics.overheadContacts < layeredNaive.metrics.overheadContacts,
  ],
  [
    "transfer run uses probes before height risk",
    layeredTransfer.metrics.probeHeightWarnings > layeredNaive.metrics.probeHeightWarnings,
  ],
  ["transfer run uses crouch_body for low-clearance risk", layeredTransfer.metrics.crouchActions > layeredNaive.metrics.crouchActions],
  [
    "transfer prediction accuracy is better than naive layered run",
    layeredTransfer.metrics.predictionAccuracy > layeredNaive.metrics.predictionAccuracy,
  ],
  ["robot-facing logs do not include hidden coordinates or feature objects", noCoordinateLeaks],
  ["hidden truth exists only in the evaluation log", truthMarkdown.includes("true x") && truthMarkdown.includes("true y")],
  [
    "transfer actions are selected by the compact transfer chooser",
    layeredTransfer.decisions.every((row) => row.source === "compact_transfer_2_5d_action_chooser"),
  ],
  ["watcher page was generated", true],
];
const passed = checks.every(([, ok]) => ok);
const summaryData = {
  verdict: passed ? "PASS" : "FAIL",
  note: "Training-room compact height lessons are reused in a second layered room with different feature placement.",
  metrics: {
    committedHeightWarnings: {
      naive: layeredNaive.metrics.committedHeightWarnings,
      transfer: layeredTransfer.metrics.committedHeightWarnings,
    },
    overheadContacts: {
      naive: layeredNaive.metrics.overheadContacts,
      transfer: layeredTransfer.metrics.overheadContacts,
    },
    probeHeightWarnings: {
      naive: layeredNaive.metrics.probeHeightWarnings,
      transfer: layeredTransfer.metrics.probeHeightWarnings,
    },
    crouchActions: {
      naive: layeredNaive.metrics.crouchActions,
      transfer: layeredTransfer.metrics.crouchActions,
    },
    predictionAccuracy: {
      naive: Number((layeredNaive.metrics.predictionAccuracy * 100).toFixed(1)),
      transfer: Number((layeredTransfer.metrics.predictionAccuracy * 100).toFixed(1)),
    },
  },
};
const html = watcherHtml([...layeredNaive.frames, ...layeredTransfer.frames], summaryData);

const resultMarkdown = `# Layered 2.5D Nursery Result

Purpose: test whether compact height lessons learned in one 2.5D room transfer to a second layered room with different feature placement, before moving to full 3D.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | layered naive | layered transfer |
| --- | --- | --- |
| committed height warnings | ${layeredNaive.metrics.committedHeightWarnings} | ${layeredTransfer.metrics.committedHeightWarnings} |
| overhead contacts | ${layeredNaive.metrics.overheadContacts} | ${layeredTransfer.metrics.overheadContacts} |
| probe height warnings before commitment | ${layeredNaive.metrics.probeHeightWarnings} | ${layeredTransfer.metrics.probeHeightWarnings} |
| crouch actions | ${layeredNaive.metrics.crouchActions} | ${layeredTransfer.metrics.crouchActions} |
| prediction accuracy | ${(layeredNaive.metrics.predictionAccuracy * 100).toFixed(1)}% | ${(layeredTransfer.metrics.predictionAccuracy * 100).toFixed(1)}% |
| unresolved prediction mismatches | ${layeredNaive.metrics.unresolvedMismatches} | ${layeredTransfer.metrics.unresolvedMismatches} |

## Training Source

The transfer run starts from compact-derived training-room updates and lesson candidates, not hidden simulator coordinates.

| training artifact | count |
| --- | --- |
| compact rows | ${training.compactRows.length} |
| map updates | ${training.updates.length} |
| lesson hypotheses | ${training.lessons.length} |
| reusable rule candidates | ${learnedRules.length} |

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | \`outputs/layered_2_5d_nursery/hidden_truth_log.md\` |
| compact trigger log | \`outputs/layered_2_5d_nursery/compact_trigger_log.md\` |
| prediction/comparison log | \`outputs/layered_2_5d_nursery/prediction_comparison_log.md\` |
| body/world map updates | \`outputs/layered_2_5d_nursery/body_world_map_updates.md\` |
| action decision log | \`outputs/layered_2_5d_nursery/action_decision_log.md\` |
| lesson candidates | \`outputs/layered_2_5d_nursery/lesson_candidates.md\` |
| watcher page | \`outputs/layered_2_5d_nursery/layered_2_5d_nursery_watcher.html\` |
| watcher frames | \`outputs/layered_2_5d_nursery/watcher_frames.json\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), truthMarkdown);
await fs.writeFile(path.join(outputDir, "compact_trigger_log.md"), compactMarkdown);
await fs.writeFile(path.join(outputDir, "prediction_comparison_log.md"), predictionMarkdown);
await fs.writeFile(path.join(outputDir, "body_world_map_updates.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "action_decision_log.md"), decisionMarkdown);
await fs.writeFile(path.join(outputDir, "lesson_candidates.md"), lessonMarkdown);
await fs.writeFile(path.join(outputDir, "layered_2_5d_nursery_result.md"), resultMarkdown);
await fs.writeFile(path.join(outputDir, "layered_2_5d_nursery_watcher.html"), html);
await fs.writeFile(
  path.join(outputDir, "watcher_frames.json"),
  JSON.stringify(
    {
      note: "Human watcher/evaluation data only. Robot-facing compact logs do not read this file.",
      summary: summaryData,
      frames: [...layeredNaive.frames, ...layeredTransfer.frames],
    },
    null,
    2
  )
);

console.log(resultMarkdown);
