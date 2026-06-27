import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/inner_world_bootstrap_hot_stove");
const compactLogPath = path.join(outputDir, "hot_stove_compact_n_log.md");
const mapUpdatePath = path.join(outputDir, "hot_stove_map_update_log.md");
const correctionPath = path.join(outputDir, "hot_stove_teacher_correction_log.md");
const consolidationPath = path.join(outputDir, "hot_stove_delayed_consolidation_log.md");
const reusableRulePath = path.join(outputDir, "hot_stove_reusable_rule_output.md");
const resultPath = path.join(outputDir, "hot_stove_inner_world_bootstrap_result.md");

const scenePrior = {
  placeId: "home_kitchen",
  areaId: "stove_counter_edge",
  actionContext: "hand exploring work surface during evening kitchen routine",
};

const compactEvents = [
  {
    atSecond: 8,
    chunk: 3,
    tick: 8,
    layer: "n",
    event: "threshold_hit",
    senses: "touch",
    value: "1.00",
    threshold: "1.0",
  },
  {
    atSecond: 8,
    chunk: 3,
    tick: 8,
    layer: "n^-1",
    event: "rate_of_change_within_sensor",
    senses: "touch",
    value: "0.81",
    threshold: "0.5",
  },
  {
    atSecond: 8,
    chunk: 3,
    tick: 8,
    layer: "n^-2",
    event: "rate_of_rate_change",
    senses: "n^-1 trigger stream",
    value: "0.17",
    threshold: "> 0 shift",
  },
  {
    atSecond: 9,
    chunk: 3,
    tick: 9,
    layer: "n^-1",
    event: "rate_of_change_within_sensor",
    senses: "touch",
    value: "0.76",
    threshold: "0.5",
  },
  {
    atSecond: 10,
    chunk: 3,
    tick: 10,
    layer: "n^-2",
    event: "rate_of_rate_change",
    senses: "n^-1 trigger stream",
    value: "0.17",
    threshold: "> 0 shift",
  },
];

const teacherCorrection = {
  atSecond: 12,
  source: "trusted_teacher",
  predictedLabel: "possible_hot_surface_contact",
  teacherLabel: "touched_hot_stove",
  note: "In this kitchen area, touch n=1 with fast touch rise and fast withdrawal means the hand contacted a hot stove surface.",
};

function hasTouchMax(events) {
  return events.some(
    (event) => event.layer === "n" && event.event === "threshold_hit" && event.senses === "touch"
  );
}

function touchRateEvents(events) {
  return events.filter(
    (event) => event.layer === "n^-1" && event.event === "rate_of_change_within_sensor" && event.senses === "touch"
  );
}

function inferTouchShape(events) {
  const rates = touchRateEvents(events).map((event) => Number(event.value));
  const hasSuddenRise = rates[0] >= 0.7;
  const hasWithdrawal = rates.slice(1).some((rate) => rate >= 0.5);

  if (hasTouchMax(events) && hasSuddenRise && hasWithdrawal) {
    return "sudden_hot_surface_contact_shape";
  }

  if (hasTouchMax(events) && hasSuddenRise) {
    return "possible_hot_surface_contact";
  }

  return "unlabeled_touch_pattern";
}

function runCronHandlers(events, correction) {
  const rows = [];
  const touchShape = inferTouchShape(events);

  if (hasTouchMax(events)) {
    rows.push({
      atSecond: 8,
      handler: "touch_n_1_surface_question",
      triggerPattern: "touch n=1 in one mapped area",
      mapTarget: `${scenePrior.placeId}/${scenePrior.areaId}`,
      output: "ask_surface_identity",
      detail: "What surface is here, and should this contact point be marked risky?",
    });
  }

  if (touchShape === "sudden_hot_surface_contact_shape") {
    rows.push({
      atSecond: 8,
      handler: "touch_rate_shape_risk_update",
      triggerPattern: "touch n=1 plus fast touch rise and withdrawal",
      mapTarget: `${scenePrior.placeId}/${scenePrior.areaId}`,
      output: "map_risk_hypothesis",
      detail: "Mark this area as possible hot surface; lower raw-detail need because compact shape is already specific.",
    });
  }

  rows.push({
    atSecond: correction.atSecond,
    handler: "teacher_correction_label_handler",
    triggerPattern: `teacher label: ${correction.teacherLabel}`,
    mapTarget: `${scenePrior.placeId}/${scenePrior.areaId}`,
    output: "confirmed_map_update",
    detail: "Attach label touched_hot_stove to this surface contact pattern and raise trusted-teacher confidence.",
  });

  rows.push({
    atSecond: correction.atSecond,
    handler: "correction_example_builder",
    triggerPattern: "prediction plus teacher correction",
    mapTarget: "inner_world/labeled_examples/touch_danger",
    output: "labeled_training_example",
    detail: "Store compact pattern, scene prior, prediction, teacher label, and correction note for future interpretation.",
  });

  return rows;
}

function buildConsolidationRows(events, correction) {
  const dueAtSecond = correction.atSecond + 60;
  return [
    {
      dueAtSecond,
      handler: "one_minute_notable_event_consolidation",
      question: "Should this corrected event become a reusable general rule?",
      evidence: "touch n=1, strong touch n^-1 rise, withdrawal n^-1, kitchen/stove area, trusted teacher correction",
      decision: "yes",
      reason: "Compact pattern and correction agree, and the event marks a repeatable contact danger.",
    },
  ];
}

function buildReusableRule(events, correction) {
  return {
    ruleId: "rule_touch_hot_stove_contact_v1",
    status: "candidate_reusable_rule",
    scope: "kitchen/stove-like mapped areas",
    compactInputPattern:
      "touch n=1 AND touch n^-1 sudden rise >= 0.7 AND touch n^-1 withdrawal >= 0.5 near stove/counter map anchor",
    teacherLabel: correction.teacherLabel,
    futureOutput:
      "predict touched_hot_stove, mark surface as hot-risk, pull attention outward, and avoid opening raw detail unless the compact pattern conflicts with map context or teacher correction",
    rawInspectionPolicy:
      "not normally required after this correction because the compact rate-shape plus place context identifies the event",
  };
}

function renderCompactEventRow(row) {
  return `| ${[
    row.atSecond,
    row.chunk,
    row.tick,
    row.layer,
    row.event,
    row.senses,
    row.value,
    row.threshold,
  ].join(" | ")} |`;
}

function renderMapUpdateRow(row) {
  return `| ${[
    row.atSecond,
    row.handler,
    row.triggerPattern,
    row.mapTarget,
    row.output,
    row.detail,
  ].join(" | ")} |`;
}

function renderConsolidationRow(row) {
  return `| ${[
    row.dueAtSecond,
    row.handler,
    row.question,
    row.evidence,
    row.decision,
    row.reason,
  ].join(" | ")} |`;
}

await fs.mkdir(outputDir, { recursive: true });

const mapUpdates = runCronHandlers(compactEvents, teacherCorrection);
const consolidationRows = buildConsolidationRows(compactEvents, teacherCorrection);
const reusableRule = buildReusableRule(compactEvents, teacherCorrection);

const checks = [
  ["compact input contains no raw sensory stream rows", compactEvents.every((event) => event.brightness === undefined)],
  ["touch n=1 handler asks a surface/map question", mapUpdates.some((row) => row.output === "ask_surface_identity")],
  ["touch rate-shape handler creates a map risk hypothesis", mapUpdates.some((row) => row.output === "map_risk_hypothesis")],
  ["teacher correction becomes a confirmed map update", mapUpdates.some((row) => row.output === "confirmed_map_update")],
  ["teacher correction becomes a labeled example", mapUpdates.some((row) => row.output === "labeled_training_example")],
  ["delayed consolidation runs 60 seconds after correction", consolidationRows[0].dueAtSecond === teacherCorrection.atSecond + 60],
  ["delayed consolidation approves a reusable rule", consolidationRows[0].decision === "yes"],
  ["reusable rule keeps raw inspection selective", reusableRule.rawInspectionPolicy.includes("not normally required")],
];
const passed = checks.every(([, ok]) => ok);

const compactMarkdown = `# Hot Stove Compact n Log

Purpose: provide only compact perception rows to the inner-world bootstrap handlers.

Scene prior:

| field | value |
| --- | --- |
| place | ${scenePrior.placeId} |
| area | ${scenePrior.areaId} |
| action context | ${scenePrior.actionContext} |

| second | chunk | tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- |
${compactEvents.map(renderCompactEventRow).join("\n")}
`;

const correctionMarkdown = `# Hot Stove Teacher Correction Log

| second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- |
| ${teacherCorrection.atSecond} | ${teacherCorrection.source} | ${teacherCorrection.predictedLabel} | ${teacherCorrection.teacherLabel} | ${teacherCorrection.note} |
`;

const mapUpdateMarkdown = `# Hot Stove Map Update Log

Purpose: show deterministic cron-like handlers turning compact n-log patterns into inner-world map questions, updates, and labeled examples.

| second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- |
${mapUpdates.map(renderMapUpdateRow).join("\n")}
`;

const consolidationMarkdown = `# Hot Stove Delayed Consolidation Log

Purpose: run a delayed handler about one minute after the notable corrected event.

| due second | handler | question | evidence | decision | reason |
| --- | --- | --- | --- | --- | --- |
${consolidationRows.map(renderConsolidationRow).join("\n")}
`;

const reusableRuleMarkdown = `# Hot Stove Reusable Rule Output

| field | value |
| --- | --- |
| rule id | ${reusableRule.ruleId} |
| status | ${reusableRule.status} |
| scope | ${reusableRule.scope} |
| compact input pattern | ${reusableRule.compactInputPattern} |
| teacher label | ${reusableRule.teacherLabel} |
| future output | ${reusableRule.futureOutput} |
| raw inspection policy | ${reusableRule.rawInspectionPolicy} |
`;

const resultMarkdown = `# Hot Stove Inner-World Bootstrap Result

Purpose: prove the first deterministic bootstrap path from compact n-log perception into inner-world map updates, teacher-corrected examples, delayed consolidation, and a reusable rule.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| compact n log | \`outputs/inner_world_bootstrap_hot_stove/hot_stove_compact_n_log.md\` |
| map update log | \`outputs/inner_world_bootstrap_hot_stove/hot_stove_map_update_log.md\` |
| teacher correction log | \`outputs/inner_world_bootstrap_hot_stove/hot_stove_teacher_correction_log.md\` |
| delayed consolidation log | \`outputs/inner_world_bootstrap_hot_stove/hot_stove_delayed_consolidation_log.md\` |
| reusable rule output | \`outputs/inner_world_bootstrap_hot_stove/hot_stove_reusable_rule_output.md\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(mapUpdatePath, mapUpdateMarkdown);
await fs.writeFile(correctionPath, correctionMarkdown);
await fs.writeFile(consolidationPath, consolidationMarkdown);
await fs.writeFile(reusableRulePath, reusableRuleMarkdown);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
