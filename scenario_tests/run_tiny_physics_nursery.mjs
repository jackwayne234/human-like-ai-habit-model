import fs from "node:fs/promises";
import path from "node:path";
import { createPhysicsNurseryActionChooser } from "../digital_world/physics_nursery_action_chooser.mjs";
import { createPhysicsNurseryWorld } from "../digital_world/physics_nursery_world.mjs";
import { readNurserySensors, buildCompactRows } from "../digital_world/physics_nursery_sensors.mjs";
import {
  compareAfterAction,
  detectCompactSurprise,
  lessonCandidate,
  movementUrge,
  predictBeforeAction,
  promoteReusableLessons,
  runBodyNoticingCron,
} from "../digital_world/physics_nursery_crons.mjs";

const outputDir = path.resolve("outputs/tiny_physics_nursery");
const hiddenTruthPath = path.join(outputDir, "hidden_truth_log.md");
const compactLogPath = path.join(outputDir, "compact_trigger_log.md");
const predictionPath = path.join(outputDir, "prediction_comparison_log.md");
const mapUpdatePath = path.join(outputDir, "body_world_map_updates.md");
const lessonPath = path.join(outputDir, "lesson_candidates.md");
const actionDecisionPath = path.join(outputDir, "action_decision_log.md");
const resultPath = path.join(outputDir, "tiny_physics_nursery_result.md");
const watcherPath = path.join(outputDir, "tiny_physics_nursery_watcher.html");
const watcherDataPath = path.join(outputDir, "watcher_frames.json");

const runOneActions = [
  { action: "step_forward", intention: "try the first visible-feeling forward path" },
  { action: "turn_right", intention: "change front direction after resistance" },
  { action: "step_forward", intention: "move along the boundary" },
  { action: "step_forward", intention: "keep moving after one easy step" },
  { action: "turn_right", intention: "turn away from base resistance" },
  { action: "step_forward", intention: "try a new corridor after turning" },
  { action: "step_forward", intention: "continue through pressure change" },
  { action: "pause", intention: "let body pressure settle" },
  { action: "step_forward", intention: "test whether the path is still safe" },
  { action: "step_forward", intention: "keep moving despite weak warning" },
  { action: "step_forward", intention: "continue until the base gives a clearer warning" },
];

function priorBeliefsFor(runId, actionIndex, learned, chooserBeliefs = {}) {
  if (runId === "run_1") return {};
  const beliefs = {
    expectForwardRisk:
      chooserBeliefs.frontRisk ||
      chooserBeliefs.baseRisk ||
      learned.some((rule) => rule.lesson.includes("blocked") || rule.lesson.includes("base contact")),
    expectExternalPressure: chooserBeliefs.externalPressure || learned.some((rule) => rule.lesson.includes("airflow")),
  };
  return beliefs;
}

function formatNumber(value) {
  return Number(value).toFixed(2);
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

function renderPrediction(prediction) {
  return `| ${[
    prediction.runId,
    prediction.tick,
    prediction.action,
    "prediction_before_action",
    prediction.intention,
    prediction.expectedCompactResult,
    "",
    "",
  ].join(" | ")} |`;
}

function renderComparison(comparison) {
  return `| ${[
    comparison.runId,
    comparison.tick,
    comparison.action,
    comparison.phase,
    comparison.predicted,
    comparison.evidence,
    comparison.result,
    comparison.updateTarget,
  ].join(" | ")} |`;
}

function renderUpdate(row) {
  return `| ${[
    row.runId,
    row.tick,
    row.action,
    row.mapKind,
    row.belief,
    row.confidence,
    row.evidence,
    row.nextPrediction,
  ].join(" | ")} |`;
}

function renderLesson(row) {
  return `| ${[row.runId, row.tick, row.status, row.lesson, row.evidence].join(" | ")} |`;
}

function renderRule(row) {
  return `| ${[row.ruleId, row.status, row.evidenceCount, row.lesson].join(" | ")} |`;
}

function renderDecision(row) {
  return `| ${[
    row.runId,
    row.tick,
    row.source,
    row.action,
    row.intention,
    row.reason,
    row.beliefs,
  ].join(" | ")} |`;
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
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.contactFront ? "yes" : "no",
    interaction.contactLeftBase || interaction.contactRightBase ? "yes" : "no",
  ].join(" | ")} |`;
}

function robotFacingTextHasCoordinateLeak(text) {
  return /\b(x|y|coord|coordinate|position|true_position|room\.|lowObstacle|slopePatch|fanZone|curbZone)\b/i.test(text);
}

async function runPass({ runId, actions, learnedRules, chooser = null, maxTicks = null }) {
  const world = createPhysicsNurseryWorld();
  const frames = [];
  const compactRows = [];
  const predictions = [];
  const comparisons = [];
  const surpriseRows = [];
  const mapUpdates = [];
  const movementUrges = [];
  const lessonRows = [];
  const actionDecisions = [];
  let previousSensors = null;
  let olderSensors = null;
  const plannedTicks = actions?.length ?? maxTicks ?? 12;

  for (let index = 0; index < plannedTicks; index += 1) {
    const tick = index + 1;
    const choice = chooser
      ? chooser.choose(tick)
      : { ...actions[index], reason: "scripted first-pass body experience", source: "scripted" };
    const chooserSnapshot = chooser?.snapshot() ?? { beliefs: {} };
    const plan = { ...choice, source: chooser ? "compact_action_chooser" : "scripted" };
    const priorBeliefs = priorBeliefsFor(runId, index, learnedRules, chooserSnapshot.beliefs);
    actionDecisions.push({
      runId,
      tick,
      source: plan.source,
      action: plan.action,
      intention: plan.intention,
      reason: plan.reason,
      beliefs: Object.entries(chooserSnapshot.beliefs)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(", ") || "none",
    });
    const prediction = predictBeforeAction({
      runId,
      tick,
      action: plan.action,
      intention: plan.intention,
      priorBeliefs,
    });
    predictions.push(prediction);

    const snapshot = world.step(plan.action);
    const sensors = readNurserySensors(snapshot);
    const rows = buildCompactRows({
      runId,
      tick,
      action: plan.action,
      sensors,
      previousSensors,
      olderSensors,
    });
    const comparison = compareAfterAction({ prediction, compactRows: rows, sensors });
    const surprise = detectCompactSurprise({ runId, tick, action: plan.action, compactRows: rows });
    const updates = runBodyNoticingCron({
      runId,
      tick,
      action: plan.action,
      compactRows: rows,
      sensors,
      comparison,
      forced: surprise.length > 0 || sensors.movement_result >= 0.95,
    });
    const urge = movementUrge({
      runId,
      tick,
      recentComparisons: comparisons.slice(-2).concat(comparison),
      recentUpdates: mapUpdates.slice(-3).concat(updates),
    });
    const candidate = lessonCandidate({ runId, tick, action: plan.action, compactRows: rows, comparison });
    chooser?.observe({ action: plan.action, sensors, compactRows: rows, comparison, mapUpdates: updates });

    if (
      rows.some((row) => row.stream.includes("airflow") || row.stream.includes("pressure_capsule")) ||
      sensors.airflow >= 0.7 ||
      Math.abs(sensors.pressure_capsule_left - sensors.pressure_capsule_right) >= 0.4
    ) {
      comparisons.push(compareAfterAction({ prediction, compactRows: rows, sensors, delayed: true }));
    }

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
    movementUrges.push(urge);
    if (candidate) lessonRows.push(candidate);
    olderSensors = previousSensors;
    previousSensors = sensors;
  }

  const metrics = {
    torsoFrontContacts: frames.filter((frame) => frame.snapshot.lastInteraction.contactFront).length,
    blockedOrPartialSteps: frames.filter((frame) =>
      ["blocked", "partial", "warning"].includes(frame.snapshot.lastInteraction.movementResult)
    ).length,
    probesBeforeRisk: frames.filter(
      (frame) => frame.action === "probe_forward" && frame.snapshot.lastInteraction.movementResult.includes("probe")
    ).length,
    predictionAccuracy:
      comparisons.filter((row) => row.phase === "immediate_comparison" && row.result === "matched_or_explained").length /
      comparisons.filter((row) => row.phase === "immediate_comparison").length,
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
    movementUrges,
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
        movementResult: frame.snapshot.lastInteraction.movementResult,
        terrain: frame.snapshot.lastInteraction.terrain,
        sensors: frame.sensors,
        compactSummary: frame.compactRows.slice(0, 5).map((row) => `${row.stream} ${row.layer} ${row.direction}`),
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
  <title>Tiny Physics Nursery Watcher</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #20252b;
      --muted: #5d6875;
      --line: #c8d1dc;
      --floor: #f4f7f2;
      --wall: #46515d;
      --water: #1f7a8c;
      --warning: #b7791f;
      --leaf: #2f855a;
      --rose: #b83280;
      --panel: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: #e7edf3;
      display: grid;
      grid-template-rows: auto 1fr;
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--panel);
      border-bottom: 1px solid var(--line);
      flex-wrap: wrap;
    }
    button {
      min-width: 42px;
      height: 34px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #fff;
      color: var(--ink);
      font: inherit;
      cursor: pointer;
    }
    button.primary {
      background: var(--water);
      border-color: var(--water);
      color: white;
    }
    input[type="range"] { width: 220px; }
    .layout {
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(320px, 1fr) 340px;
      gap: 0;
    }
    .stage {
      min-height: 0;
      display: grid;
      padding: 14px;
    }
    canvas {
      width: 100%;
      height: 100%;
      min-height: 420px;
      background: var(--floor);
      border: 1px solid var(--line);
    }
    aside {
      min-height: 0;
      overflow: auto;
      background: #f8fafc;
      border-left: 1px solid var(--line);
      padding: 14px;
    }
    h1, h2 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 18px; }
    h2 { font-size: 14px; margin-top: 16px; }
    .readout { color: var(--muted); font-size: 13px; }
    .row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      padding: 5px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
    }
    .stream { color: var(--muted); }
    .status {
      display: grid;
      gap: 8px;
      padding: 10px;
      border: 1px solid var(--line);
      background: #ffffff;
      border-radius: 6px;
    }
    .status.pass { border-color: #2f855a; }
    .status.fail { border-color: #b91c1c; }
    .status-title {
      font-weight: 700;
      color: var(--ink);
    }
    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 2px 8px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: #f8fafc;
      color: var(--muted);
      font-size: 12px;
    }
    .pill.good {
      border-color: #2f855a;
      color: #276749;
      background: #f0fff4;
    }
    .pill.warn {
      border-color: #b7791f;
      color: #975a16;
      background: #fffaf0;
    }
    .lesson-list {
      margin: 8px 0 0;
      padding-left: 18px;
      color: var(--muted);
      font-size: 13px;
    }
    .compact {
      margin-top: 8px;
      padding-left: 18px;
      color: var(--muted);
      font-size: 13px;
    }
    @media (max-width: 820px) {
      .layout { grid-template-columns: 1fr; }
      aside { border-left: 0; border-top: 1px solid var(--line); }
      canvas { min-height: 360px; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>Tiny Physics Nursery</h1>
    <button id="play" class="primary" type="button">Play</button>
    <button id="back" type="button">Prev</button>
    <button id="next" type="button">Next</button>
    <input id="scrub" type="range" min="0" value="0">
    <span id="label" class="readout"></span>
  </div>
  <main class="layout">
    <section class="stage">
      <canvas id="nursery" aria-label="Tiny physics nursery watcher"></canvas>
    </section>
    <aside>
      <h2>Run Status</h2>
      <div id="status" class="status"></div>
      <h2>Action</h2>
      <div id="action" class="readout"></div>
      <h2>Compact Feeling</h2>
      <ul id="compact" class="compact"></ul>
      <h2>Lessons</h2>
      <ul id="lessons" class="lesson-list"></ul>
      <h2>Sensor Values</h2>
      <div id="sensors"></div>
    </aside>
  </main>
  <script>
    const WATCHER_DATA = ${data};
    const canvas = document.getElementById("nursery");
    const ctx = canvas.getContext("2d");
    const playButton = document.getElementById("play");
    const backButton = document.getElementById("back");
    const nextButton = document.getElementById("next");
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

    function drawRect(rect, color, alpha = 1) {
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
      ctx.fillStyle = "#f4f7f2";
      ctx.fillRect(origin.x, origin.y, end.x - origin.x, end.y - origin.y);
      ctx.strokeStyle = "#46515d";
      ctx.lineWidth = 6;
      ctx.strokeRect(origin.x, origin.y, end.x - origin.x, end.y - origin.y);
      drawRect(WATCHER_DATA.room.lowObstacle, "#b7791f", 0.72);
      drawRect(WATCHER_DATA.room.slopePatch, "#2f855a", 0.26);
      drawRect(WATCHER_DATA.room.fanZone, "#1f7a8c", 0.2);
      drawRect(WATCHER_DATA.room.curbZone, "#b83280", 0.18);

      const p = worldToCanvas({ x: frame.x, y: frame.y });
      const size = Math.max(18, p.scale * 0.68);
      ctx.save();
      ctx.translate(p.x, p.y);
      const angle = { north: -Math.PI / 2, east: 0, south: Math.PI / 2, west: Math.PI }[frame.facing];
      ctx.rotate(angle);
      ctx.fillStyle = frame.movementResult.includes("blocked") ? "#b91c1c" : frame.movementResult.includes("warning") ? "#b7791f" : "#1f7a8c";
      ctx.strokeStyle = "#20252b";
      ctx.lineWidth = 2;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(size / 2 + 8, 0);
      ctx.lineTo(size / 2 - 5, -7);
      ctx.lineTo(size / 2 - 5, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const remaining = Math.max(0, Math.ceil((autoplayUntil - Date.now()) / 1000));
      const countdown = remaining > 0 ? " / auto " + remaining + "s" : "";
      label.textContent = frame.runId + " tick " + frame.tick + " / " + frame.movementResult + countdown;
      action.textContent = frame.action + " - " + frame.intention + " - " + frame.comparison;
      compact.innerHTML = frame.compactSummary.length ? frame.compactSummary.map((item) => "<li>" + item + "</li>").join("") : "<li>compact stream quiet</li>";
      const runName = frame.runId === "run_2" ? "Run 2 compact chooser" : "Run 1 first pass";
      status.className = "status " + (WATCHER_DATA.summary.verdict === "PASS" ? "pass" : "fail");
      status.innerHTML = [
        '<div class="status-title">' + WATCHER_DATA.summary.verdict + ' - ' + runName + '</div>',
        '<div class="readout">' + WATCHER_DATA.summary.note + '</div>',
        '<div class="pill-row">',
        '<span class="pill good">front hits ' + WATCHER_DATA.summary.metrics.torsoFrontContacts.run1 + ' -> ' + WATCHER_DATA.summary.metrics.torsoFrontContacts.run2 + '</span>',
        '<span class="pill good">risky steps ' + WATCHER_DATA.summary.metrics.blockedOrPartialSteps.run1 + ' -> ' + WATCHER_DATA.summary.metrics.blockedOrPartialSteps.run2 + '</span>',
        '<span class="pill good">probes ' + WATCHER_DATA.summary.metrics.probesBeforeRisk.run1 + ' -> ' + WATCHER_DATA.summary.metrics.probesBeforeRisk.run2 + '</span>',
        '<span class="pill ' + (frame.comparison === "matched_or_explained" ? "good" : "warn") + '">' + frame.comparison + '</span>',
        '</div>'
      ].join("");
      if (frame.decisionReason) {
        action.textContent = frame.action + " - " + frame.intention + " - " + frame.comparison + " - " + frame.decisionReason;
      }
      lessons.innerHTML = WATCHER_DATA.summary.rules.length
        ? WATCHER_DATA.summary.rules.map((rule) => "<li>" + rule.lesson + "</li>").join("")
        : "<li>No reusable lesson candidate yet.</li>";
      sensors.innerHTML = Object.entries(frame.sensors).map(([key, value]) => '<div class="row"><span class="stream">' + key + '</span><span>' + Number(value).toFixed(2) + '</span></div>').join("");
      scrub.value = index;
    }

    function setIndex(nextIndex) {
      index = Math.max(0, Math.min(WATCHER_DATA.frames.length - 1, nextIndex));
      draw();
    }

    function startPlayback() {
      if (timer) {
        clearInterval(timer);
        timer = null;
        playButton.textContent = "Play";
        return;
      }
      playButton.textContent = "Pause";
      timer = setInterval(() => {
        if (index === WATCHER_DATA.frames.length - 1 && Date.now() < autoplayUntil) {
          setIndex(0);
          return;
        }
        setIndex(index + 1);
        if (index === WATCHER_DATA.frames.length - 1 && Date.now() >= autoplayUntil) {
          clearInterval(timer);
          timer = null;
          playButton.textContent = "Play";
        }
      }, 700);
    }

    playButton.addEventListener("click", () => {
      autoplayUntil = Date.now() + 120000;
      startPlayback();
    });
    backButton.addEventListener("click", () => setIndex(index - 1));
    nextButton.addEventListener("click", () => setIndex(index + 1));
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
const run2Chooser = createPhysicsNurseryActionChooser({
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
const allUrges = [...run1.movementUrges, ...run2.movementUrges];
const allActionDecisions = [...run1.actionDecisions, ...run2.actionDecisions];

const compactMarkdown = `# Tiny Physics Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature labels.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allCompactRows.map(renderCompactRow).join("\n")}
`;

const predictionMarkdown = `# Tiny Physics Nursery Prediction And Comparison Log

Every intentional action receives a prediction before action and an immediate comparison after action. Delayed settling checks appear when pressure or airflow may change slowly.

| run | tick | action | phase | intention or prediction | compact evidence | result | update target |
| --- | --- | --- | --- | --- | --- | --- | --- |
${allPredictions.flatMap((prediction) => {
  const rows = [renderPrediction(prediction)];
  rows.push(...allComparisons.filter((comparison) => comparison.runId === prediction.runId && String(comparison.tick).startsWith(String(prediction.tick)) && comparison.action === prediction.action).map(renderComparison));
  return rows;
}).join("\n")}
`;

const updateMarkdown = `# Tiny Physics Nursery Body And World Map Updates

Caregiver-style body-noticing runs every three ticks plus after surprise or collision. These are robot-facing self/world beliefs, not simulator truth.

| run | tick | action | map kind | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- | --- | --- | --- |
${allUpdates.map(renderUpdate).join("\n")}

## Compact Surprise Routing

| run | tick | action | trigger | evidence | route |
| --- | --- | --- | --- | --- | --- |
${allSurprises.map((row) => `| ${[row.runId, row.tick, row.action, row.trigger, row.evidence, row.route].join(" | ")} |`).join("\n")}

## Movement Urge Cron

| run | tick | state | suggested action | reason |
| --- | --- | --- | --- | --- |
${allUrges.map((row) => `| ${[row.runId, row.tick, row.state, row.suggestedAction || "none", row.reason].join(" | ")} |`).join("\n")}
`;

const actionDecisionMarkdown = `# Tiny Physics Nursery Action Decision Log

Run 1 is a scripted first-pass body experience. Run 2 is selected by the compact action chooser from prior compact-derived beliefs plus current compact outcomes. This log is robot-facing: it records no hidden coordinates.

| run | tick | source | action | intention | reason | active compact beliefs |
| --- | --- | --- | --- | --- | --- | --- |
${allActionDecisions.map(renderDecision).join("\n")}
`;

const lessonMarkdown = `# Tiny Physics Nursery Lesson Candidates

One event can create a hypothesis. Reusable candidates require repeated compact evidence or strong cross-sensor agreement.

## Hypotheses

| run | tick | status | lesson | compact evidence |
| --- | --- | --- | --- | --- |
${allLessons.map(renderLesson).join("\n")}

## Candidate Reusable Rules

| rule id | status | evidence count | lesson |
| --- | --- | --- | --- |
${reusableRules.map(renderRule).join("\n")}
`;

const hiddenTruthMarkdown = `# Tiny Physics Nursery Hidden Truth Log

Debug/evaluation truth for the human watcher and pass/fail checks. The robot-facing logs do not read this file.

| run | tick | action | true x | true y | true facing | true movement result | true blocker | true terrain | torso contact | base contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allFrames.map(renderTruth).join("\n")}
`;

const robotFacingCombined = [compactMarkdown, predictionMarkdown, updateMarkdown, actionDecisionMarkdown, lessonMarkdown].join("\n");
const noCoordinateLeaks = !robotFacingTextHasCoordinateLeak(robotFacingCombined);
const run2Safer = run2.metrics.torsoFrontContacts < run1.metrics.torsoFrontContacts;
const run2PredictsBetter = run2.metrics.predictionAccuracy > run1.metrics.predictionAccuracy;
const run2UsesProbes = run2.metrics.probesBeforeRisk > run1.metrics.probesBeforeRisk;
const hiddenTruthHasCoordinates = hiddenTruthMarkdown.includes("true x") && hiddenTruthMarkdown.includes("true y");
const watcherSummary = {
  verdict: run2Safer && run2PredictsBetter && run2UsesProbes && noCoordinateLeaks ? "PASS" : "FAIL",
  note:
    "The 2-minute view loops generated run frames. Success is measured from the scenario logs, not from new live playback logs.",
  metrics: {
    torsoFrontContacts: {
      run1: run1.metrics.torsoFrontContacts,
      run2: run2.metrics.torsoFrontContacts,
    },
    blockedOrPartialSteps: {
      run1: run1.metrics.blockedOrPartialSteps,
      run2: run2.metrics.blockedOrPartialSteps,
    },
    probesBeforeRisk: {
      run1: run1.metrics.probesBeforeRisk,
      run2: run2.metrics.probesBeforeRisk,
    },
    predictionAccuracy: {
      run1: Number((run1.metrics.predictionAccuracy * 100).toFixed(1)),
      run2: Number((run2.metrics.predictionAccuracy * 100).toFixed(1)),
    },
  },
  rules: reusableRules.map((rule) => ({
    ruleId: rule.ruleId,
    evidenceCount: rule.evidenceCount,
    lesson: rule.lesson,
  })),
};
const watcherHtml = buildWatcherHtml(allFrames, allFrames[0].snapshot.room, watcherSummary);

const checks = [
  ["run 2 has fewer torso-front wall collisions than run 1", run2Safer],
  ["run 2 prediction accuracy is better than run 1", run2PredictsBetter],
  ["run 2 uses probes before risky commitment", run2UsesProbes],
  ["robot-facing logs do not include hidden coordinates or feature objects", noCoordinateLeaks],
  ["hidden truth exists only in the evaluation log", hiddenTruthHasCoordinates],
  ["run 2 actions are selected by the compact action chooser", run2.actionDecisions.every((row) => row.source === "compact_action_chooser")],
  ["every intentional action has a prediction", allPredictions.length === runOneActions.length + run2.frames.length],
  ["every intentional action has an immediate comparison", allComparisons.filter((row) => row.phase === "immediate_comparison").length === allPredictions.length],
  ["body-noticing wrote both self-map and world-map updates", allUpdates.some((row) => row.mapKind === "self_map_update") && allUpdates.some((row) => row.mapKind === "world_map_update")],
  ["watcher page was generated", watcherHtml.includes("Tiny Physics Nursery")],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Tiny Physics Nursery Result

Purpose: run the first tiny continuous digital embodied world twice, with compact-only robot perception and separate hidden truth for human evaluation.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | run 1 | run 2 |
| --- | --- | --- |
| torso-front contacts | ${run1.metrics.torsoFrontContacts} | ${run2.metrics.torsoFrontContacts} |
| blocked/partial/warning steps | ${run1.metrics.blockedOrPartialSteps} | ${run2.metrics.blockedOrPartialSteps} |
| probe warnings before risky commitment | ${run1.metrics.probesBeforeRisk} | ${run2.metrics.probesBeforeRisk} |
| prediction accuracy | ${(run1.metrics.predictionAccuracy * 100).toFixed(1)}% | ${(run2.metrics.predictionAccuracy * 100).toFixed(1)}% |
| unresolved prediction mismatches | ${run1.metrics.unresolvedMismatches} | ${run2.metrics.unresolvedMismatches} |

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | \`outputs/tiny_physics_nursery/hidden_truth_log.md\` |
| compact trigger log | \`outputs/tiny_physics_nursery/compact_trigger_log.md\` |
| prediction/comparison log | \`outputs/tiny_physics_nursery/prediction_comparison_log.md\` |
| body/world map updates | \`outputs/tiny_physics_nursery/body_world_map_updates.md\` |
| action decision log | \`outputs/tiny_physics_nursery/action_decision_log.md\` |
| lesson candidates | \`outputs/tiny_physics_nursery/lesson_candidates.md\` |
| watcher page | \`outputs/tiny_physics_nursery/tiny_physics_nursery_watcher.html\` |
| watcher frames | \`outputs/tiny_physics_nursery/watcher_frames.json\` |

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
