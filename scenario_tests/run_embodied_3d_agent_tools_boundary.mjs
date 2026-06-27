import fs from "node:fs/promises";
import path from "node:path";
import { createEmbodied3DAgentTools } from "../digital_world/embodied_3d_agent_tools.mjs";
import { createPhysics3DNurseryWorld } from "../digital_world/physics_3d_nursery_world.mjs";

const outputDir = path.resolve("outputs/embodied_3d_agent_tools");

function robotFacingTextHasTruthLeak(text) {
  return /\b(true x|true y|true z|baseZ|topZ|coord|coordinate|position|room\.|lowCeilingZone|stepBlock|dropGap|hangingBar)\b/i.test(text);
}

function beliefFor({ action, compactSummary, fallback }) {
  if (compactSummary.includes("overhead_clearance") || compactSummary.includes("vertical_echo")) {
    return "upper_body_space: possible_compact_clearance_constraint";
  }
  if (compactSummary.includes("foot_step_warning")) return "floor_support: possible_raised_support";
  if (compactSummary.includes("foot_drop_warning")) return "floor_support: possible_lower_support";
  if (compactSummary.includes("base_height_shift")) return "self_body: vertical_body_height_changed";
  if (action === "step_up") return "self_body: lifted base for compact raised-support evidence";
  if (action === "step_down") return "self_body: lowered base for compact lower-support evidence";
  return fallback;
}

function renderAction(row) {
  return `| ${[
    row.tick,
    row.action,
    row.reason,
    row.compactSummary,
    row.comparison,
    row.riskMemory,
  ].join(" | ")} |`;
}

function renderAudit(row) {
  return `| ${[row.tick, row.tool, row.result, row.detail].join(" | ")} |`;
}

function renderRisk(row) {
  return `| ${[row.tick, row.action, row.before, row.compactEvidence, row.after, row.outcome].join(" | ")} |`;
}

function renderTruth(frame) {
  const interaction = frame.snapshot.lastInteraction;
  return `| ${[
    frame.tick,
    frame.action,
    frame.snapshot.x.toFixed(2),
    frame.snapshot.y.toFixed(2),
    frame.snapshot.baseZ.toFixed(2),
    frame.snapshot.topZ.toFixed(2),
    frame.snapshot.posture,
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.overheadContact ? "yes" : "no",
    interaction.footStepWarning ? "yes" : "no",
    interaction.footDropWarning ? "yes" : "no",
  ].join(" | ")} |`;
}

async function runToolBoundaryPass() {
  const world = createPhysics3DNurseryWorld();
  const tools = createEmbodied3DAgentTools({ world, runId: "embodied_3d_agent_tools" });
  const hiddenFrames = [];

  tools.requestRawDetail("check exact 3d shape before acting");

  for (let turn = 1; turn <= 16; turn += 1) {
    const compact = tools.readCompactSensors3D();
    const memory = tools.readRiskMemory3D();
    const choice = tools.suggestActionFromRiskMemory3D();
    tools.predictAction3D(choice.action, choice.reason);
    const result = tools.chooseAction3D(choice.action, choice.reason);
    const afterCompact = tools.readCompactSensors3D();
    tools.writeMapBelief3D({
      belief: beliefFor({
        action: choice.action,
        compactSummary: afterCompact.compactSummary,
        fallback: "local_3d_passage: compact evidence supports one more small sample",
      }),
      confidence: afterCompact.compactRows.length ? "medium" : "low",
      evidence: afterCompact.compactSummary,
      nextPrediction: result.receipt.comparison,
    });
    hiddenFrames.push({
      tick: result.receipt.tick,
      action: choice.action,
      compactBefore: compact.compactSummary,
      riskBefore: memory.activeMemoryText,
      snapshot: world.snapshot(),
    });
  }

  return {
    agentLog: tools.exportAgentLog(),
    hiddenFrames,
  };
}

await fs.mkdir(outputDir, { recursive: true });

const { agentLog, hiddenFrames } = await runToolBoundaryPass();
const actionRows = agentLog.actions;
const riskRows = agentLog.riskMemory;
const mapRows = agentLog.mapBeliefs;
const rawRows = agentLog.rawRequests;
const auditRows = agentLog.toolAuditLog;

const actionMarkdown = `# Embodied 3D Agent Tool Boundary Action Log

Agent-facing action receipts only. This log intentionally omits hidden coordinates, vertical truth, and room feature objects.

| tick | action | reason | compact summary | comparison | risk memory |
| --- | --- | --- | --- | --- | --- |
${actionRows.map(renderAction).join("\n")}
`;

const riskMarkdown = `# Embodied 3D Agent Tool Boundary Risk Memory Log

| tick | action | before | compact evidence | after | outcome |
| --- | --- | --- | --- | --- | --- |
${riskRows.map(renderRisk).join("\n")}
`;

const mapMarkdown = `# Embodied 3D Agent Tool Boundary Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
${mapRows.map((row) => `| ${[row.tick, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`).join("\n")}
`;

const rawMarkdown = `# Embodied 3D Agent Tool Boundary Raw Detail Requests

Raw 3D detail is denied in this boundary test.

| tick | reason | decision | explanation |
| --- | --- | --- | --- |
${rawRows.map((row) => `| ${[row.tick, row.reason, row.decision, row.explanation].join(" | ")} |`).join("\n")}
`;

const auditMarkdown = `# Embodied 3D Agent Tool Boundary Tool Audit Log

| tick | tool | result | detail |
| --- | --- | --- | --- |
${auditRows.map(renderAudit).join("\n")}
`;

const hiddenTruthMarkdown = `# Embodied 3D Agent Tool Boundary Hidden Truth Log

Human evaluation only. Agent-facing tools do not return this file's fields.

| tick | action | true x | true y | true base z | true top z | posture | movement result | blocker | terrain | overhead contact | step warning | drop warning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${hiddenFrames.map(renderTruth).join("\n")}
`;

const robotFacingText = [actionMarkdown, riskMarkdown, mapMarkdown, rawMarkdown, auditMarkdown].join("\n");
const noTruthLeaks = !robotFacingTextHasTruthLeak(robotFacingText);
const metrics = {
  actions: actionRows.length,
  predictions: agentLog.predictions.length,
  mapBeliefs: mapRows.length,
  rawDenied: rawRows.filter((row) => row.decision === "denied").length,
  crouchActions: hiddenFrames.filter((frame) => frame.action === "crouch_body").length,
  stepUpActions: hiddenFrames.filter((frame) => frame.action === "step_up").length,
  stepDownActions: hiddenFrames.filter((frame) => frame.action === "step_down").length,
  overheadStepContacts: hiddenFrames.filter(
    (frame) => frame.action === "step_forward" && frame.snapshot.lastInteraction.overheadContact
  ).length,
  unhandledStepBlocks: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.movementResult === "step_height_blocked").length,
  unhandledDropWarnings: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.movementResult === "drop_warning").length,
  predictionMismatches: actionRows.filter((row) => row.comparison !== "matched_or_explained").length,
};

const checks = [
  ["agent-facing logs do not include hidden coordinates, vertical truth, or feature objects", noTruthLeaks],
  ["raw 3D detail request is denied", metrics.rawDenied >= 1],
  ["every body action has a prediction", metrics.predictions === metrics.actions],
  ["every turn writes a compact map belief", metrics.mapBeliefs === metrics.actions],
  ["tool-mediated run crouches for compact upper-volume risk", metrics.crouchActions >= 1],
  ["tool-mediated run uses step_up for raised support", metrics.stepUpActions >= 1],
  ["tool-mediated run uses step_down for lower support", metrics.stepDownActions >= 1],
  ["hidden evaluator sees zero overhead step contacts", metrics.overheadStepContacts === 0],
  ["hidden evaluator sees zero unhandled raised-step blocks", metrics.unhandledStepBlocks === 0],
  ["hidden evaluator sees zero unhandled drop warnings", metrics.unhandledDropWarnings === 0],
  ["predictions all match or are explained", metrics.predictionMismatches === 0],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Embodied 3D Agent Tool Boundary Result

Purpose: expose the first true 3D embodied nursery through model-ready tools while preserving compact-only perception.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | value |
| --- | --- |
| body actions executed | ${metrics.actions} |
| predictions recorded | ${metrics.predictions} |
| compact map beliefs written | ${metrics.mapBeliefs} |
| raw detail denials | ${metrics.rawDenied} |
| crouch actions | ${metrics.crouchActions} |
| step_up actions | ${metrics.stepUpActions} |
| step_down actions | ${metrics.stepDownActions} |
| overhead step contacts in hidden evaluator | ${metrics.overheadStepContacts} |
| unhandled raised-step blocks in hidden evaluator | ${metrics.unhandledStepBlocks} |
| unhandled drop warnings in hidden evaluator | ${metrics.unhandledDropWarnings} |
| prediction mismatches | ${metrics.predictionMismatches} |

## Tool Surface

| tool | purpose |
| --- | --- |
| \`readCompactSensors3D()\` | Read compact 3D rows and normalized compact-facing sensor values. |
| \`readRiskMemory3D()\` | Read active compact 3D risk memory. |
| \`predictAction3D(action, reason)\` | Record an expected compact result before acting. |
| \`chooseAction3D(action, reason)\` | Execute one allowed body action and receive compact comparison. |
| \`writeMapBelief3D(...)\` | Store a compact-derived 3D body/world belief. |
| \`requestRawDetail(reason)\` | Denied in this boundary test. |
| \`suggestActionFromRiskMemory3D()\` | Transparent deterministic chooser using compact 3D risk memory. |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| action log | \`outputs/embodied_3d_agent_tools/action_log.md\` |
| risk memory log | \`outputs/embodied_3d_agent_tools/risk_memory_log.md\` |
| map beliefs | \`outputs/embodied_3d_agent_tools/map_beliefs.md\` |
| raw detail requests | \`outputs/embodied_3d_agent_tools/raw_detail_requests.md\` |
| tool audit log | \`outputs/embodied_3d_agent_tools/tool_audit_log.md\` |
| hidden truth log | \`outputs/embodied_3d_agent_tools/hidden_truth_log.md\` |
`;

await fs.writeFile(path.join(outputDir, "action_log.md"), actionMarkdown);
await fs.writeFile(path.join(outputDir, "risk_memory_log.md"), riskMarkdown);
await fs.writeFile(path.join(outputDir, "map_beliefs.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "raw_detail_requests.md"), rawMarkdown);
await fs.writeFile(path.join(outputDir, "tool_audit_log.md"), auditMarkdown);
await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), hiddenTruthMarkdown);
await fs.writeFile(path.join(outputDir, "embodied_3d_agent_tools_result.md"), resultMarkdown);

console.log(resultMarkdown);
