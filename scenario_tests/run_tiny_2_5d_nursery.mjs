import fs from "node:fs/promises";
import path from "node:path";
import { createPhysics25DActionChooser } from "../digital_world/physics_2_5d_action_chooser.mjs";
import { createPhysics25DNurseryWorld } from "../digital_world/physics_2_5d_nursery_world.mjs";
import { buildCompactRows25D, readNursery25DSensors } from "../digital_world/physics_2_5d_nursery_sensors.mjs";

const outputDir = path.resolve("outputs/tiny_2_5d_nursery");
const hiddenTruthPath = path.join(outputDir, "hidden_truth_log.md");
const compactLogPath = path.join(outputDir, "compact_trigger_log.md");
const predictionPath = path.join(outputDir, "prediction_comparison_log.md");
const mapUpdatePath = path.join(outputDir, "body_world_map_updates.md");
const lessonPath = path.join(outputDir, "lesson_candidates.md");
const actionDecisionPath = path.join(outputDir, "action_decision_log.md");
const resultPath = path.join(outputDir, "tiny_2_5d_nursery_result.md");
const watcherPath = path.join(outputDir, "tiny_2_5d_nursery_watcher.html");
const watcherDataPath = path.join(outputDir, "watcher_frames.json");

const runOneActions = [
  { action: "step_forward", intention: "begin through the nursery path" },
  { action: "step_forward", intention: "continue across the first height change" },
  { action: "step_forward", intention: "keep moving after the load shift" },
  { action: "step_forward", intention: "commit body weight near the foot-warning area" },
  { action: "step_forward", intention: "continue after the pitch warning" },
  { action: "step_forward", intention: "try the narrowing overhead path while standing" },
  { action: "step_forward", intention: "push forward under low clearance" },
  { action: "step_forward", intention: "continue toward the raised surface" },
  { action: "pause", intention: "let body pressure settle" },
  { action: "step_forward", intention: "test the final raised-pressure patch" },
];

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function hasCompact(rows, text) {
  return rows.some((row) => row.stream.includes(text) || row.event.includes(text));
}

function strongestCompactSummary(rows) {
  if (rows.length === 0) return "compact stream stayed quiet";
  return rows
    .slice(0, 5)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function priorBeliefsFor(action, chooserBeliefs = {}) {
  return {
    expectHeightRisk:
      chooserBeliefs.rampRisk || chooserBeliefs.dropRisk || chooserBeliefs.overheadRisk || chooserBeliefs.raisedSurfaceRisk,
    expectOverheadRisk: chooserBeliefs.overheadRisk,
    expectDropRisk: chooserBeliefs.dropRisk,
  };
}

function expectationForAction(action, beliefs) {
  if (action === "probe_forward") {
    if (beliefs.expectOverheadRisk) return "probe may report low overhead clearance before upper-body commitment";
    if (beliefs.expectDropRisk) return "probe may report foot drop before full body commitment";
    return "probe should find weak height pressure without body commitment";
  }
  if (action === "crouch_body") return "overhead clearance pressure should reduce before stepping";
  if (action === "stand_body") return "body returns to normal height after low-clearance area";
  if (action === "recenter_body") return "body pitch and load pressure should reduce if ramp pressure was active";
  if (action === "pause") return "raised or height pressure may settle without new contact";
  if (action === "step_forward") {
    return beliefs.expectHeightRisk
      ? "forward movement may carry height, drop, pitch, or clearance compact evidence"
      : "body should move forward with quiet height and clearance streams";
  }
  return "compact stream should remain stable";
}

function predictBeforeAction({ runId, tick, action, intention, priorBeliefs }) {
  const expected = expectationForAction(action, priorBeliefs);
  return {
    runId,
    tick,
    action,
    intention,
    prediction: expected,
    expectedCompactResult: expected,
  };
}

function compareAfterAction({ prediction, compactRows, sensors }) {
  const action = prediction.action;
  let matched = false;
  let updateTarget = "watch";

  if (action === "probe_forward") {
    matched = sensors.movement_result >= 0.65 || compactRows.length === 0;
    updateTarget = compactRows.length ? "world_map" : "self_map";
  } else if (action === "crouch_body") {
    matched = sensors.overhead_clearance < 0.75;
    updateTarget = "self_map";
  } else if (action === "stand_body" || action === "pause" || action === "recenter_body") {
    matched = true;
    updateTarget = "self_map";
  } else if (action === "step_forward") {
    matched = prediction.expectedCompactResult.includes("may carry")
      ? sensors.movement_result >= 0.18
      : sensors.movement_result < 0.65 && !hasCompact(compactRows, "overhead_clearance");
    updateTarget = sensors.movement_result >= 0.65 || compactRows.length ? "world_map" : "self_map";
  } else {
    matched = true;
  }

  return {
    runId: prediction.runId,
    tick: prediction.tick,
    action,
    phase: "immediate_comparison",
    predicted: prediction.prediction,
    evidence: strongestCompactSummary(compactRows),
    result: matched ? "matched_or_explained" : "mismatch_needs_map_update",
    updateTarget,
  };
}

function detectCompactSurprise({ runId, tick, action, compactRows }) {
  return compactRows
    .filter(
      (row) =>
        row.layer === "n" ||
        row.layer === "n^-2" ||
        row.event === "cross_sensor_compact_agreement" ||
        (row.layer === "n^-1" && Math.abs(row.signedChange) >= 0.65)
    )
    .map((row) => ({
      runId,
      tick,
      action,
      trigger: `${row.layer}:${row.event}`,
      evidence: `${row.stream} ${row.direction}`,
      route: "prediction_review_body_noticing_and_height_map_update",
    }));
}

function runBodyNoticingCron({ runId, tick, action, compactRows, sensors, comparison, forced = false }) {
  const shouldRun = forced || tick % 3 === 0 || comparison.result === "mismatch_needs_map_update";
  if (!shouldRun) return [];
  const updates = [];

  if (hasCompact(compactRows, "ramp_load_shift") || sensors.ramp_load_shift >= 0.7) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_floor_height: possible_ramp_or_slope",
      confidence: "medium",
      evidence: "ramp load shift and body pitch pressure changed during forward movement",
      nextPrediction: "recenter_body should reduce pitch before the next full step",
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
      evidence: "foot drop warning rose with body pitch pressure",
      nextPrediction: "probe_forward should warn before committing body weight",
    });
  }

  if (hasCompact(compactRows, "overhead_clearance") || sensors.overhead_clearance >= 0.9) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_body_height: possible_low_overhead_clearance",
      confidence: "high",
      evidence: "overhead clearance and vertical echo compact streams rose together",
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
      evidence: "height pressure rose while both base sensors carried load",
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
      evidence: "pressure capsules and pitch pressure changed without needing hidden body coordinates",
      nextPrediction: "recenter_body should reduce the pressure difference",
    });
  }

  if (updates.length === 0) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "self_map_update",
      belief: "body_state: stable_enough_to_continue",
      confidence: "low",
      evidence: "height and clearance compact streams stayed quiet in this noticing window",
      nextPrediction: "small reversible action can gather more evidence",
    });
  }

  return updates;
}

function lessonCandidate({ runId, tick, compactRows, comparison }) {
  if (comparison.result !== "matched_or_explained" || compactRows.length === 0) return null;
  if (hasCompact(compactRows, "overhead_clearance") || hasCompact(compactRows, "vertical_echo")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson: "overhead clearance plus vertical echo pressure means duck or probe before committing upper body height",
      evidence: strongestCompactSummary(compactRows),
    };
  }
  if (hasCompact(compactRows, "foot_drop_warning")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson: "foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight",
      evidence: strongestCompactSummary(compactRows),
    };
  }
  if (hasCompact(compactRows, "ramp_load_shift") || hasCompact(compactRows, "height_pressure")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson: "height-load and pitch pressure can mark ramp or raised surface changes before they become collisions",
      evidence: strongestCompactSummary(compactRows),
    };
  }
  return null;
}

function promoteReusableLessons(candidates) {
  const groups = new Map();
  for (const candidate of candidates) {
    groups.set(candidate.lesson, [...(groups.get(candidate.lesson) ?? []), candidate]);
  }
  return [...groups.entries()]
    .filter(([, rows]) => rows.length >= 2 || rows.some((row) => row.evidence.includes("cross_sensor")))
    .map(([lesson, rows], index) => ({
      ruleId: `tiny_2_5d_rule_${index + 1}`,
      status: "candidate_reusable_rule",
      evidenceCount: rows.length,
      lesson,
    }));
}

function renderCompactRow(row) {
  return `| ${[
    row.runId,
    row.tick,
    row.action,
    row.layer,
    row.event,
    row.stream,
    formatNumber(row.value),
    formatNumber(row.signedChange),
    row.direction,
  ].join(" | ")} |`;
}

function renderUpdate(row) {
  return `| ${[row.runId, row.tick, row.action, row.mapKind, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`;
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

async function runPass({ runId, actions, learnedRules, chooser = null, maxTicks = null }) {
  const world = createPhysics25DNurseryWorld();
  const frames = [];
  const compactRows = [];
  const predictions = [];
  const comparisons = [];
  const surpriseRows = [];
  const mapUpdates = [];
  const lessonRows = [];
  const actionDecisions = [];
  let previousSensors = null;
  let olderSensors = null;
  const plannedTicks = actions?.length ?? maxTicks ?? 12;

  for (let index = 0; index < plannedTicks; index += 1) {
    const tick = index + 1;
    const choice = chooser
      ? chooser.choose(tick)
      : { ...actions[index], reason: "scripted first-pass height experience", source: "scripted" };
    const chooserSnapshot = chooser?.snapshot() ?? { beliefs: {} };
    const plan = { ...choice, source: chooser ? "compact_2_5d_action_chooser" : "scripted" };
    actionDecisions.push({
      runId,
      tick,
      source: plan.source,
      action: plan.action,
      intention: plan.intention,
      reason: plan.reason,
      beliefs:
        Object.entries(chooserSnapshot.beliefs)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(", ") || "none",
    });

    const prediction = predictBeforeAction({
      runId,
      tick,
      action: plan.action,
      intention: plan.intention,
      priorBeliefs: priorBeliefsFor(plan.action, chooserSnapshot.beliefs),
    });
    predictions.push(prediction);

    const snapshot = world.step(plan.action);
    const sensors = readNursery25DSensors(snapshot);
    const rows = buildCompactRows25D({ runId, tick, action: plan.action, sensors, previousSensors, olderSensors });
    const comparison = compareAfterAction({ prediction, compactRows: rows, sensors });
    const surprise = detectCompactSurprise({ runId, tick, action: plan.action, compactRows: rows });
    const updates = runBodyNoticingCron({
      runId,
      tick,
      action: plan.action,
      compactRows: rows,
      sensors,
      comparison,
      forced: surprise.length > 0 || sensors.movement_result >= 0.75,
    });
    const candidate = lessonCandidate({ runId, tick, compactRows: rows, comparison });
    chooser?.observe({ action: plan.action, sensors, compactRows: rows, comparison, mapUpdates: updates });

    frames.push({
      runId,
      tick,
      action: plan.action,
      intention: plan.intention,
      snapshot,
      sensors,
      compactRows: rows,
      comparison,
      decision: actionDecisions.at(-1),
    });
    compactRows.push(...rows);
    comparisons.push(comparison);
    surpriseRows.push(...surprise);
    mapUpdates.push(...updates);
    if (candidate) lessonRows.push(candidate);
    olderSensors = previousSensors;
    previousSensors = sensors;
  }

  const immediateComparisons = comparisons.filter((row) => row.phase === "immediate_comparison");
  const metrics = {
    committedHeightWarnings: frames.filter(
      (frame) =>
        frame.action === "step_forward" &&
        ["drop_warning", "overhead_blocked"].includes(frame.snapshot.lastInteraction.movementResult)
    ).length,
    overheadContacts: frames.filter((frame) => frame.snapshot.lastInteraction.overheadContact && frame.action === "step_forward").length,
    probeHeightWarnings: frames.filter((frame) => frame.action === "probe_forward" && frame.snapshot.lastInteraction.movementResult.includes("warning")).length,
    crouchActions: frames.filter((frame) => frame.action === "crouch_body").length,
    predictionAccuracy:
      immediateComparisons.filter((row) => row.result === "matched_or_explained").length / immediateComparisons.length,
    unresolvedMismatches: comparisons.filter((row) => row.result === "mismatch_needs_map_update").length,
  };

  return {
    runId,
    frames,
    compactRows,
    predictions,
    comparisons,
    surpriseRows,
    mapUpdates,
    lessonRows,
    actionDecisions,
    metrics,
  };
}

function buildWatcherHtml(frames, room, summary) {
  const data = JSON.stringify(
    {
      room,
      summary,
      frames: frames.map((frame) => ({
        runId: frame.runId,
        tick: frame.tick,
        action: frame.action,
        intention: frame.intention,
        x: frame.snapshot.x,
        y: frame.snapshot.y,
        facing: frame.snapshot.facing,
        posture: frame.snapshot.posture,
        movementResult: frame.snapshot.lastInteraction.movementResult,
        terrain: frame.snapshot.lastInteraction.terrain,
        sensors: frame.sensors,
        compactSummary: frame.compactRows.slice(0, 6).map((row) => `${row.stream} ${row.layer} ${row.direction}`),
        comparison: frame.comparison.result,
        decisionReason: frame.decision?.reason ?? "",
        decisionBeliefs: frame.decision?.beliefs ?? "none",
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
  <title>Tiny 2.5D Nursery Watcher</title>
  <style>
    :root { color-scheme: light; --ink:#20252b; --muted:#5d6875; --line:#c8d1dc; --panel:#fff; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:var(--ink); background:#e8edf2; display:grid; grid-template-rows:auto 1fr; }
    .toolbar { display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--panel); border-bottom:1px solid var(--line); flex-wrap:wrap; }
    h1,h2 { margin:0; letter-spacing:0; }
    h1 { font-size:18px; }
    h2 { font-size:14px; margin-top:16px; }
    button { min-width:42px; height:34px; border:1px solid var(--line); border-radius:6px; background:#fff; color:var(--ink); font:inherit; cursor:pointer; }
    button.primary { background:#1f7a8c; border-color:#1f7a8c; color:#fff; }
    input[type="range"] { width:220px; }
    .layout { min-height:0; display:grid; grid-template-columns:minmax(320px,1fr) 360px; }
    .stage { min-height:0; display:grid; padding:14px; }
    canvas { width:100%; height:100%; min-height:430px; background:#f6f8f2; border:1px solid var(--line); }
    aside { min-height:0; overflow:auto; background:#f8fafc; border-left:1px solid var(--line); padding:14px; }
    .readout { color:var(--muted); font-size:13px; }
    .status { display:grid; gap:8px; padding:10px; border:1px solid var(--line); background:#fff; border-radius:6px; }
    .status.pass { border-color:#2f855a; }
    .status.fail { border-color:#b91c1c; }
    .status-title { font-weight:700; }
    .pill-row { display:flex; flex-wrap:wrap; gap:6px; }
    .pill { display:inline-flex; min-height:24px; align-items:center; padding:2px 8px; border:1px solid var(--line); border-radius:999px; color:var(--muted); font-size:12px; }
    .pill.good { border-color:#2f855a; color:#276749; background:#f0fff4; }
    .pill.warn { border-color:#b7791f; color:#975a16; background:#fffaf0; }
    .row { display:grid; grid-template-columns:1fr auto; gap:8px; padding:5px 0; border-bottom:1px solid #e2e8f0; font-size:13px; }
    .compact,.lesson-list { margin:8px 0 0; padding-left:18px; color:var(--muted); font-size:13px; }
    @media (max-width:840px) { .layout { grid-template-columns:1fr; } aside { border-left:0; border-top:1px solid var(--line); } canvas { min-height:360px; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>Tiny 2.5D Nursery</h1>
    <button id="play" class="primary" type="button">Play</button>
    <button id="back" type="button">Prev</button>
    <button id="next" type="button">Next</button>
    <input id="scrub" type="range" min="0" value="0">
    <span id="label" class="readout"></span>
  </div>
  <main class="layout">
    <section class="stage"><canvas id="nursery" aria-label="Tiny 2.5D nursery watcher"></canvas></section>
    <aside>
      <h2>Run Status</h2><div id="status" class="status"></div>
      <h2>Action</h2><div id="action" class="readout"></div>
      <h2>Compact Feeling</h2><ul id="compact" class="compact"></ul>
      <h2>Lessons</h2><ul id="lessons" class="lesson-list"></ul>
      <h2>Sensor Values</h2><div id="sensors"></div>
    </aside>
  </main>
  <script>
    const WATCHER_DATA = ${data};
    const canvas = document.getElementById("nursery");
    const ctx = canvas.getContext("2d");
    const playButton = document.getElementById("play");
    const scrub = document.getElementById("scrub");
    const label = document.getElementById("label");
    const action = document.getElementById("action");
    const compact = document.getElementById("compact");
    const status = document.getElementById("status");
    const lessons = document.getElementById("lessons");
    const sensors = document.getElementById("sensors");
    let index = 0;
    let timer = null;
    let autoplayUntil = Date.now() + 120000;
    scrub.max = WATCHER_DATA.frames.length - 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw();
    }
    function worldToCanvas(point) {
      const rect = canvas.getBoundingClientRect();
      const pad = 24;
      const scale = Math.min((rect.width - pad * 2) / WATCHER_DATA.room.width, (rect.height - pad * 2) / WATCHER_DATA.room.height);
      return { x: pad + point.x * scale, y: pad + point.y * scale, scale };
    }
    function drawRect(rect, color, alpha) {
      const a = worldToCanvas({ x: rect.x1, y: rect.y1 });
      const b = worldToCanvas({ x: rect.x2, y: rect.y2 });
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      ctx.globalAlpha = 1;
    }
    function draw() {
      const frame = WATCHER_DATA.frames[index];
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const origin = worldToCanvas({ x: 0, y: 0 });
      const end = worldToCanvas({ x: WATCHER_DATA.room.width, y: WATCHER_DATA.room.height });
      ctx.fillStyle = "#f6f8f2";
      ctx.fillRect(origin.x, origin.y, end.x - origin.x, end.y - origin.y);
      ctx.strokeStyle = "#46515d";
      ctx.lineWidth = 6;
      ctx.strokeRect(origin.x, origin.y, end.x - origin.x, end.y - origin.y);
      drawRect(WATCHER_DATA.room.rampZone, "#2f855a", 0.28);
      drawRect(WATCHER_DATA.room.ledgeZone, "#b83280", 0.22);
      drawRect(WATCHER_DATA.room.lowTunnel, "#6b46c1", 0.22);
      drawRect(WATCHER_DATA.room.raisedPad, "#b7791f", 0.32);
      const p = worldToCanvas({ x: frame.x, y: frame.y });
      const size = Math.max(18, p.scale * 0.68);
      ctx.save();
      ctx.translate(p.x, p.y);
      const angle = { north:-Math.PI/2, east:0, south:Math.PI/2, west:Math.PI }[frame.facing];
      ctx.rotate(angle);
      ctx.fillStyle = frame.movementResult.includes("overhead") ? "#b91c1c" : frame.movementResult.includes("warning") ? "#b7791f" : frame.posture === "crouched" ? "#2f855a" : "#1f7a8c";
      ctx.strokeStyle = "#20252b";
      ctx.lineWidth = 2;
      const bodyHeight = frame.posture === "crouched" ? size * 0.68 : size;
      ctx.fillRect(-size / 2, -bodyHeight / 2, size, bodyHeight);
      ctx.strokeRect(-size / 2, -bodyHeight / 2, size, bodyHeight);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(size / 2 + 8, 0);
      ctx.lineTo(size / 2 - 5, -7);
      ctx.lineTo(size / 2 - 5, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      const remaining = Math.max(0, Math.ceil((autoplayUntil - Date.now()) / 1000));
      label.textContent = frame.runId + " tick " + frame.tick + " / " + frame.movementResult + (remaining ? " / auto " + remaining + "s" : "");
      action.textContent = frame.action + " - " + frame.intention + " - " + frame.comparison + (frame.decisionReason ? " - " + frame.decisionReason : "");
      compact.innerHTML = frame.compactSummary.length ? frame.compactSummary.map((item) => "<li>" + item + "</li>").join("") : "<li>compact stream quiet</li>";
      status.className = "status " + (WATCHER_DATA.summary.verdict === "PASS" ? "pass" : "fail");
      status.innerHTML = [
        '<div class="status-title">' + WATCHER_DATA.summary.verdict + ' - ' + (frame.runId === "run_2" ? "Run 2 compact 2.5D chooser" : "Run 1 first pass") + '</div>',
        '<div class="readout">' + WATCHER_DATA.summary.note + '</div>',
        '<div class="pill-row">',
        '<span class="pill good">committed height warnings ' + WATCHER_DATA.summary.metrics.committedHeightWarnings.run1 + ' -> ' + WATCHER_DATA.summary.metrics.committedHeightWarnings.run2 + '</span>',
        '<span class="pill good">overhead contacts ' + WATCHER_DATA.summary.metrics.overheadContacts.run1 + ' -> ' + WATCHER_DATA.summary.metrics.overheadContacts.run2 + '</span>',
        '<span class="pill good">probes ' + WATCHER_DATA.summary.metrics.probeHeightWarnings.run1 + ' -> ' + WATCHER_DATA.summary.metrics.probeHeightWarnings.run2 + '</span>',
        '<span class="pill ' + (frame.comparison === "matched_or_explained" ? "good" : "warn") + '">' + frame.comparison + '</span>',
        '</div>'
      ].join("");
      lessons.innerHTML = WATCHER_DATA.summary.rules.length ? WATCHER_DATA.summary.rules.map((rule) => "<li>" + rule.lesson + "</li>").join("") : "<li>No reusable lesson candidate yet.</li>";
      sensors.innerHTML = Object.entries(frame.sensors).map(([key, value]) => '<div class="row"><span>' + key + '</span><span>' + Number(value).toFixed(2) + '</span></div>').join("");
      scrub.value = index;
    }
    function setIndex(nextIndex) { index = Math.max(0, Math.min(WATCHER_DATA.frames.length - 1, nextIndex)); draw(); }
    function startPlayback() {
      if (timer) { clearInterval(timer); timer = null; playButton.textContent = "Play"; return; }
      playButton.textContent = "Pause";
      timer = setInterval(() => {
        if (index === WATCHER_DATA.frames.length - 1 && Date.now() < autoplayUntil) { setIndex(0); return; }
        setIndex(index + 1);
        if (index === WATCHER_DATA.frames.length - 1 && Date.now() >= autoplayUntil) { clearInterval(timer); timer = null; playButton.textContent = "Play"; }
      }, 700);
    }
    playButton.addEventListener("click", () => { autoplayUntil = Date.now() + 120000; startPlayback(); });
    document.getElementById("back").addEventListener("click", () => setIndex(index - 1));
    document.getElementById("next").addEventListener("click", () => setIndex(index + 1));
    scrub.addEventListener("input", () => setIndex(Number(scrub.value)));
    addEventListener("resize", resize);
    resize();
    startPlayback();
  </script>
</body>
</html>`;
}

await fs.mkdir(outputDir, { recursive: true });

const run1 = await runPass({ runId: "run_1", actions: runOneActions, learnedRules: [] });
const firstPassRules = promoteReusableLessons(run1.lessonRows);
const run2Chooser = createPhysics25DActionChooser({
  priorMapUpdates: run1.mapUpdates,
  priorLessonRows: run1.lessonRows,
  learnedRules: firstPassRules,
});
const run2 = await runPass({ runId: "run_2", chooser: run2Chooser, learnedRules: firstPassRules, maxTicks: 12 });
const reusableRules = promoteReusableLessons([...run1.lessonRows, ...run2.lessonRows]);

const allFrames = [...run1.frames, ...run2.frames];
const allCompactRows = [...run1.compactRows, ...run2.compactRows];
const allPredictions = [...run1.predictions, ...run2.predictions];
const allComparisons = [...run1.comparisons, ...run2.comparisons];
const allSurprises = [...run1.surpriseRows, ...run2.surpriseRows];
const allUpdates = [...run1.mapUpdates, ...run2.mapUpdates];
const allLessons = [...run1.lessonRows, ...run2.lessonRows];
const allActionDecisions = [...run1.actionDecisions, ...run2.actionDecisions];

const compactMarkdown = `# Tiny 2.5D Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allCompactRows.map(renderCompactRow).join("\n")}
`;

const predictionMarkdown = `# Tiny 2.5D Nursery Prediction And Comparison Log

Every intentional action receives a prediction before action and an immediate compact comparison after action.

| run | tick | action | phase | intention or prediction | compact evidence | result | update target |
| --- | --- | --- | --- | --- | --- | --- | --- |
${allPredictions
  .flatMap((prediction) => [
    `| ${[prediction.runId, prediction.tick, prediction.action, "prediction_before_action", prediction.intention, prediction.expectedCompactResult, "", ""].join(" | ")} |`,
    ...allComparisons
      .filter((comparison) => comparison.runId === prediction.runId && comparison.tick === prediction.tick && comparison.action === prediction.action)
      .map((comparison) => `| ${[comparison.runId, comparison.tick, comparison.action, comparison.phase, comparison.predicted, comparison.evidence, comparison.result, comparison.updateTarget].join(" | ")} |`),
  ])
  .join("\n")}
`;

const updateMarkdown = `# Tiny 2.5D Nursery Body And World Map Updates

Caregiver-style body-noticing runs every three ticks plus after compact surprise. These are robot-facing self/world beliefs, not simulator truth.

| run | tick | action | map kind | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- | --- | --- | --- |
${allUpdates.map(renderUpdate).join("\n")}

## Compact Surprise Routing

| run | tick | action | trigger | evidence | route |
| --- | --- | --- | --- | --- | --- |
${allSurprises.map((row) => `| ${[row.runId, row.tick, row.action, row.trigger, row.evidence, row.route].join(" | ")} |`).join("\n")}
`;

const actionDecisionMarkdown = `# Tiny 2.5D Nursery Action Decision Log

Run 1 is a scripted first-pass height/body experience. Run 2 is selected by the compact 2.5D action chooser from prior compact-derived beliefs plus current compact outcomes. This log is robot-facing: it records no hidden coordinates.

| run | tick | source | action | intention | reason | active compact beliefs |
| --- | --- | --- | --- | --- | --- | --- |
${allActionDecisions.map((row) => `| ${[row.runId, row.tick, row.source, row.action, row.intention, row.reason, row.beliefs].join(" | ")} |`).join("\n")}
`;

const lessonMarkdown = `# Tiny 2.5D Nursery Lesson Candidates

One event can create a hypothesis. Reusable candidates require repeated compact evidence or strong cross-sensor agreement.

## Hypotheses

| run | tick | status | lesson | compact evidence |
| --- | --- | --- | --- | --- |
${allLessons.map((row) => `| ${[row.runId, row.tick, row.status, row.lesson, row.evidence].join(" | ")} |`).join("\n")}

## Candidate Reusable Rules

| rule id | status | evidence count | lesson |
| --- | --- | --- | --- |
${reusableRules.map((row) => `| ${[row.ruleId, row.status, row.evidenceCount, row.lesson].join(" | ")} |`).join("\n")}
`;

const hiddenTruthMarkdown = `# Tiny 2.5D Nursery Hidden Truth Log

Debug/evaluation truth for the human watcher and pass/fail checks. The robot-facing logs do not read this file.

| run | tick | action | true x | true y | true facing | true posture | true movement result | true blocker | true terrain | foot drop | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allFrames.map(renderTruth).join("\n")}
`;

const robotFacingCombined = [compactMarkdown, predictionMarkdown, updateMarkdown, actionDecisionMarkdown, lessonMarkdown].join("\n");
const noCoordinateLeaks = !robotFacingTextHasCoordinateLeak(robotFacingCombined);
const run2SaferHeight = run2.metrics.committedHeightWarnings < run1.metrics.committedHeightWarnings;
const run2SaferOverhead = run2.metrics.overheadContacts < run1.metrics.overheadContacts;
const run2UsesProbes = run2.metrics.probeHeightWarnings > run1.metrics.probeHeightWarnings;
const run2Ducks = run2.metrics.crouchActions > run1.metrics.crouchActions;
const run2PredictsNoWorse = run2.metrics.predictionAccuracy >= run1.metrics.predictionAccuracy;
const hiddenTruthHasCoordinates = hiddenTruthMarkdown.includes("true x") && hiddenTruthMarkdown.includes("true y");
const allRun2Chosen = run2.actionDecisions.every((row) => row.source === "compact_2_5d_action_chooser");
const watcherSummary = {
  verdict:
    run2SaferHeight && run2SaferOverhead && run2UsesProbes && run2Ducks && run2PredictsNoWorse && noCoordinateLeaks
      ? "PASS"
      : "FAIL",
  note: "The watcher loops generated frames. The robot-facing logs see compact streams only; hidden truth is evaluation data.",
  metrics: {
    committedHeightWarnings: { run1: run1.metrics.committedHeightWarnings, run2: run2.metrics.committedHeightWarnings },
    overheadContacts: { run1: run1.metrics.overheadContacts, run2: run2.metrics.overheadContacts },
    probeHeightWarnings: { run1: run1.metrics.probeHeightWarnings, run2: run2.metrics.probeHeightWarnings },
    crouchActions: { run1: run1.metrics.crouchActions, run2: run2.metrics.crouchActions },
    predictionAccuracy: {
      run1: Number((run1.metrics.predictionAccuracy * 100).toFixed(1)),
      run2: Number((run2.metrics.predictionAccuracy * 100).toFixed(1)),
    },
  },
  rules: reusableRules.map((rule) => ({ ruleId: rule.ruleId, evidenceCount: rule.evidenceCount, lesson: rule.lesson })),
};
const watcherHtml = buildWatcherHtml(allFrames, allFrames[0].snapshot.room, watcherSummary);

const checks = [
  ["run 2 has fewer committed height warnings than run 1", run2SaferHeight],
  ["run 2 has fewer overhead contacts than run 1", run2SaferOverhead],
  ["run 2 uses probes before height risk", run2UsesProbes],
  ["run 2 uses crouch_body for low-clearance risk", run2Ducks],
  ["run 2 prediction accuracy is no worse than run 1", run2PredictsNoWorse],
  ["robot-facing logs do not include hidden coordinates or feature objects", noCoordinateLeaks],
  ["hidden truth exists only in the evaluation log", hiddenTruthHasCoordinates],
  ["run 2 actions are selected by the compact 2.5D action chooser", allRun2Chosen],
  ["every intentional action has a prediction", allPredictions.length === runOneActions.length + run2.frames.length],
  ["every intentional action has an immediate comparison", allComparisons.length === allPredictions.length],
  ["body-noticing wrote both self-map and world-map updates", allUpdates.some((row) => row.mapKind === "self_map_update") && allUpdates.some((row) => row.mapKind === "world_map_update")],
  ["watcher page was generated", watcherHtml.includes("Tiny 2.5D Nursery")],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Tiny 2.5D Nursery Result

Purpose: test a small 2.5D embodied nursery room with compact-only perception, height-like pressure streams, and separate hidden truth for human evaluation.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | run 1 | run 2 |
| --- | --- | --- |
| committed height warnings | ${run1.metrics.committedHeightWarnings} | ${run2.metrics.committedHeightWarnings} |
| overhead contacts | ${run1.metrics.overheadContacts} | ${run2.metrics.overheadContacts} |
| probe height warnings before commitment | ${run1.metrics.probeHeightWarnings} | ${run2.metrics.probeHeightWarnings} |
| crouch actions | ${run1.metrics.crouchActions} | ${run2.metrics.crouchActions} |
| prediction accuracy | ${(run1.metrics.predictionAccuracy * 100).toFixed(1)}% | ${(run2.metrics.predictionAccuracy * 100).toFixed(1)}% |
| unresolved prediction mismatches | ${run1.metrics.unresolvedMismatches} | ${run2.metrics.unresolvedMismatches} |

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | \`outputs/tiny_2_5d_nursery/hidden_truth_log.md\` |
| compact trigger log | \`outputs/tiny_2_5d_nursery/compact_trigger_log.md\` |
| prediction/comparison log | \`outputs/tiny_2_5d_nursery/prediction_comparison_log.md\` |
| body/world map updates | \`outputs/tiny_2_5d_nursery/body_world_map_updates.md\` |
| action decision log | \`outputs/tiny_2_5d_nursery/action_decision_log.md\` |
| lesson candidates | \`outputs/tiny_2_5d_nursery/lesson_candidates.md\` |
| watcher page | \`outputs/tiny_2_5d_nursery/tiny_2_5d_nursery_watcher.html\` |
| watcher frames | \`outputs/tiny_2_5d_nursery/watcher_frames.json\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(hiddenTruthPath, hiddenTruthMarkdown);
await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(predictionPath, predictionMarkdown);
await fs.writeFile(mapUpdatePath, updateMarkdown);
await fs.writeFile(actionDecisionPath, actionDecisionMarkdown);
await fs.writeFile(lessonPath, lessonMarkdown);
await fs.writeFile(resultPath, resultMarkdown);
await fs.writeFile(watcherPath, watcherHtml);
await fs.writeFile(
  watcherDataPath,
  JSON.stringify(
    {
      note: "Human watcher/evaluation data only. Robot-facing compact logs do not read this file.",
      summary: watcherSummary,
      frames: allFrames,
    },
    null,
    2
  )
);

console.log(resultMarkdown);
