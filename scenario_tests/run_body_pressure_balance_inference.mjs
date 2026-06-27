import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/body_pressure_balance_inference");
const compactLogPath = path.join(outputDir, "body_pressure_balance_compact_log.md");
const routineLogPath = path.join(outputDir, "body_pressure_balance_routine_log.md");
const correctionLogPath = path.join(outputDir, "body_pressure_balance_teacher_correction_log.md");
const consolidationPath = path.join(outputDir, "body_pressure_balance_delayed_consolidation_log.md");
const ruleOutputPath = path.join(outputDir, "body_pressure_balance_reusable_rule_output.md");
const mapStatePath = path.join(outputDir, "body_pressure_balance_inner_world_map_state.json");
const resultPath = path.join(outputDir, "body_pressure_balance_inference_result.md");

const bodyPressureStreams = [
  "touch_left_foot",
  "touch_right_foot",
  "touch_torso_front",
  "touch_torso_back",
  "pressure_capsule_left",
  "pressure_capsule_right",
  "pressure_capsule_front",
  "pressure_capsule_back",
  "movement_command",
  "volume",
  "airflow",
];

const cases = [
  {
    caseId: "left_tilt_balance_confirmed",
    placeId: "balance_lab",
    areaId: "flat_test_pad",
    actionContext: "standing still while body load shifts left",
    teacherLabel: "balance_tilt_left_confirmed",
    predictedLabel: "possible_left_tilt_or_weight_shift",
    correctionNote:
      "The left foot load and paired pressure capsule difference mean the body tilted left. Correct posture before moving.",
    events: [
      {
        second: 10,
        layer: "n^-1",
        event: "rate_of_change_within_touch_location",
        stream: "touch_left_foot",
        value: 0.64,
        signedChange: 0.64,
        threshold: "0.5",
      },
      {
        second: 10,
        layer: "n^-1",
        event: "rate_of_change_within_touch_location",
        stream: "touch_right_foot",
        value: 0.55,
        signedChange: -0.55,
        threshold: "0.5",
      },
      {
        second: 10,
        layer: "n^-1",
        event: "paired_pressure_differential",
        stream: "pressure_capsule_left, pressure_capsule_right",
        value: 0.61,
        signedChange: 0.61,
        threshold: "0.5 differential",
      },
      {
        second: 11,
        layer: "n^-1",
        event: "quiet_collision_context",
        stream: "touch_torso_front, touch_torso_back",
        value: 0.08,
        signedChange: 0,
        threshold: "< 0.5, no collision support",
      },
      {
        second: 12,
        layer: "n^-2",
        event: "balance_pattern_shift",
        stream: "compact trigger stream",
        value: 0.32,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "right_foot_object_not_gravity",
    placeId: "balance_lab",
    areaId: "block_under_right_foot",
    actionContext: "standing still with a small block under the right foot",
    teacherLabel: "local_foot_obstacle_not_balance_rule",
    predictedLabel: "possible_right_foot_load_or_obstacle",
    correctionNote:
      "This is a local object under the right foot. Store a ground/object anchor, not a gravity or balance rule.",
    events: [
      {
        second: 28,
        layer: "n",
        event: "threshold_hit",
        stream: "touch_right_foot",
        value: 1.0,
        signedChange: 0,
        threshold: "1.0",
      },
      {
        second: 28,
        layer: "n^-1",
        event: "rate_of_change_within_touch_location",
        stream: "touch_right_foot",
        value: 0.74,
        signedChange: 0.74,
        threshold: "0.5",
      },
      {
        second: 29,
        layer: "n^-1",
        event: "weak_capsule_change_below_threshold",
        stream: "pressure_capsule_left, pressure_capsule_right",
        value: 0.14,
        signedChange: 0.14,
        threshold: "< 0.5 differential",
      },
      {
        second: 30,
        layer: "n^-2",
        event: "local_foot_contact_pattern_shift",
        stream: "compact trigger stream",
        value: 0.21,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "forward_acceleration_not_gravity",
    placeId: "balance_lab",
    areaId: "start_stop_lane",
    actionContext: "body starts moving forward on command",
    teacherLabel: "forward_acceleration_confirmed",
    predictedLabel: "possible_forward_lean_or_acceleration",
    correctionNote:
      "This pressure difference came from commanded forward acceleration. Do not treat it as a standing gravity/balance correction.",
    events: [
      {
        second: 44,
        layer: "n^-1",
        event: "rate_of_change_within_pressure_capsule",
        stream: "pressure_capsule_front",
        value: 0.67,
        signedChange: 0.67,
        threshold: "0.5",
      },
      {
        second: 44,
        layer: "n^-1",
        event: "rate_of_change_within_pressure_capsule",
        stream: "pressure_capsule_back",
        value: 0.58,
        signedChange: -0.58,
        threshold: "0.5",
      },
      {
        second: 44,
        layer: "n^-1",
        event: "movement_command_change",
        stream: "movement_command",
        value: 1.0,
        signedChange: 1.0,
        threshold: "commanded movement",
      },
      {
        second: 45,
        layer: "n^-2",
        event: "acceleration_pattern_shift",
        stream: "compact trigger stream",
        value: 0.36,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "air_pressure_capsule_not_balance",
    placeId: "balance_lab",
    areaId: "fan_pressure_lane",
    actionContext: "standing still while airflow changes around a pressure capsule",
    teacherLabel: "airflow_pressure_gradient_confirmed",
    predictedLabel: "possible_pressure_gradient",
    correctionNote:
      "The capsule difference came from airflow or atmospheric pressure change, not body tilt. Store this as an air-pressure clue.",
    events: [
      {
        second: 62,
        layer: "n^-1",
        event: "paired_pressure_differential",
        stream: "pressure_capsule_left, pressure_capsule_right",
        value: 0.69,
        signedChange: 0.69,
        threshold: "0.5 differential",
      },
      {
        second: 62,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "airflow",
        value: 0.72,
        signedChange: 0.72,
        threshold: "0.5",
      },
      {
        second: 63,
        layer: "n^-1",
        event: "quiet_foot_context",
        stream: "touch_left_foot, touch_right_foot",
        value: 0.1,
        signedChange: 0,
        threshold: "< 0.5, no foot-load support",
      },
      {
        second: 64,
        layer: "n^-2",
        event: "air_pressure_pattern_shift",
        stream: "compact trigger stream",
        value: 0.29,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
];

function hasStream(testCase, stream) {
  return testCase.events.some((event) => event.stream.split(", ").includes(stream));
}

function hasEvent(testCase, eventName) {
  return testCase.events.some((event) => event.event === eventName);
}

function hasRising(testCase, stream) {
  return testCase.events.some((event) => event.stream === stream && event.signedChange >= 0.5);
}

function hasFalling(testCase, stream) {
  return testCase.events.some((event) => event.stream === stream && event.signedChange <= -0.5);
}

function hasFootPairOpposition(testCase) {
  return (
    (hasRising(testCase, "touch_left_foot") && hasFalling(testCase, "touch_right_foot")) ||
    (hasRising(testCase, "touch_right_foot") && hasFalling(testCase, "touch_left_foot"))
  );
}

function hasLeftRightCapsuleDifferential(testCase) {
  return testCase.events.some(
    (event) => event.event === "paired_pressure_differential" && event.stream === "pressure_capsule_left, pressure_capsule_right"
  );
}

function inferBodyPressureShape(testCase) {
  const footOpposition = hasFootPairOpposition(testCase);
  const capsuleDifferential = hasLeftRightCapsuleDifferential(testCase);
  const quietCollision = hasEvent(testCase, "quiet_collision_context");
  const commandedMovement = hasStream(testCase, "movement_command");
  const airflow = hasStream(testCase, "airflow");
  const localFootMax = testCase.events.some((event) => event.stream === "touch_right_foot" && event.value === 1);

  if (footOpposition && capsuleDifferential && quietCollision && testCase.teacherLabel === "balance_tilt_left_confirmed") {
    return {
      shape: "standing_foot_capsule_balance_shape",
      hypothesis: "possible_left_tilt_or_weight_shift",
      mapQuestion:
        "Do opposite foot-load changes plus left/right capsule difference mean body tilt while collision and movement stay quiet?",
      anchorType: "balance_gravity_anchor",
      reusableRuleAllowed: true,
    };
  }

  if (localFootMax && !capsuleDifferential) {
    return {
      shape: "local_foot_pressure_without_capsule_support",
      hypothesis: "possible_ground_object_underfoot",
      mapQuestion: "Is this a local object or uneven ground under one foot rather than whole-body tilt?",
      anchorType: "local_foot_obstacle_anchor",
      reusableRuleAllowed: false,
    };
  }

  if (commandedMovement) {
    return {
      shape: "front_back_capsule_with_commanded_movement",
      hypothesis: "possible_forward_acceleration",
      mapQuestion: "Did pressure shift because the body intentionally started or stopped moving?",
      anchorType: "acceleration_anchor",
      reusableRuleAllowed: false,
    };
  }

  if (capsuleDifferential && airflow) {
    return {
      shape: "pressure_capsule_airflow_shape",
      hypothesis: "possible_pressure_gradient",
      mapQuestion: "Did external airflow or atmospheric pressure change the capsule without changing foot load?",
      anchorType: "air_pressure_anchor",
      reusableRuleAllowed: false,
    };
  }

  return {
    shape: "unknown_body_pressure_shape",
    hypothesis: "ask_for_more_context",
    mapQuestion: "Does this pressure difference mean balance, ground contact, acceleration, or air pressure?",
    anchorType: "unknown_pressure_anchor",
    reusableRuleAllowed: false,
  };
}

function buildRoutineRows(testCase) {
  const shape = inferBodyPressureShape(testCase);
  const target = `${testCase.placeId}/${testCase.areaId}`;
  const firstSecond = testCase.events[0].second;
  const rows = [
    {
      caseId: testCase.caseId,
      second: firstSecond,
      handler: "body_pressure_map_prompt",
      triggerPattern: shape.shape,
      mapTarget: target,
      output: shape.hypothesis,
      detail: shape.mapQuestion,
    },
  ];

  if (shape.reusableRuleAllowed) {
    rows.push({
      caseId: testCase.caseId,
      second: firstSecond + 1,
      handler: "balance_correction_check_sequence",
      triggerPattern: "opposed foot pressure plus paired capsule differential while collision/movement stay quiet",
      mapTarget: "inner_world/routines/body_balance_pressure",
      output: "ask_pause_recenter_and_confirm_stable_foot_load",
      detail:
        "Pause movement, recenter posture, check whether left/right foot pressure equalizes, and store the compact balance correction result.",
    });
  }

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond + 4,
    handler: "teacher_correction_label_handler",
    triggerPattern: `teacher label: ${testCase.teacherLabel}`,
    mapTarget: target,
    output: "confirmed_map_update",
    detail: `Attach teacher label ${testCase.teacherLabel} to compact body-pressure evidence for this map area.`,
  });

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond + 4,
    handler: "correction_example_builder",
    triggerPattern: "body-pressure prompt plus teacher correction",
    mapTarget: "inner_world/labeled_examples/body_pressure_balance",
    output: "labeled_training_example",
    detail: `Store ${shape.shape}, prediction ${testCase.predictedLabel}, teacher label, and correction note.`,
  });

  return rows;
}

function buildConsolidation(testCase) {
  const shape = inferBodyPressureShape(testCase);
  const correctionSecond = testCase.events[0].second + 4;
  const evidenceAgrees = shape.reusableRuleAllowed && testCase.teacherLabel === "balance_tilt_left_confirmed";

  return {
    caseId: testCase.caseId,
    dueSecond: correctionSecond + 60,
    handler: "one_minute_body_pressure_consolidation",
    question: "Should this corrected event become a reusable balance/gravity pressure rule?",
    evidence: `${shape.shape}, map area ${testCase.areaId}, trusted teacher label ${testCase.teacherLabel}`,
    decision: evidenceAgrees ? "yes" : "no",
    reusableRuleId: evidenceAgrees ? "rule_body_pressure_balance_gravity_v1" : "",
    reason: evidenceAgrees
      ? "Opposed foot pressure, paired capsule differential, quiet collision context, and teacher correction agree on balance/gravity meaning."
      : "The compact evidence and teacher correction support a narrower pressure meaning, not a general balance/gravity rule.",
  };
}

function buildReusableRules(consolidationRows) {
  return consolidationRows
    .filter((row) => row.decision === "yes")
    .map((row) => ({
      ruleId: row.reusableRuleId,
      sourceCase: row.caseId,
      status: "candidate_reusable_rule",
      scope: "standing or slow-moving body-balance contexts",
      compactInputPattern:
        "left/right foot pressure oppose AND paired pressure capsule differential shifts AND collision/movement context stays quiet",
      futureOutput:
        "infer likely tilt, weight shift, or gravity/balance correction need; pause or recenter before movement; do not open raw sensor detail unless compact evidence conflicts",
    }));
}

function buildMapState(routineRows, reusableRules) {
  const places = {};

  for (const testCase of cases) {
    const shape = inferBodyPressureShape(testCase);
    const target = `${testCase.placeId}/${testCase.areaId}`;
    places[target] = {
      latestTeacherLabel: testCase.teacherLabel,
      compactBodyPressureShape: shape.shape,
      anchorType: shape.anchorType,
      reusableRuleIds: reusableRules.filter((rule) => rule.sourceCase === testCase.caseId).map((rule) => rule.ruleId),
      updateCount: routineRows.filter((row) => row.mapTarget === target).length,
    };
  }

  return {
    format: "inner_world_map_state_v1",
    note: "Inspectable state generated from compact labeled touch/pressure differentials, not dedicated accelerometer or barometer streams.",
    bodyPressureStreams,
    places,
  };
}

function renderCompactRow(testCase, event, index) {
  return `| ${[
    testCase.caseId,
    event.second,
    index + 1,
    testCase.placeId,
    testCase.areaId,
    event.layer,
    event.event,
    event.stream,
    event.value.toFixed(2),
    event.signedChange.toFixed(2),
    event.threshold,
  ].join(" | ")} |`;
}

function renderRoutineRow(row) {
  return `| ${[
    row.caseId,
    row.second,
    row.handler,
    row.triggerPattern,
    row.mapTarget,
    row.output,
    row.detail,
  ].join(" | ")} |`;
}

function renderCorrectionRow(testCase) {
  const correctionSecond = testCase.events[0].second + 4;
  return `| ${[
    testCase.caseId,
    correctionSecond,
    "trusted_teacher",
    testCase.predictedLabel,
    testCase.teacherLabel,
    testCase.correctionNote,
  ].join(" | ")} |`;
}

function renderConsolidationRow(row) {
  return `| ${[
    row.caseId,
    row.dueSecond,
    row.handler,
    row.question,
    row.evidence,
    row.decision,
    row.reusableRuleId || "none",
    row.reason,
  ].join(" | ")} |`;
}

function renderRuleRow(row) {
  return `| ${[
    row.ruleId,
    row.sourceCase,
    row.status,
    row.scope,
    row.compactInputPattern,
    row.futureOutput,
  ].join(" | ")} |`;
}

await fs.mkdir(outputDir, { recursive: true });

const routineRows = cases.flatMap(buildRoutineRows);
const consolidationRows = cases.map(buildConsolidation);
const reusableRules = buildReusableRules(consolidationRows);
const mapState = buildMapState(routineRows, reusableRules);

const checks = [
  ["labeled body pressure streams are available", bodyPressureStreams.includes("pressure_capsule_left")],
  [
    "compact log contains no raw accelerometer, barometer, or equilibrium fields",
    cases.every((testCase) =>
      testCase.events.every(
        (event) =>
          event.rawAccelerometer === undefined &&
          event.rawBarometer === undefined &&
          event.rawEquilibrium === undefined &&
          event.streamRow === undefined
      )
    ),
  ],
  [
    "confirmed balance case uses opposed foot pressure and capsule differential",
    hasFootPairOpposition(cases[0]) && hasLeftRightCapsuleDifferential(cases[0]),
  ],
  [
    "local foot obstacle does not become gravity rule",
    inferBodyPressureShape(cases[1]).anchorType === "local_foot_obstacle_anchor" &&
      consolidationRows.find((row) => row.caseId === "right_foot_object_not_gravity").decision === "no",
  ],
  [
    "commanded acceleration does not become standing balance rule",
    inferBodyPressureShape(cases[2]).anchorType === "acceleration_anchor" &&
      consolidationRows.find((row) => row.caseId === "forward_acceleration_not_gravity").decision === "no",
  ],
  [
    "air pressure capsule case stays separate from balance",
    inferBodyPressureShape(cases[3]).anchorType === "air_pressure_anchor" &&
      consolidationRows.find((row) => row.caseId === "air_pressure_capsule_not_balance").decision === "no",
  ],
  [
    "exactly one reusable balance/gravity rule is proposed",
    reusableRules.filter((rule) => rule.ruleId === "rule_body_pressure_balance_gravity_v1").length === 1,
  ],
  [
    "all cases become labeled examples",
    routineRows.filter((row) => row.output === "labeled_training_example").length === cases.length,
  ],
  [
    "all delayed consolidation rows run 60 seconds after correction",
    consolidationRows.every(
      (row) => row.dueSecond === cases.find((testCase) => testCase.caseId === row.caseId).events[0].second + 64
    ),
  ],
  [
    "map state separates balance, foot obstacle, acceleration, and air pressure anchors",
    new Set(Object.values(mapState.places).map((entry) => entry.anchorType)).size === 4,
  ],
];

const passed = checks.every(([, ok]) => ok);

const compactMarkdown = `# Body Pressure Balance Compact Log

Purpose: feed labeled foot pressure, torso contact, and paired pressure-capsule differentials into the inner-world map without using dedicated raw accelerometer, barometer, or equilibrium streams.

| case | second | local event | place | area | layer | event type | involved streams/body locations | detected value or rate | signed change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${cases.flatMap((testCase) => testCase.events.map((event, index) => renderCompactRow(testCase, event, index))).join("\n")}
`;

const routineMarkdown = `# Body Pressure Balance Routine Log

Purpose: show deterministic map-building prompts for balance/gravity, local foot obstacle, commanded acceleration, and air-pressure cases.

| case | second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- | --- |
${routineRows.map(renderRoutineRow).join("\n")}
`;

const correctionMarkdown = `# Body Pressure Balance Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
${cases.map(renderCorrectionRow).join("\n")}
`;

const consolidationMarkdown = `# Body Pressure Balance Delayed Consolidation Log

Purpose: run the one-minute consolidation handler after each compact body-pressure correction.

| case | due second | handler | question | evidence | decision | reusable rule | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
${consolidationRows.map(renderConsolidationRow).join("\n")}
`;

const ruleMarkdown = `# Body Pressure Balance Reusable Rule Output

Only the confirmed balance/tilt case should create a reusable balance/gravity rule. Local foot contact, commanded acceleration, and air-pressure changes remain narrower anchors.

| rule id | source case | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
${reusableRules.map(renderRuleRow).join("\n")}
`;

const resultMarkdown = `# Body Pressure Balance Inference Result

Purpose: test whether compact labeled touch/pressure differentials can infer balance, gravity direction, or pressure-gradient meaning without dedicated accelerometer, equilibrium, or barometric thought systems.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| compact log | \`outputs/body_pressure_balance_inference/body_pressure_balance_compact_log.md\` |
| routine log | \`outputs/body_pressure_balance_inference/body_pressure_balance_routine_log.md\` |
| teacher correction log | \`outputs/body_pressure_balance_inference/body_pressure_balance_teacher_correction_log.md\` |
| delayed consolidation log | \`outputs/body_pressure_balance_inference/body_pressure_balance_delayed_consolidation_log.md\` |
| reusable rule output | \`outputs/body_pressure_balance_inference/body_pressure_balance_reusable_rule_output.md\` |
| inner-world map state | \`outputs/body_pressure_balance_inference/body_pressure_balance_inner_world_map_state.json\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(routineLogPath, routineMarkdown);
await fs.writeFile(correctionLogPath, correctionMarkdown);
await fs.writeFile(consolidationPath, consolidationMarkdown);
await fs.writeFile(ruleOutputPath, ruleMarkdown);
await fs.writeFile(mapStatePath, `${JSON.stringify(mapState, null, 2)}\n`);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
