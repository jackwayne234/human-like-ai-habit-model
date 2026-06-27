import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/road_crossing_caregiver_rule");
const compactLogPath = path.join(outputDir, "road_crossing_compact_log.md");
const routinePromptPath = path.join(outputDir, "road_crossing_caregiver_routine_log.md");
const correctionPath = path.join(outputDir, "road_crossing_teacher_correction_log.md");
const consolidationPath = path.join(outputDir, "road_crossing_delayed_consolidation_log.md");
const ruleOutputPath = path.join(outputDir, "road_crossing_reusable_rule_output.md");
const mapStatePath = path.join(outputDir, "road_crossing_inner_world_map_state.json");
const resultPath = path.join(outputDir, "road_crossing_caregiver_rule_result.md");

const touchSensors = [
  "touch_left_fingertips",
  "touch_right_fingertips",
  "touch_left_palm",
  "touch_right_palm",
  "touch_left_forearm",
  "touch_right_forearm",
  "touch_torso_front",
  "touch_torso_back",
  "touch_left_foot",
  "touch_right_foot",
];

const cases = [
  {
    caseId: "street_edge_confirmed_crossing",
    placeId: "neighborhood_walk",
    areaId: "curb_at_elm_street",
    actionContext: "moving forward from sidewalk toward street edge",
    teacherLabel: "road_crossing_area_confirmed",
    predictedLabel: "possible_road_crossing_context",
    correctionNote:
      "This is a street edge. Stop at the curb, look left and right, listen for cars, and cross only after the path is clear.",
    events: [
      {
        second: 12,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        senses: "brightness",
        value: 0.62,
        signedChange: 0.62,
        threshold: "0.5",
      },
      {
        second: 12,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        senses: "volume",
        value: 0.58,
        signedChange: 0.58,
        threshold: "0.5",
      },
      {
        second: 12,
        layer: "n^-1",
        event: "rate_of_change_between_sensors",
        senses: "brightness, volume",
        value: 2,
        signedChange: 0,
        threshold: "2 senses >= 0.5",
      },
      {
        second: 13,
        layer: "n",
        event: "threshold_hit",
        senses: "touch_left_foot",
        value: 1.0,
        signedChange: 0,
        threshold: "1.0",
      },
      {
        second: 13,
        layer: "n^-1",
        event: "rate_of_change_within_touch_location",
        senses: "touch_left_foot",
        value: 0.74,
        signedChange: 0.74,
        threshold: "0.5",
      },
      {
        second: 14,
        layer: "n^-2",
        event: "movement_and_vehicle_pattern_shift",
        senses: "compact trigger stream",
        value: 0.31,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "sidewalk_obstacle_not_crossing",
    placeId: "neighborhood_walk",
    areaId: "sidewalk_crack_near_mailbox",
    actionContext: "walking along sidewalk, not leaving sidewalk",
    teacherLabel: "sidewalk_obstacle_not_crossing",
    predictedLabel: "possible_ground_obstacle",
    correctionNote:
      "This foot contact is a sidewalk obstacle. Step carefully, but do not create the road-crossing rule from this case.",
    events: [
      {
        second: 30,
        layer: "n",
        event: "threshold_hit",
        senses: "touch_right_foot",
        value: 1.0,
        signedChange: 0,
        threshold: "1.0",
      },
      {
        second: 30,
        layer: "n^-1",
        event: "rate_of_change_within_touch_location",
        senses: "touch_right_foot",
        value: 0.7,
        signedChange: 0.7,
        threshold: "0.5",
      },
      {
        second: 31,
        layer: "n^-2",
        event: "foot_contact_pattern_shift",
        senses: "compact trigger stream",
        value: 0.16,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
  {
    caseId: "driveway_vehicle_sound_caution",
    placeId: "home_driveway",
    areaId: "garage_apron",
    actionContext: "near driveway while a vehicle starts nearby",
    teacherLabel: "vehicle_nearby_caution_not_crossing_rule",
    predictedLabel: "possible_vehicle_nearby",
    correctionNote:
      "A vehicle sound near a driveway means pause and watch, but this example alone is not the full public-road crossing rule.",
    events: [
      {
        second: 44,
        layer: "n",
        event: "threshold_hit",
        senses: "volume",
        value: 1.0,
        signedChange: 0,
        threshold: "1.0",
      },
      {
        second: 44,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        senses: "volume",
        value: 0.77,
        signedChange: 0.77,
        threshold: "0.5",
      },
      {
        second: 45,
        layer: "n^-1",
        event: "rate_of_change_within_sensor",
        senses: "brightness",
        value: 0.54,
        signedChange: 0.54,
        threshold: "0.5",
      },
      {
        second: 46,
        layer: "n^-2",
        event: "vehicle_sound_pattern_shift",
        senses: "compact trigger stream",
        value: 0.23,
        signedChange: 0,
        threshold: "> 0 shift",
      },
    ],
  },
];

function eventsForCase(testCase, predicate) {
  return testCase.events.filter(predicate);
}

function hasSense(testCase, sense) {
  return testCase.events.some((event) => event.senses.split(", ").includes(sense));
}

function hasTouchFootContact(testCase) {
  return touchSensors.some(
    (sensor) =>
      sensor.endsWith("_foot") &&
      eventsForCase(testCase, (event) => event.senses === sensor && event.value >= 0.7).length > 0
  );
}

function hasCrossMovementEvidence(testCase) {
  return (
    hasSense(testCase, "brightness") &&
    hasSense(testCase, "volume") &&
    testCase.events.some((event) => event.event === "rate_of_change_between_sensors")
  );
}

function inferCrossingShape(testCase) {
  const footContact = hasTouchFootContact(testCase);
  const crossMovement = hasCrossMovementEvidence(testCase);
  const vehicleSound = hasSense(testCase, "volume");
  const visualChange = hasSense(testCase, "brightness");
  const confirmedRoad = testCase.teacherLabel === "road_crossing_area_confirmed";

  if (footContact && crossMovement && confirmedRoad) {
    return {
      shape: "curb_plus_vehicle_crossing_shape",
      hypothesis: "possible_road_crossing_context",
      mapQuestion:
        "Am I at a curb or road edge, and do I need the stop/look-left-right/listen routine before moving?",
      risk: "road_crossing_risk",
      reusableRuleAllowed: true,
    };
  }

  if (footContact && !crossMovement) {
    return {
      shape: "foot_obstacle_without_road_evidence",
      hypothesis: "possible_ground_obstacle",
      mapQuestion: "Did a foot/base contact an obstacle, step edge, or uneven sidewalk?",
      risk: "ground_obstacle_anchor",
      reusableRuleAllowed: false,
    };
  }

  if (vehicleSound && visualChange) {
    return {
      shape: "vehicle_sound_without_curb_confirmation",
      hypothesis: "vehicle_nearby_caution",
      mapQuestion: "Is there nearby vehicle motion, and should movement pause while the map remains uncertain?",
      risk: "vehicle_caution_anchor",
      reusableRuleAllowed: false,
    };
  }

  return {
    shape: "unlabeled_movement_safety_shape",
    hypothesis: "ask_for_more_context",
    mapQuestion: "Is this movement pattern safe, blocked, or crossing-related?",
    risk: "unknown_movement_risk",
    reusableRuleAllowed: false,
  };
}

function buildRoutineRows(testCase) {
  const shape = inferCrossingShape(testCase);
  const target = `${testCase.placeId}/${testCase.areaId}`;
  const firstSecond = testCase.events[0].second;
  const rows = [];

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond,
    handler: "caregiver_movement_safety_prompt",
    triggerPattern: shape.shape,
    mapTarget: target,
    output: shape.hypothesis,
    detail: shape.mapQuestion,
  });

  if (shape.risk === "road_crossing_risk") {
    rows.push({
      caseId: testCase.caseId,
      second: firstSecond + 1,
      handler: "road_crossing_check_sequence",
      triggerPattern: "compact sight/volume/foot contact agree near road-like anchor",
      mapTarget: "inner_world/routines/road_crossing",
      output: "ask_left_right_sound_motion_clearance",
      detail:
        "Pause movement, check left, check right, listen for vehicle volume change, and require clear-path confirmation before crossing.",
    });
  }

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond + 4,
    handler: "teacher_correction_label_handler",
    triggerPattern: `teacher label: ${testCase.teacherLabel}`,
    mapTarget: target,
    output: "confirmed_map_update",
    detail: `Attach teacher label ${testCase.teacherLabel} to compact movement/contact evidence for this map area.`,
  });

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond + 4,
    handler: "correction_example_builder",
    triggerPattern: "caregiver prompt plus teacher correction",
    mapTarget: "inner_world/labeled_examples/movement_safety",
    output: "labeled_training_example",
    detail: `Store ${shape.shape}, prediction ${testCase.predictedLabel}, teacher label, and correction note.`,
  });

  return rows;
}

function buildConsolidation(testCase) {
  const shape = inferCrossingShape(testCase);
  const correctionSecond = testCase.events[0].second + 4;
  const evidenceAgrees =
    shape.risk === "road_crossing_risk" && testCase.teacherLabel === "road_crossing_area_confirmed";

  return {
    caseId: testCase.caseId,
    dueSecond: correctionSecond + 60,
    handler: "one_minute_caregiver_rule_consolidation",
    question: "Should this corrected event become a reusable road-crossing safety rule?",
    evidence: `${shape.shape}, map area ${testCase.areaId}, trusted teacher label ${testCase.teacherLabel}`,
    decision: evidenceAgrees ? "yes" : "no",
    reusableRuleId: evidenceAgrees ? "rule_movement_road_crossing_caregiver_v1" : "",
    reason: evidenceAgrees
      ? "Compact sight, volume, movement/contact evidence, map context, and teacher correction agree on road-crossing behavior."
      : "Teacher correction and compact evidence do not both support the full crossing rule, so this stays a narrower map update.",
  };
}

function buildReusableRules(consolidationRows) {
  return consolidationRows
    .filter((row) => row.decision === "yes")
    .map((row) => ({
      ruleId: row.reusableRuleId,
      sourceCase: row.caseId,
      status: "candidate_reusable_rule",
      scope: "road/street-edge mapped areas",
      compactInputPattern:
        "movement toward road-like anchor AND brightness n^-1 change AND volume n^-1 vehicle-like change AND foot/base contact at curb/edge",
      futureOutput:
        "pause movement, ask left/right/sound/motion clearance questions, cross only after compact evidence and map context indicate clear path",
    }));
}

function buildMapState(routineRows, reusableRules) {
  const places = {};

  for (const testCase of cases) {
    const shape = inferCrossingShape(testCase);
    const target = `${testCase.placeId}/${testCase.areaId}`;
    places[target] = {
      latestTeacherLabel: testCase.teacherLabel,
      compactSafetyShape: shape.shape,
      riskType: shape.risk,
      reusableRuleIds: reusableRules.filter((rule) => rule.sourceCase === testCase.caseId).map((rule) => rule.ruleId),
      updateCount: routineRows.filter((row) => row.mapTarget === target).length,
    };
  }

  return {
    format: "inner_world_map_state_v1",
    note: "Inspectable state generated from compact caregiver road-crossing cases, not raw sensory stream rows.",
    touchLayout: touchSensors,
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
    event.senses,
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
const crossingRules = reusableRules.filter((rule) => rule.ruleId === "rule_movement_road_crossing_caregiver_v1");
const nonCrossingCases = cases.filter((testCase) => testCase.caseId !== "street_edge_confirmed_crossing");

const checks = [
  ["ten touch location streams are available to the scenario", touchSensors.length === 10],
  [
    "compact log contains no raw stream fields",
    cases.every((testCase) =>
      testCase.events.every(
        (event) =>
          event.rawBrightness === undefined &&
          event.rawVolume === undefined &&
          event.rawTouch === undefined &&
          event.streamRow === undefined
      )
    ),
  ],
  [
    "street edge case uses compact sight, volume, and foot location evidence",
    hasCrossMovementEvidence(cases[0]) && hasTouchFootContact(cases[0]),
  ],
  [
    "caregiver routine asks road map and clearance questions",
    routineRows.some((row) => row.output === "ask_left_right_sound_motion_clearance") &&
      routineRows.some((row) => row.detail.includes("curb or road edge")),
  ],
  [
    "teacher correction and compact evidence must agree before consolidation",
    consolidationRows.filter((row) => row.decision === "yes").length === 1 &&
      consolidationRows.find((row) => row.caseId === "street_edge_confirmed_crossing").decision === "yes",
  ],
  [
    "non-road cases do not create crossing rules",
    nonCrossingCases.every((testCase) => !reusableRules.some((rule) => rule.sourceCase === testCase.caseId)),
  ],
  ["exactly one reusable crossing rule is proposed", crossingRules.length === 1],
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
    "map state separates crossing, obstacle, and caution anchors",
    new Set(Object.values(mapState.places).map((entry) => entry.riskType)).size === 3,
  ],
];
const passed = checks.every(([, ok]) => ok);

const compactMarkdown = `# Road-Crossing Caregiver Compact Log

Purpose: feed compact sight, volume, movement, and multi-location touch evidence into a caregiver-style crossing routine without exposing raw sensory stream rows.

| case | second | local event | place | area | layer | event type | involved senses/body locations | detected value or rate | signed change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${cases.flatMap((testCase) => testCase.events.map((event, index) => renderCompactRow(testCase, event, index))).join("\n")}
`;

const routineMarkdown = `# Road-Crossing Caregiver Routine Log

Purpose: show the deterministic caregiver-style prompts that scaffold safety and map-building before the behavior is learned.

| case | second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- | --- |
${routineRows.map(renderRoutineRow).join("\n")}
`;

const correctionMarkdown = `# Road-Crossing Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
${cases.map(renderCorrectionRow).join("\n")}
`;

const consolidationMarkdown = `# Road-Crossing Delayed Consolidation Log

Purpose: run the one-minute consolidation handler after each caregiver-rule correction.

| case | due second | handler | question | evidence | decision | reusable rule | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
${consolidationRows.map(renderConsolidationRow).join("\n")}
`;

const ruleMarkdown = `# Road-Crossing Reusable Rule Output

Only the case where compact evidence and trusted teacher correction agree should become a reusable crossing rule.

| rule id | source case | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
${reusableRules.map(renderRuleRow).join("\n")}
`;

const resultMarkdown = `# Road-Crossing Caregiver Rule Result

Purpose: test a caregiver-style road-crossing bootstrap routine using compact logs and the multi-location touch layout.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| compact log | \`outputs/road_crossing_caregiver_rule/road_crossing_compact_log.md\` |
| caregiver routine log | \`outputs/road_crossing_caregiver_rule/road_crossing_caregiver_routine_log.md\` |
| teacher correction log | \`outputs/road_crossing_caregiver_rule/road_crossing_teacher_correction_log.md\` |
| delayed consolidation log | \`outputs/road_crossing_caregiver_rule/road_crossing_delayed_consolidation_log.md\` |
| reusable rule output | \`outputs/road_crossing_caregiver_rule/road_crossing_reusable_rule_output.md\` |
| inner-world map state | \`outputs/road_crossing_caregiver_rule/road_crossing_inner_world_map_state.json\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(routinePromptPath, routineMarkdown);
await fs.writeFile(correctionPath, correctionMarkdown);
await fs.writeFile(consolidationPath, consolidationMarkdown);
await fs.writeFile(ruleOutputPath, ruleMarkdown);
await fs.writeFile(mapStatePath, `${JSON.stringify(mapState, null, 2)}\n`);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
