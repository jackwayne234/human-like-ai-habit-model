import fs from "node:fs/promises";
import path from "node:path";

const CONTROL_ID = "adaptive_low_clearance_crossing_routine_v1";
const ACTIVE_CONTROL_BUDGET = 12;
const outputDir = path.resolve("outputs/learned_control_review_2_5d");
const controlsPath = path.resolve("learned_operation_controls.md");
const promotionResultPath = path.resolve("outputs/habit_promotion_2_5d_nursery/habit_promotion_2_5d_nursery_result.md");
const promotionReviewPath = path.resolve("outputs/habit_promotion_2_5d_nursery/promotion_review.md");

function extractControlBlock(text, controlId) {
  const heading = `### ${controlId}`;
  const start = text.indexOf(heading);
  if (start === -1) return "";
  const rest = text.slice(start + heading.length);
  const nextHeading = rest.search(/\n### /);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function fieldValue(block, field) {
  const match = block.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
}

function activeControlCount(text) {
  return [...text.matchAll(/^status:\s*active\s*$/gm)].length;
}

function hasLine(text, label, expected) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\|\\s*${escaped}\\s*\\|\\s*${expected}\\s*\\|`, "i").test(text);
}

function approveIf(checks) {
  return checks.every((check) => check.ok);
}

function renderChecks(checks) {
  return checks.map((check) => `| ${check.name} | ${check.ok ? "PASS" : "FAIL"} | ${check.evidence} |`).join("\n");
}

await fs.mkdir(outputDir, { recursive: true });

const [controlsText, promotionResult, promotionReview] = await Promise.all([
  fs.readFile(controlsPath, "utf8"),
  fs.readFile(promotionResultPath, "utf8"),
  fs.readFile(promotionReviewPath, "utf8"),
]);

const controlBlock = extractControlBlock(controlsText, CONTROL_ID);
const activeCount = activeControlCount(controlsText);
const status = fieldValue(controlBlock, "status");
const triggerConditions = fieldValue(controlBlock, "trigger_conditions");
const operation = fieldValue(controlBlock, "operation");
const confidence = fieldValue(controlBlock, "confidence");
const failureMonitor = fieldValue(controlBlock, "failure_monitor");
const rollbackOrReview = fieldValue(controlBlock, "rollback_or_review");

const successEvidence = /intended success cases passed\s*\|\s*3\/3/i.test(promotionResult);
const proposedEvidence = /Recommended control status:\s*`proposed`/i.test(promotionResult);
const usefulTriggerConditions =
  /overheadAhead/.test(triggerConditions) &&
  /probe_overhead_warning/.test(triggerConditions) &&
  /overhead_clearance/.test(triggerConditions) &&
  /vertical_echo/.test(triggerConditions);
const usefulOperation = operation === "probe_forward -> crouch_body -> step_forward";
const falseAlarmAvoided = /false alarm avoided\s*\|\s*yes/i.test(promotionResult);
const failureCaught = /too-low failure caught\s*\|\s*yes/i.test(promotionResult);
const hiddenTruthBoundary =
  hasLine(promotionResult, "robot-facing logs do not include hidden coordinates or feature objects", "PASS") &&
  hasLine(promotionResult, "hidden truth exists only in the evaluation log", "PASS");
const hasFailureMonitor =
  /overhead contact after crouch/.test(failureMonitor) &&
  /movement blocked after probe/.test(failureMonitor) &&
  /mismatch_needs_map_update/.test(failureMonitor);
const hasRollback = /pause the routine/.test(rollbackOrReview) && /explicit compact risk-memory decisions/.test(rollbackOrReview);
const budgetAvailable = activeCount < ACTIVE_CONTROL_BUDGET;

const builderChecks = [
  {
    name: "promotion evidence recommends a proposal",
    ok: proposedEvidence,
    evidence: "habit promotion result recommends proposed status before final review",
  },
  {
    name: "successful transfer evidence is sufficient",
    ok: successEvidence,
    evidence: "promotion variants report 3/3 intended success cases",
  },
  {
    name: "compact trigger conditions are useful",
    ok: usefulTriggerConditions,
    evidence: triggerConditions || "missing trigger_conditions",
  },
  {
    name: "operation is compact and inspectable",
    ok: usefulOperation,
    evidence: operation || "missing operation",
  },
  {
    name: "confidence is strong enough for active review",
    ok: confidence === "medium_high",
    evidence: confidence || "missing confidence",
  },
];

const criticChecks = [
  {
    name: "false alarm restraint is proven",
    ok: falseAlarmAvoided,
    evidence: "side-echo case avoids unnecessary crouch",
  },
  {
    name: "failure case is caught",
    ok: failureCaught,
    evidence: "too-low-even-crouched case is detected instead of treated as safe",
  },
  {
    name: "failure monitor is preserved",
    ok: hasFailureMonitor,
    evidence: failureMonitor || "missing failure_monitor",
  },
  {
    name: "rollback path is preserved",
    ok: hasRollback,
    evidence: rollbackOrReview || "missing rollback_or_review",
  },
  {
    name: "hidden truth boundary remains intact",
    ok: hiddenTruthBoundary,
    evidence: "promotion output keeps hidden truth in evaluation-only artifacts",
  },
  {
    name: "active control budget has room",
    ok: budgetAvailable,
    evidence: `${activeCount}/${ACTIVE_CONTROL_BUDGET} active controls after registry update`,
  },
];

const builderApproved = approveIf(builderChecks);
const criticApproved = approveIf(criticChecks);
const activationApproved = builderApproved && criticApproved;
const statusIsActive = status === "active";

const decisionRows = [
  {
    reviewer: "Builder / Dreamer",
    decision: builderApproved ? "approve" : "reject",
    reason: builderApproved
      ? "enough compact transfer evidence and a clear trigger-operation shape"
      : "proposal evidence is not yet strong or specific enough",
  },
  {
    reviewer: "Critic / Reality-Checker",
    decision: criticApproved ? "approve" : "reject",
    reason: criticApproved
      ? "false alarms, failures, rollback, budget, and hidden-truth boundary are covered"
      : "risk controls or boundary evidence are insufficient",
  },
  {
    reviewer: "Registry",
    decision: activationApproved && statusIsActive ? "active" : "not active",
    reason: activationApproved
      ? `review passed; learned_operation_controls.md status is ${status}`
      : "review did not pass, so activation must not happen",
  },
];

const checks = [
  ["Builder / Dreamer approves", builderApproved],
  ["Critic / Reality-Checker approves", criticApproved],
  ["both reviewers approve activation", activationApproved],
  ["registry marks the control active after approval", statusIsActive],
  ["active learned controls remain below budget", budgetAvailable],
];
const passed = checks.every(([, ok]) => ok);

const decisionLog = `# Learned Control Review 2.5D Decision Log

Control under review: \`${CONTROL_ID}\`

| reviewer | decision | reason |
| --- | --- | --- |
${decisionRows.map((row) => `| ${row.reviewer} | ${row.decision} | ${row.reason} |`).join("\n")}

## Builder / Dreamer Checks

| check | result | evidence |
| --- | --- | --- |
${renderChecks(builderChecks)}

## Critic / Reality-Checker Checks

| check | result | evidence |
| --- | --- | --- |
${renderChecks(criticChecks)}
`;

const resultMarkdown = `# Learned Control Review 2.5D Result

Purpose: decide whether \`${CONTROL_ID}\` can move from proposed to active before deeper 3D or API-model work.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | value |
| --- | --- |
| Builder / Dreamer approval | ${builderApproved ? "yes" : "no"} |
| Critic / Reality-Checker approval | ${criticApproved ? "yes" : "no"} |
| activation approved | ${activationApproved ? "yes" : "no"} |
| registry status | ${status || "missing"} |
| active controls after review | ${activeCount}/${ACTIVE_CONTROL_BUDGET} |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| decision log | \`outputs/learned_control_review_2_5d/decision_log.md\` |
| result report | \`outputs/learned_control_review_2_5d/learned_control_review_2_5d_result.md\` |
`;

await fs.writeFile(path.join(outputDir, "decision_log.md"), decisionLog);
await fs.writeFile(path.join(outputDir, "learned_control_review_2_5d_result.md"), resultMarkdown);

console.log(resultMarkdown);
