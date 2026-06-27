import fs from "node:fs/promises";
import path from "node:path";
import { createPhysics25DRiskMemoryChooser } from "../digital_world/physics_2_5d_risk_memory_chooser.mjs";
import { createPhysics25DNurseryWorld } from "../digital_world/physics_2_5d_nursery_world.mjs";
import { buildCompactRows25D, readNursery25DSensors } from "../digital_world/physics_2_5d_nursery_sensors.mjs";

const outputDir = path.resolve("outputs/habit_promotion_2_5d_nursery");
const baseRoom = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  rampZone: { id: "ramp", x1: 4.4, y1: 7.05, x2: 5.4, y2: 8.1 },
  ledgeZone: { id: "ledge_drop", x1: 4.4, y1: 6.05, x2: 5.4, y2: 6.8 },
  lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 2.05, x2: 5.4, y2: 3.25 },
  raisedPad: { id: "raised_pressure_pad", x1: 4.4, y1: 4.0, x2: 5.4, y2: 4.75 },
};

const cases = [
  {
    caseId: "normal_low_tunnel",
    expected: "success",
    start: { x: 4.9, y: 0.85, facing: "south" },
    room: baseRoom,
    note: "baseline low-clearance case",
  },
  {
    caseId: "early_low_tunnel",
    expected: "success",
    start: { x: 4.9, y: 0.55, facing: "south" },
    room: { ...baseRoom, lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 1.85, x2: 5.4, y2: 3.05 } },
    note: "low tunnel begins earlier than the adaptive nursery",
  },
  {
    caseId: "after_raised_surface",
    expected: "success",
    start: { x: 4.9, y: 0.85, facing: "south" },
    room: {
      ...baseRoom,
      raisedPad: { id: "raised_pressure_pad", x1: 4.4, y1: 1.25, x2: 5.4, y2: 1.9 },
      lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 2.8, x2: 5.4, y2: 3.9 },
    },
    note: "clearance risk arrives after raised-surface pressure",
  },
  {
    caseId: "side_echo_false_alarm",
    expected: "false_alarm",
    start: { x: 4.9, y: 0.85, facing: "south" },
    room: {
      ...baseRoom,
      lowTunnel: { id: "low_tunnel", x1: 5.5, y1: 1.65, x2: 6.2, y2: 2.85 },
    },
    note: "near side clearance signal should provoke a probe, not an unnecessary crouch",
  },
  {
    caseId: "too_low_even_crouched",
    expected: "failure",
    start: { x: 4.9, y: 0.85, facing: "south" },
    room: {
      ...baseRoom,
      lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 2.05, x2: 5.4, y2: 3.25, requiresProne: true },
    },
    note: "crouch does not clear this obstacle, so the habit must not promote blindly",
  },
];

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
  if (action === "probe_forward") return "probe should check active compact risk before committing body height";
  if (action === "crouch_body") return "crouch should lower upper-body clearance risk";
  if (action === "pause") return "pause should separate raised load from collision";
  if (action === "recenter_body") return "recenter should settle load or pitch";
  if (memory.overheadAhead || memory.dropAhead || memory.raisedSurfaceAhead || memory.rampLoadAhead) {
    return "forward movement may carry compact risk already held in memory";
  }
  return "forward movement should gather compact evidence";
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

function findRoutineOutcome(frames) {
  for (let index = 0; index <= frames.length - 3; index += 1) {
    const trio = frames.slice(index, index + 3);
    const sequence = trio.map((frame) => frame.action).join(" -> ");
    if (sequence !== "probe_forward -> crouch_body -> step_forward") continue;
    const probedOverhead = trio[0].snapshot.lastInteraction.movementResult === "probe_overhead_warning";
    const crossedTunnel = trio[2].snapshot.lastInteraction.terrain.includes("low_clearance_tunnel");
    const overheadContact = trio[2].snapshot.lastInteraction.overheadContact;
    return {
      sequence,
      probedOverhead,
      crossedTunnel,
      overheadContact,
      success: probedOverhead && crossedTunnel && !overheadContact,
      failure: probedOverhead && crossedTunnel && overheadContact,
      ticks: trio.map((frame) => frame.tick).join(", "),
    };
  }
  return {
    sequence: "",
    probedOverhead: false,
    crossedTunnel: false,
    overheadContact: false,
    success: false,
    failure: false,
    ticks: "",
  };
}

async function runCase(testCase) {
  const world = createPhysics25DNurseryWorld({ room: testCase.room, initialState: testCase.start });
  const chooser = createPhysics25DRiskMemoryChooser();
  const frames = [];
  const compactRows = [];
  const comparisons = [];
  const decisions = [];
  let previousSensors = null;
  let olderSensors = null;

  for (let index = 0; index < 9; index += 1) {
    const tick = index + 1;
    const chooserSnapshot = chooser.snapshot();
    const choice = chooser.choose(tick);
    const prediction = {
      runId: testCase.caseId,
      tick,
      action: choice.action,
      expectedCompactResult: predictionFor(choice.action, chooserSnapshot.activeRiskMemory),
    };
    const snapshot = world.step(choice.action);
    const sensors = readNursery25DSensors(snapshot);
    const rows = buildCompactRows25D({
      runId: testCase.caseId,
      tick,
      action: choice.action,
      sensors,
      previousSensors,
      olderSensors,
    });
    const comparison = compare({ prediction, compactRows: rows, sensors });
    chooser.observe({ tick, action: choice.action, sensors, compactRows: rows });
    decisions.push({
      caseId: testCase.caseId,
      tick,
      action: choice.action,
      reason: choice.reason,
      activeRiskMemory: chooserSnapshot.activeMemoryText,
    });
    frames.push({ caseId: testCase.caseId, tick, action: choice.action, snapshot, sensors, compactRows: rows, comparison });
    compactRows.push(...rows);
    comparisons.push(comparison);
    olderSensors = previousSensors;
    previousSensors = sensors;
  }

  const routine = findRoutineOutcome(frames);
  const falseAlarmCrouches = testCase.expected === "false_alarm" ? frames.filter((frame) => frame.action === "crouch_body").length : 0;
  const overheadStepContacts = frames.filter((frame) => frame.action === "step_forward" && frame.snapshot.lastInteraction.overheadContact).length;
  const casePassed =
    (testCase.expected === "success" && routine.success && overheadStepContacts === 0) ||
    (testCase.expected === "false_alarm" &&
      falseAlarmCrouches === 0 &&
      frames.some((frame) => frame.action === "probe_forward") &&
      !frames.some((frame) => frame.snapshot.lastInteraction.overheadContact)) ||
    (testCase.expected === "failure" && routine.failure);

  return {
    ...testCase,
    frames,
    compactRows,
    comparisons,
    decisions,
    riskMemoryLog: chooser.riskMemoryLog().map((row) => ({ caseId: testCase.caseId, ...row })),
    routine,
    falseAlarmCrouches,
    overheadStepContacts,
    casePassed,
  };
}

function promotionReview(results) {
  const successCases = results.filter((result) => result.expected === "success");
  const falseAlarmCases = results.filter((result) => result.expected === "false_alarm");
  const failureCases = results.filter((result) => result.expected === "failure");
  const successCount = successCases.filter((result) => result.routine.success).length;
  const falseAlarmAvoided = falseAlarmCases.every((result) => result.falseAlarmCrouches === 0 && result.casePassed);
  const failureCaught = failureCases.every((result) => result.routine.failure && result.casePassed);
  const enoughSuccess = successCount >= 3;
  const status = enoughSuccess && falseAlarmAvoided && failureCaught ? "proposed" : "candidate";
  return {
    controlId: "adaptive_low_clearance_crossing_routine_v1",
    recommendedStatus: status,
    successCount,
    successNeeded: 3,
    falseAlarmAvoided,
    failureCaught,
    confidence: status === "proposed" ? "medium_high" : "medium",
    reason:
      status === "proposed"
        ? "routine succeeded across varied low-clearance cases, avoided the false alarm, and detected the too-low failure case"
        : "routine needs more evidence or a cleaner failure/false-alarm response before promotion",
  };
}

function renderCompact(row) {
  return `| ${[
    row.runId,
    row.tick,
    row.action,
    row.layer,
    row.event,
    row.stream,
    Number(row.value).toFixed(2),
    Number(row.signedChange).toFixed(2),
    row.direction,
  ].join(" | ")} |`;
}

function renderTruth(frame) {
  const interaction = frame.snapshot.lastInteraction;
  return `| ${[
    frame.caseId,
    frame.tick,
    frame.action,
    frame.snapshot.x.toFixed(2),
    frame.snapshot.y.toFixed(2),
    frame.snapshot.posture,
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.overheadContact ? "yes" : "no",
  ].join(" | ")} |`;
}

function robotFacingTextHasCoordinateLeak(text) {
  return /\b(x|y|coord|coordinate|position|true_position|room\.|rampZone|ledgeZone|lowTunnel|raisedPad)\b/i.test(text);
}

await fs.mkdir(outputDir, { recursive: true });

const results = [];
for (const testCase of cases) {
  results.push(await runCase(testCase));
}

const review = promotionReview(results);
const allFrames = results.flatMap((result) => result.frames);
const allCompactRows = results.flatMap((result) => result.compactRows);
const allDecisions = results.flatMap((result) => result.decisions);
const allRiskMemory = results.flatMap((result) => result.riskMemoryLog);
const checks = [
  ["routine succeeds in all intended low-clearance success cases", review.successCount === review.successNeeded],
  ["routine avoids crouch on side false alarm", review.falseAlarmAvoided],
  ["routine catches too-low failure instead of promoting blind success", review.failureCaught],
  ["promotion review recommends proposed status", review.recommendedStatus === "proposed"],
];

const compactMarkdown = `# Habit Promotion 2.5D Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| case | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allCompactRows.map(renderCompact).join("\n")}
`;

const decisionMarkdown = `# Habit Promotion 2.5D Action Decision Log

| case | tick | action | reason | active risk memory |
| --- | --- | --- | --- | --- |
${allDecisions
  .map((row) => `| ${[row.caseId, row.tick, row.action, row.reason, row.activeRiskMemory].join(" | ")} |`)
  .join("\n")}
`;

const riskMemoryMarkdown = `# Habit Promotion 2.5D Risk Memory Log

| case | tick | action | before | compact evidence | after | outcome |
| --- | --- | --- | --- | --- | --- | --- |
${allRiskMemory
  .map((row) => `| ${[row.caseId, row.tick, row.action, row.before, row.compactEvidence, row.after, row.outcome].join(" | ")} |`)
  .join("\n")}
`;

const reviewMarkdown = `# Habit Promotion 2.5D Review

Control under review: \`${review.controlId}\`

Recommended status: \`${review.recommendedStatus}\`

Reason: ${review.reason}

| case | expected | pass | routine sequence | routine success | routine failure | false alarm crouches | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
${results
  .map((result) =>
    `| ${[
      result.caseId,
      result.expected,
      result.casePassed ? "PASS" : "FAIL",
      result.routine.sequence || "none",
      result.routine.success ? "yes" : "no",
      result.routine.failure ? "yes" : "no",
      `${result.falseAlarmCrouches} crouch / ${result.overheadStepContacts} step contacts`,
      result.note,
    ].join(" | ")} |`
  )
  .join("\n")}

## Promotion Criteria

| criterion | result |
| --- | --- |
| success cases passed | ${review.successCount}/${review.successNeeded} |
| false alarm avoided | ${review.falseAlarmAvoided ? "yes" : "no"} |
| failure case caught | ${review.failureCaught ? "yes" : "no"} |
| confidence | ${review.confidence} |
`;

const truthMarkdown = `# Habit Promotion 2.5D Hidden Truth Log

Debug/evaluation truth for human inspection. Robot-facing compact logs do not read this file.

| case | tick | action | true x | true y | true posture | true movement result | true blocker | true terrain | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${allFrames.map(renderTruth).join("\n")}
`;

const robotFacingCombined = [compactMarkdown, decisionMarkdown, riskMemoryMarkdown, reviewMarkdown].join("\n");
const noCoordinateLeaks = !robotFacingTextHasCoordinateLeak(robotFacingCombined);
checks.push(["robot-facing logs do not include hidden coordinates or feature objects", noCoordinateLeaks]);
checks.push(["hidden truth exists only in the evaluation log", truthMarkdown.includes("true x") && truthMarkdown.includes("true y")]);
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Habit Promotion 2.5D Nursery Result

Purpose: test whether \`adaptive_low_clearance_crossing_routine_v1\` should remain a candidate or be promoted after repeated success, false-alarm restraint, and failure monitoring.

Verdict: ${passed ? "PASS" : "FAIL"}

Recommended control status: \`${review.recommendedStatus}\`

| metric | value |
| --- | --- |
| intended success cases passed | ${review.successCount}/${review.successNeeded} |
| false alarm avoided | ${review.falseAlarmAvoided ? "yes" : "no"} |
| too-low failure caught | ${review.failureCaught ? "yes" : "no"} |
| confidence | ${review.confidence} |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| compact trigger log | \`outputs/habit_promotion_2_5d_nursery/compact_trigger_log.md\` |
| action decision log | \`outputs/habit_promotion_2_5d_nursery/action_decision_log.md\` |
| risk memory log | \`outputs/habit_promotion_2_5d_nursery/risk_memory_log.md\` |
| promotion review | \`outputs/habit_promotion_2_5d_nursery/promotion_review.md\` |
| hidden truth log | \`outputs/habit_promotion_2_5d_nursery/hidden_truth_log.md\` |
`;

await fs.writeFile(path.join(outputDir, "compact_trigger_log.md"), compactMarkdown);
await fs.writeFile(path.join(outputDir, "action_decision_log.md"), decisionMarkdown);
await fs.writeFile(path.join(outputDir, "risk_memory_log.md"), riskMemoryMarkdown);
await fs.writeFile(path.join(outputDir, "promotion_review.md"), reviewMarkdown);
await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), truthMarkdown);
await fs.writeFile(path.join(outputDir, "habit_promotion_2_5d_nursery_result.md"), resultMarkdown);

console.log(resultMarkdown);
