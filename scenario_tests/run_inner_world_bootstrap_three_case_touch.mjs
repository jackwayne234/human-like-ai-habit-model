import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/inner_world_bootstrap_three_case_touch");
const compactLogPath = path.join(outputDir, "three_case_compact_touch_log.md");
const mapUpdatePath = path.join(outputDir, "three_case_map_update_log.md");
const correctionPath = path.join(outputDir, "three_case_teacher_correction_log.md");
const consolidationPath = path.join(outputDir, "three_case_delayed_consolidation_log.md");
const ruleOutputPath = path.join(outputDir, "three_case_reusable_rule_output.md");
const mapStatePath = path.join(outputDir, "three_case_inner_world_map_state.json");
const resultPath = path.join(outputDir, "three_case_inner_world_bootstrap_result.md");

const cases = [
  {
    caseId: "real_hot_stove",
    placeId: "home_kitchen",
    areaId: "stove_counter_edge",
    actionContext: "hand exploring near stove during evening kitchen routine",
    teacherLabel: "touched_hot_stove",
    predictedLabel: "possible_hot_surface_contact",
    correctionNote: "Touch n=1 with fast rise and controlled withdrawal near the stove means hot-surface contact.",
    events: [
      { second: 8, layer: "n", event: "threshold_hit", senses: "touch", value: 1.0, signedChange: 0, threshold: "1.0" },
      { second: 8, layer: "n^-1", event: "rate_of_change_within_sensor", senses: "touch", value: 0.81, signedChange: 0.81, threshold: "0.5" },
      { second: 8, layer: "n^-2", event: "rate_of_rate_change", senses: "n^-1 trigger stream", value: 0.17, signedChange: 0, threshold: "> 0 shift" },
      { second: 9, layer: "n^-1", event: "rate_of_change_within_sensor", senses: "touch", value: 0.76, signedChange: -0.76, threshold: "0.5" },
      { second: 10, layer: "n^-2", event: "rate_of_rate_change", senses: "n^-1 trigger stream", value: 0.17, signedChange: 0, threshold: "> 0 shift" },
    ],
  },
  {
    caseId: "harmless_counter_pressure",
    placeId: "home_kitchen",
    areaId: "cool_counter_edge",
    actionContext: "hand leaning on a cool counter while reaching for a cup",
    teacherLabel: "harmless_counter_pressure",
    predictedLabel: "unlabeled_touch_max",
    correctionNote: "Touch n=1 built gradually from pressure on the counter; this is a contact anchor, not a heat danger.",
    events: [
      { second: 20, layer: "n^-2", event: "gradual_touch_buildup_summary", senses: "touch", value: 0.18, signedChange: 0.18, threshold: "compact shape summary" },
      { second: 25, layer: "n", event: "threshold_hit", senses: "touch", value: 1.0, signedChange: 0, threshold: "1.0" },
    ],
  },
  {
    caseId: "sharp_object_contact",
    placeId: "home_kitchen",
    areaId: "utensil_drawer_edge",
    actionContext: "hand reaching near loose utensils",
    teacherLabel: "touched_sharp_object",
    predictedLabel: "possible_sharp_contact",
    correctionNote: "Touch n=1 with very fast rise and very fast fall near utensils means sharp or painful brief contact.",
    events: [
      { second: 34, layer: "n", event: "threshold_hit", senses: "touch", value: 1.0, signedChange: 0, threshold: "1.0" },
      { second: 34, layer: "n^-1", event: "rate_of_change_within_sensor", senses: "touch", value: 0.84, signedChange: 0.84, threshold: "0.5" },
      { second: 34, layer: "n^-2", event: "rate_of_rate_change", senses: "n^-1 trigger stream", value: 0.21, signedChange: 0, threshold: "> 0 shift" },
      { second: 35, layer: "n^-1", event: "rate_of_change_within_sensor", senses: "touch", value: 0.91, signedChange: -0.91, threshold: "0.5" },
      { second: 36, layer: "n^-2", event: "rate_of_rate_change", senses: "n^-1 trigger stream", value: 0.22, signedChange: 0, threshold: "> 0 shift" },
    ],
  },
];

function touchEvents(testCase) {
  return testCase.events.filter((event) => event.senses === "touch");
}

function hasTouchMax(testCase) {
  return touchEvents(testCase).some((event) => event.layer === "n" && event.event === "threshold_hit");
}

function signedTouchRateEvents(testCase) {
  return touchEvents(testCase).filter((event) => event.layer === "n^-1");
}

function inferTouchShape(testCase) {
  const rates = signedTouchRateEvents(testCase).map((event) => event.signedChange);
  const maxRise = Math.max(0, ...rates);
  const maxFall = Math.abs(Math.min(0, ...rates));
  const gradualSummary = touchEvents(testCase).some((event) => event.event === "gradual_touch_buildup_summary");

  if (hasTouchMax(testCase) && maxRise >= 0.75 && maxFall >= 0.85) {
    return {
      shape: "sharp_brief_contact_shape",
      hypothesis: "possible_sharp_object_contact",
      risk: "sharp_object_risk",
      reusableRuleAllowed: testCase.teacherLabel === "touched_sharp_object",
    };
  }

  if (hasTouchMax(testCase) && maxRise >= 0.7 && maxFall >= 0.5) {
    return {
      shape: "hot_surface_contact_shape",
      hypothesis: "possible_hot_surface_contact",
      risk: "hot_surface_risk",
      reusableRuleAllowed: testCase.teacherLabel === "touched_hot_stove",
    };
  }

  if (hasTouchMax(testCase) && gradualSummary) {
    return {
      shape: "gradual_pressure_contact_shape",
      hypothesis: "contact_anchor_or_pressure",
      risk: "no_danger_rule",
      reusableRuleAllowed: false,
    };
  }

  return {
    shape: "unlabeled_touch_shape",
    hypothesis: "ask_for_more_context",
    risk: "unknown_touch_risk",
    reusableRuleAllowed: false,
  };
}

function buildMapUpdates(testCase) {
  const shape = inferTouchShape(testCase);
  const target = `${testCase.placeId}/${testCase.areaId}`;
  const firstSecond = testCase.events[0].second;
  const correctionSecond = firstSecond + 4;
  const rows = [];

  if (hasTouchMax(testCase)) {
    rows.push({
      caseId: testCase.caseId,
      second: firstSecond,
      handler: "touch_n_1_surface_question",
      triggerPattern: "touch n=1 in one mapped area",
      mapTarget: target,
      output: "ask_surface_identity",
      detail: "What surface is here, and should this contact point be marked risky?",
    });
  }

  rows.push({
    caseId: testCase.caseId,
    second: firstSecond,
    handler: "touch_shape_classifier",
    triggerPattern: shape.shape,
    mapTarget: target,
    output: shape.hypothesis,
    detail:
      shape.risk === "no_danger_rule"
        ? "Treat as a contact anchor unless later evidence says it is dangerous."
        : `Mark possible ${shape.risk} while waiting for correction or repeated evidence.`,
  });

  rows.push({
    caseId: testCase.caseId,
    second: correctionSecond,
    handler: "teacher_correction_label_handler",
    triggerPattern: `teacher label: ${testCase.teacherLabel}`,
    mapTarget: target,
    output: "confirmed_map_update",
    detail: `Attach teacher label ${testCase.teacherLabel} to this compact touch shape and mapped area.`,
  });

  rows.push({
    caseId: testCase.caseId,
    second: correctionSecond,
    handler: "correction_example_builder",
    triggerPattern: "prediction plus teacher correction",
    mapTarget: "inner_world/labeled_examples/touch_contact",
    output: "labeled_training_example",
    detail: `Store ${shape.shape}, scene prior, prediction ${testCase.predictedLabel}, teacher label, and correction note.`,
  });

  return rows;
}

function buildConsolidation(testCase) {
  const shape = inferTouchShape(testCase);
  const correctionSecond = testCase.events[0].second + 4;
  const reusableRuleId =
    shape.risk === "hot_surface_risk"
      ? "rule_touch_hot_surface_contact_v2"
      : shape.risk === "sharp_object_risk"
        ? "rule_touch_sharp_object_contact_v1"
        : "";

  return {
    caseId: testCase.caseId,
    dueSecond: correctionSecond + 60,
    handler: "one_minute_notable_event_consolidation",
    question: "Should this corrected event become a reusable general rule?",
    evidence: `${shape.shape}, map area ${testCase.areaId}, trusted teacher label ${testCase.teacherLabel}`,
    decision: shape.reusableRuleAllowed ? "yes" : "no",
    reusableRuleId,
    reason: shape.reusableRuleAllowed
      ? "Compact shape, mapped context, and teacher correction agree on a reusable danger pattern."
      : "This should update the map as a contact anchor, but it should not become a danger rule from one harmless pressure example.",
  };
}

function buildReusableRules(consolidationRows) {
  return consolidationRows
    .filter((row) => row.decision === "yes")
    .map((row) => {
      if (row.reusableRuleId === "rule_touch_hot_surface_contact_v2") {
        return {
          ruleId: row.reusableRuleId,
          sourceCase: row.caseId,
          status: "candidate_reusable_rule",
          scope: "kitchen/stove-like mapped areas",
          compactInputPattern:
            "touch n=1 AND signed touch n^-1 sudden rise >= +0.7 AND signed withdrawal between -0.5 and -0.85 near stove-like anchor",
          futureOutput: "predict hot-surface contact, mark hot-risk, pull attention outward, avoid raw detail unless context conflicts",
        };
      }

      return {
        ruleId: row.reusableRuleId,
        sourceCase: row.caseId,
        status: "candidate_reusable_rule",
        scope: "utensil/drawer/sharp-object mapped areas",
        compactInputPattern:
          "touch n=1 AND signed touch n^-1 sudden rise >= +0.75 AND signed fall <= -0.85 near sharp-object anchor",
        futureOutput: "predict sharp-object contact, mark cut/puncture risk, pull attention outward, request raw/detail only if object identity is uncertain",
      };
    });
}

function buildMapState(mapUpdates, reusableRules) {
  const places = {};

  for (const testCase of cases) {
    const shape = inferTouchShape(testCase);
    const target = `${testCase.placeId}/${testCase.areaId}`;
    places[target] = {
      latestTeacherLabel: testCase.teacherLabel,
      compactTouchShape: shape.shape,
      riskType: shape.risk,
      reusableRuleIds: reusableRules.filter((rule) => rule.sourceCase === testCase.caseId).map((rule) => rule.ruleId),
      updateCount: mapUpdates.filter((row) => row.mapTarget === target).length,
    };
  }

  return {
    format: "inner_world_map_state_v1",
    note: "Inspectable state generated from compact touch bootstrap cases, not raw sensory stream rows.",
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

function renderMapUpdateRow(row) {
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

const mapUpdates = cases.flatMap(buildMapUpdates);
const consolidationRows = cases.map(buildConsolidation);
const reusableRules = buildReusableRules(consolidationRows);
const mapState = buildMapState(mapUpdates, reusableRules);

const hotRules = reusableRules.filter((rule) => rule.ruleId.includes("hot"));
const sharpRules = reusableRules.filter((rule) => rule.ruleId.includes("sharp"));
const pressureConsolidation = consolidationRows.find((row) => row.caseId === "harmless_counter_pressure");

const checks = [
  ["three touch cases are present", cases.length === 3],
  ["compact log contains no raw sensory stream fields", cases.every((testCase) => testCase.events.every((event) => event.brightness === undefined))],
  ["real hot stove creates exactly one hot-surface rule", hotRules.length === 1 && hotRules[0].sourceCase === "real_hot_stove"],
  ["harmless counter pressure does not create a danger rule", pressureConsolidation.decision === "no" && !reusableRules.some((rule) => rule.sourceCase === "harmless_counter_pressure")],
  ["sharp object creates a different rule from hot stove", sharpRules.length === 1 && sharpRules[0].sourceCase === "sharp_object_contact"],
  ["all cases become labeled examples", mapUpdates.filter((row) => row.output === "labeled_training_example").length === 3],
  ["all delayed consolidation rows run 60 seconds after correction", consolidationRows.every((row) => row.dueSecond === cases.find((testCase) => testCase.caseId === row.caseId).events[0].second + 64)],
  ["map state keeps separate risk types", new Set(Object.values(mapState.places).map((entry) => entry.riskType)).size === 3],
];
const passed = checks.every(([, ok]) => ok);

const compactMarkdown = `# Three-Case Compact Touch Log

Purpose: feed compact touch perception into inner-world bootstrap handlers without using raw sensory stream rows.

The \`signed touch change\` column is a compact shape feature, not a raw stream replay. It lets the handler distinguish rise from withdrawal.

| case | second | local event | place | area | layer | event type | involved senses | detected value or rate | signed touch change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${cases.flatMap((testCase) => testCase.events.map((event, index) => renderCompactRow(testCase, event, index))).join("\n")}
`;

const mapUpdateMarkdown = `# Three-Case Map Update Log

Purpose: test whether deterministic inner-world bootstrap handlers avoid turning every touch n=1 event into the same hot-stove rule.

| case | second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- | --- |
${mapUpdates.map(renderMapUpdateRow).join("\n")}
`;

const correctionMarkdown = `# Three-Case Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
${cases.map(renderCorrectionRow).join("\n")}
`;

const consolidationMarkdown = `# Three-Case Delayed Consolidation Log

Purpose: run the one-minute consolidation handler for each corrected touch case.

| case | due second | handler | question | evidence | decision | reusable rule | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
${consolidationRows.map(renderConsolidationRow).join("\n")}
`;

const ruleMarkdown = `# Three-Case Reusable Rule Output

Only the danger cases should become reusable danger rules. Harmless pressure should remain a map/contact-anchor update.

| rule id | source case | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
${reusableRules.map(renderRuleRow).join("\n")}
`;

const resultMarkdown = `# Three-Case Inner-World Bootstrap Result

Purpose: pressure-test the first bootstrap scaffold against overgeneralization.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| compact touch log | \`outputs/inner_world_bootstrap_three_case_touch/three_case_compact_touch_log.md\` |
| map update log | \`outputs/inner_world_bootstrap_three_case_touch/three_case_map_update_log.md\` |
| teacher correction log | \`outputs/inner_world_bootstrap_three_case_touch/three_case_teacher_correction_log.md\` |
| delayed consolidation log | \`outputs/inner_world_bootstrap_three_case_touch/three_case_delayed_consolidation_log.md\` |
| reusable rule output | \`outputs/inner_world_bootstrap_three_case_touch/three_case_reusable_rule_output.md\` |
| inner-world map state | \`outputs/inner_world_bootstrap_three_case_touch/three_case_inner_world_map_state.json\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(mapUpdatePath, mapUpdateMarkdown);
await fs.writeFile(correctionPath, correctionMarkdown);
await fs.writeFile(consolidationPath, consolidationMarkdown);
await fs.writeFile(ruleOutputPath, ruleMarkdown);
await fs.writeFile(mapStatePath, `${JSON.stringify(mapState, null, 2)}\n`);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
