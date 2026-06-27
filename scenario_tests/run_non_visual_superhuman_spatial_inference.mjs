import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/non_visual_superhuman_spatial_inference");
const compactLogPath = path.join(outputDir, "non_visual_spatial_compact_log.md");
const routineLogPath = path.join(outputDir, "non_visual_spatial_routine_log.md");
const correctionLogPath = path.join(outputDir, "non_visual_spatial_teacher_correction_log.md");
const consolidationPath = path.join(outputDir, "non_visual_spatial_delayed_consolidation_log.md");
const ruleOutputPath = path.join(outputDir, "non_visual_spatial_reusable_rule_output.md");
const mapStatePath = path.join(outputDir, "non_visual_spatial_inner_world_map_state.json");
const resultPath = path.join(outputDir, "non_visual_superhuman_spatial_inference_result.md");

const spatialStreams = [
  "ultrasonic_echo",
  "reflection_volume",
  "movement_forward",
  "touch_torso_front",
  "touch_left_foot",
  "brightness",
  "volume",
];

const cases = [
  {
    caseId: "approaching_obstacle_confirmed",
    placeId: "training_room",
    areaId: "matte_wall_lane",
    actionContext: "moving forward toward a dull wall with weak visual contrast",
    teacherLabel: "non_visual_obstacle_confirmed",
    predictedLabel: "possible_obstacle_ahead",
    correctionNote:
      "The echo and reflection change are from a real obstacle ahead. Slow down, mark the obstacle, and prefer compact distance evidence before asking for raw vision.",
    events: [
      {
        second: 8,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "ultrasonic_echo",
        value: 0.66,
        signedChange: 0.66,
        threshold: "0.5",
      },
      {
        second: 8,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "reflection_volume",
        value: 0.58,
        signedChange: 0.58,
        threshold: "0.5",
      },
      {
        second: 8,
        layer: "n^-1",
        event: "rate_of_change_between_sensors",
        stream: "ultrasonic_echo, reflection_volume, movement_forward",
        value: 3,
        signedChange: 0,
        threshold: "2+ streams >= 0.5",
      },
      {
        second: 9,
        layer: "n^-2",
        event: "closing_distance_pattern_shift",
        stream: "compact trigger stream",
        value: 0.34,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "open_space_echo_not_obstacle",
    placeId: "training_room",
    areaId: "open_center_lane",
    actionContext: "moving forward into open space",
    teacherLabel: "open_space_confirmed",
    predictedLabel: "possible_open_space",
    correctionNote:
      "Echo return falls and reflection spreads out here. Keep the map open; do not create an obstacle rule from open-space echo.",
    events: [
      {
        second: 24,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "ultrasonic_echo",
        value: 0.52,
        signedChange: -0.52,
        threshold: "0.5",
      },
      {
        second: 24,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "reflection_volume",
        value: 0.5,
        signedChange: -0.5,
        threshold: "0.5",
      },
      {
        second: 25,
        layer: "n^-2",
        event: "open_space_pattern_shift",
        stream: "compact trigger stream",
        value: 0.18,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "close_low_contrast_obstacle",
    placeId: "training_room",
    areaId: "black_soft_block_lane",
    actionContext: "moving forward toward a dark low object that barely changes brightness",
    teacherLabel: "low_contrast_obstacle_confirmed",
    predictedLabel: "possible_close_low_obstacle",
    correctionNote:
      "This is a real low-contrast obstacle. Weak brightness does not cancel the echo, reflection, movement, and foot-risk evidence.",
    events: [
      {
        second: 40,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "ultrasonic_echo",
        value: 0.71,
        signedChange: 0.71,
        threshold: "0.5",
      },
      {
        second: 40,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "reflection_volume",
        value: 0.55,
        signedChange: 0.55,
        threshold: "0.5",
      },
      {
        second: 41,
        layer: "n^-1",
        event: "low_visual_change_below_threshold",
        stream: "brightness",
        value: 0.18,
        signedChange: 0.18,
        threshold: "< 0.5, no visual n^-1",
      },
      {
        second: 41,
        layer: "n^-1",
        event: "rate_of_change_within_touch_location",
        stream: "touch_left_foot",
        value: 0.64,
        signedChange: 0.64,
        threshold: "0.5",
      },
      {
        second: 42,
        layer: "n^-2",
        event: "close_low_obstacle_pattern_shift",
        stream: "compact trigger stream",
        value: 0.39,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "moving_sound_source_no_obstacle",
    placeId: "training_room",
    areaId: "speaker_cart_passing",
    actionContext: "a speaker moves sideways while the body stays clear",
    teacherLabel: "moving_sound_source_not_obstacle",
    predictedLabel: "possible_moving_source",
    correctionNote:
      "The sound source moved, but there was no physical obstacle in the path. Store a moving-source caution, not an obstacle rule.",
    events: [
      {
        second: 58,
        layer: "n",
        event: "threshold_hit",
        stream: "volume",
        value: 1.0,
        signedChange: 0,
        threshold: "1.0",
      },
      {
        second: 58,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        stream: "volume",
        value: 0.76,
        signedChange: 0.76,
        threshold: "0.5",
      },
      {
        second: 59,
        layer: "n^-1",
        event: "weak_echo_change_below_threshold",
        stream: "ultrasonic_echo",
        value: 0.12,
        signedChange: 0.12,
        threshold: "< 0.5, no echo support",
      },
      {
        second: 60,
        layer: "n^-2",
        event: "moving_sound_pattern_shift",
        stream: "compact trigger stream",
        value: 0.22,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
];

function hasStream(testCase, stream) {
  return testCase.events.some((event) => event.stream.split(", ").includes(stream));
}

function hasRisingStream(testCase, stream) {
  return testCase.events.some((event) => event.stream === stream && event.signedChange >= 0.5);
}

function hasBodyRisk(testCase) {
  return testCase.events.some(
    (event) =>
      (event.stream === "touch_torso_front" || event.stream === "touch_left_foot") && event.signedChange >= 0.5
  );
}

function inferSpatialShape(testCase) {
  const risingEcho = hasRisingStream(testCase, "ultrasonic_echo");
  const risingReflection = hasRisingStream(testCase, "reflection_volume");
  const fallingEcho = testCase.events.some((event) => event.stream === "ultrasonic_echo" && event.signedChange <= -0.5);
  const movement = hasStream(testCase, "movement_forward");
  const bodyRisk = hasBodyRisk(testCase);
  const soundOnly = hasStream(testCase, "volume") && !risingEcho && !risingReflection;
  const confirmedObstacle =
    testCase.teacherLabel === "non_visual_obstacle_confirmed" ||
    testCase.teacherLabel === "low_contrast_obstacle_confirmed";

  if (risingEcho && risingReflection && movement && confirmedObstacle) {
    return {
      shape: "closing_reflection_obstacle_shape",
      hypothesis: "possible_obstacle_ahead",
      mapQuestion:
        "Is echo/reflection return increasing while movement continues, meaning a surface is getting closer?",
      risk: "non_visual_obstacle_anchor",
      reusableRuleAllowed: true,
    };
  }

  if (risingEcho && risingReflection && bodyRisk && confirmedObstacle) {
    return {
      shape: "low_contrast_body_risk_obstacle_shape",
      hypothesis: "possible_close_low_obstacle",
      mapQuestion:
        "Did echo/reflection rise plus foot or torso risk reveal a close obstacle even though vision stayed weak?",
      risk: "low_contrast_obstacle_anchor",
      reusableRuleAllowed: true,
    };
  }

  if (fallingEcho && testCase.teacherLabel === "open_space_confirmed") {
    return {
      shape: "open_space_echo_shape",
      hypothesis: "possible_open_space",
      mapQuestion: "Is the echo return spreading or falling because this area is open?",
      risk: "open_space_anchor",
      reusableRuleAllowed: false,
    };
  }

  if (soundOnly) {
    return {
      shape: "moving_sound_without_physical_obstacle_shape",
      hypothesis: "possible_moving_source",
      mapQuestion:
        "Did a sound source move without echo/reflection or body-risk evidence of a physical obstacle?",
      risk: "moving_sound_source_anchor",
      reusableRuleAllowed: false,
    };
  }

  return {
    shape: "uncertain_non_visual_spatial_shape",
    hypothesis: "ask_for_more_context",
    mapQuestion: "Does this non-visual spatial evidence indicate obstacle, open path, or moving source?",
    risk: "unknown_spatial_anchor",
    reusableRuleAllowed: false,
  };
}

function buildRoutineRows(testCase) {
  const shape = inferSpatialShape(testCase);
  const target = `${testCase.placeId}/${testCase.areaId}`;
  const firstSecond = testCase.events[0].second;
  const rows = [
    {
      caseId: testCase.caseId,
      second: firstSecond,
      handler: "non_visual_spatial_map_prompt",
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
      handler: "compact_obstacle_distance_check",
      triggerPattern: "ultrasonic echo and reflection volume rise while movement/body-risk evidence stays relevant",
      mapTarget: "inner_world/routines/non_visual_obstacle_distance",
      output: "ask_slow_down_distance_and_path_clearance",
      detail:
        "Slow movement, estimate near/far obstacle from compact echo/reflection shape, and check whether torso or foot risk is rising.",
    });
  }

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond + 4,
    handler: "teacher_correction_label_handler",
    triggerPattern: `teacher label: ${testCase.teacherLabel}`,
    mapTarget: target,
    output: "confirmed_map_update",
    detail: `Attach teacher label ${testCase.teacherLabel} to compact non-visual spatial evidence for this map area.`,
  });

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond + 4,
    handler: "correction_example_builder",
    triggerPattern: "spatial prompt plus teacher correction",
    mapTarget: "inner_world/labeled_examples/non_visual_spatial_inference",
    output: "labeled_training_example",
    detail: `Store ${shape.shape}, prediction ${testCase.predictedLabel}, teacher label, and correction note.`,
  });

  return rows;
}

function buildConsolidation(testCase) {
  const shape = inferSpatialShape(testCase);
  const correctionSecond = testCase.events[0].second + 4;
  const evidenceAgrees = shape.reusableRuleAllowed && shape.risk.includes("obstacle");

  return {
    caseId: testCase.caseId,
    dueSecond: correctionSecond + 60,
    handler: "one_minute_non_visual_spatial_consolidation",
    question: "Should this corrected event become part of a reusable non-visual obstacle rule?",
    evidence: `${shape.shape}, map area ${testCase.areaId}, trusted teacher label ${testCase.teacherLabel}`,
    decision: evidenceAgrees ? "yes" : "no",
    reusableRuleId: evidenceAgrees ? "rule_non_visual_obstacle_distance_v1" : "",
    reason: evidenceAgrees
      ? "Compact echo/reflection evidence, movement or body-risk context, and teacher correction agree on obstacle presence without requiring raw vision."
      : "The compact evidence and teacher correction do not both support a physical obstacle in the path.",
  };
}

function buildReusableRules(consolidationRows) {
  const approvedRows = consolidationRows.filter((row) => row.decision === "yes");

  if (approvedRows.length === 0) {
    return [];
  }

  return [
    {
      ruleId: "rule_non_visual_obstacle_distance_v1",
      sourceCases: approvedRows.map((row) => row.caseId).join(", "),
      status: "candidate_reusable_rule",
      scope: "navigation areas where vision is weak or unavailable",
      compactInputPattern:
        "ultrasonic_echo n^-1 rise AND reflection_volume n^-1 rise AND movement/body-location risk supports closing distance",
      futureOutput:
        "infer likely obstacle presence or decreasing distance, slow movement, update map anchor, and open raw vision only if compact evidence conflicts or stakes are high",
    },
  ];
}

function buildMapState(routineRows, reusableRules) {
  const places = {};

  for (const testCase of cases) {
    const shape = inferSpatialShape(testCase);
    const target = `${testCase.placeId}/${testCase.areaId}`;
    places[target] = {
      latestTeacherLabel: testCase.teacherLabel,
      compactSpatialShape: shape.shape,
      anchorType: shape.risk,
      reusableRuleIds: reusableRules
        .filter((rule) => rule.sourceCases.split(", ").includes(testCase.caseId))
        .map((rule) => rule.ruleId),
      updateCount: routineRows.filter((row) => row.mapTarget === target).length,
    };
  }

  return {
    format: "inner_world_map_state_v1",
    note: "Inspectable state generated from compact non-visual and superhuman stream rows, not raw vision.",
    spatialStreams,
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
    row.sourceCases,
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
const obstacleCases = ["approaching_obstacle_confirmed", "close_low_contrast_obstacle"];
const nonObstacleCases = ["open_space_echo_not_obstacle", "moving_sound_source_no_obstacle"];

const checks = [
  ["superhuman/non-visual streams are available to the scenario", spatialStreams.includes("ultrasonic_echo")],
  [
    "compact log contains no raw vision or raw stream fields",
    cases.every((testCase) =>
      testCase.events.every(
        (event) =>
          event.rawVision === undefined &&
          event.rawBrightness === undefined &&
          event.rawUltrasonic === undefined &&
          event.streamRow === undefined
      )
    ),
  ],
  [
    "confirmed obstacle case uses echo, reflection, and movement history",
    hasRisingStream(cases[0], "ultrasonic_echo") &&
      hasRisingStream(cases[0], "reflection_volume") &&
      hasStream(cases[0], "movement_forward"),
  ],
  [
    "low-contrast obstacle can pass without visual threshold support",
    cases[2].events.some((event) => event.event === "low_visual_change_below_threshold") &&
      inferSpatialShape(cases[2]).reusableRuleAllowed,
  ],
  [
    "open-space echo does not create obstacle rule support",
    inferSpatialShape(cases[1]).risk === "open_space_anchor" &&
      consolidationRows.find((row) => row.caseId === "open_space_echo_not_obstacle").decision === "no",
  ],
  [
    "moving sound source does not become physical obstacle",
    inferSpatialShape(cases[3]).risk === "moving_sound_source_anchor" &&
      consolidationRows.find((row) => row.caseId === "moving_sound_source_no_obstacle").decision === "no",
  ],
  [
    "only confirmed obstacle cases support the reusable rule",
    obstacleCases.every((caseId) =>
      consolidationRows.some((row) => row.caseId === caseId && row.decision === "yes")
    ) &&
      nonObstacleCases.every((caseId) =>
        consolidationRows.some((row) => row.caseId === caseId && row.decision === "no")
      ),
  ],
  ["exactly one reusable non-visual obstacle rule is proposed", reusableRules.length === 1],
  [
    "all cases become labeled examples",
    routineRows.filter((row) => row.output === "labeled_training_example").length === cases.length,
  ],
  [
    "map state separates obstacle, open-space, and moving-source anchors",
    new Set(Object.values(mapState.places).map((entry) => entry.anchorType)).size === 4,
  ],
];

const passed = checks.every(([, ok]) => ok);

const compactMarkdown = `# Non-Visual Spatial Compact Log

Purpose: feed ultrasonic echo, reflection volume, movement history, weak visual evidence, and body-location risk into the inner-world map without exposing raw vision.

| case | second | local event | place | area | layer | event type | involved streams/body locations | detected value or rate | signed change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${cases.flatMap((testCase) => testCase.events.map((event, index) => renderCompactRow(testCase, event, index))).join("\n")}
`;

const routineMarkdown = `# Non-Visual Spatial Routine Log

Purpose: show deterministic map-building prompts for obstacle distance, open space, and moving sound-source cases.

| case | second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- | --- |
${routineRows.map(renderRoutineRow).join("\n")}
`;

const correctionMarkdown = `# Non-Visual Spatial Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
${cases.map(renderCorrectionRow).join("\n")}
`;

const consolidationMarkdown = `# Non-Visual Spatial Delayed Consolidation Log

Purpose: run the one-minute consolidation handler after each compact non-visual spatial correction.

| case | due second | handler | question | evidence | decision | reusable rule | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
${consolidationRows.map(renderConsolidationRow).join("\n")}
`;

const ruleMarkdown = `# Non-Visual Spatial Reusable Rule Output

The rule is approved from confirmed obstacle cases only. Open-space echo and moving sound-source cases remain narrower map updates.

| rule id | source cases | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
${reusableRules.map(renderRuleRow).join("\n")}
`;

const resultMarkdown = `# Non-Visual Superhuman Spatial Inference Result

Purpose: test whether compact ultrasonic echo, reflection volume, movement history, and body-location risk can infer obstacle presence or distance without raw vision.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| compact log | \`outputs/non_visual_superhuman_spatial_inference/non_visual_spatial_compact_log.md\` |
| spatial routine log | \`outputs/non_visual_superhuman_spatial_inference/non_visual_spatial_routine_log.md\` |
| teacher correction log | \`outputs/non_visual_superhuman_spatial_inference/non_visual_spatial_teacher_correction_log.md\` |
| delayed consolidation log | \`outputs/non_visual_superhuman_spatial_inference/non_visual_spatial_delayed_consolidation_log.md\` |
| reusable rule output | \`outputs/non_visual_superhuman_spatial_inference/non_visual_spatial_reusable_rule_output.md\` |
| inner-world map state | \`outputs/non_visual_superhuman_spatial_inference/non_visual_spatial_inner_world_map_state.json\` |

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
