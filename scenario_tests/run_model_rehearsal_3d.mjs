import fs from "node:fs/promises";
import path from "node:path";
import { createEmbodied3DAgentTools } from "../digital_world/embodied_3d_agent_tools.mjs";
import { createPhysics3DNurseryWorld } from "../digital_world/physics_3d_nursery_world.mjs";

const outputDir = path.resolve("outputs/model_rehearsal_3d");

function robotFacingTextHasTruthLeak(text) {
  return /\b(true x|true y|true z|baseZ|topZ|coord|coordinate|position|room\.|lowCeilingZone|stepBlock|dropGap|hangingBar)\b/i.test(text);
}

function beliefFor({ action, compactSummary, riskMemory }) {
  if (compactSummary.includes("overhead_clearance") || compactSummary.includes("vertical_echo")) {
    return "upper_body_space: possible_compact_clearance_constraint";
  }
  if (compactSummary.includes("foot_step_warning")) return "floor_support: possible_raised_support";
  if (compactSummary.includes("foot_drop_warning")) return "floor_support: possible_lower_support";
  if (compactSummary.includes("base_height_shift")) return "self_body: vertical_body_height_changed";
  if (action === "step_up") return "self_body: lifted base for compact raised-support evidence";
  if (action === "step_down") return "self_body: lowered base for compact lower-support evidence";
  if (riskMemory !== "none") return "local_3d_passage: compact risk memory is being tested";
  return "local_3d_passage: compact evidence supports one more small sample";
}

function renderTranscript(row) {
  return `| ${[
    row.tick,
    row.compactInput,
    row.riskMemory,
    row.modelDecision,
    row.reason,
    row.toolResult,
    row.mapBelief,
  ].join(" | ")} |`;
}

function renderAudit(row) {
  return `| ${[row.tick, row.tool, row.result, row.detail].join(" | ")} |`;
}

function renderMap(row) {
  return `| ${[row.tick, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`;
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

async function runRehearsal() {
  const world = createPhysics3DNurseryWorld();
  const tools = createEmbodied3DAgentTools({ world, runId: "model_rehearsal_3d" });
  const transcript = [];
  const hiddenFrames = [];

  tools.requestRawDetail("bootstrap model rehearsal asks whether exact 3d geometry is available");

  for (let turn = 1; turn <= 16; turn += 1) {
    const compact = tools.readCompactSensors3D();
    const memory = tools.readRiskMemory3D();
    const choice = tools.suggestActionFromRiskMemory3D();
    tools.predictAction3D(choice.action, choice.reason);
    const result = tools.chooseAction3D(choice.action, choice.reason);
    const afterCompact = tools.readCompactSensors3D();
    const mapBelief = beliefFor({
      action: choice.action,
      compactSummary: afterCompact.compactSummary,
      riskMemory: memory.activeMemoryText,
    });
    tools.writeMapBelief3D({
      belief: mapBelief,
      confidence: afterCompact.compactRows.length ? "medium" : "low",
      evidence: afterCompact.compactSummary,
      nextPrediction: result.receipt.comparison,
    });

    transcript.push({
      tick: result.receipt.tick,
      compactInput: compact.compactSummary,
      riskMemory: memory.activeMemoryText,
      modelDecision: choice.action,
      reason: choice.reason,
      toolResult: result.receipt.comparison,
      mapBelief,
    });
    hiddenFrames.push({
      tick: result.receipt.tick,
      action: choice.action,
      snapshot: world.snapshot(),
    });
  }

  return {
    transcript,
    hiddenFrames,
    agentLog: tools.exportAgentLog(),
  };
}

await fs.mkdir(outputDir, { recursive: true });

const run = await runRehearsal();
const { transcript, hiddenFrames, agentLog } = run;

const promptMarkdown = `# Model Rehearsal 3D Compact Prompt

You are the temporary deterministic stand-in for a future model in the true 3D embodied nursery.

Rules:

- Use only the compact 3D tool surface.
- Do not ask for hidden simulator state.
- Treat denied raw detail as normal.
- Make one compact prediction before each body action.
- Prefer probe, crouch, step_up, step_down, pause, or small forward movement when compact 3D risk memory asks for caution.
- Write compact body/world beliefs after actions.
- Never rely on hidden coordinates, vertical truth, room geometry, or simulator feature objects.
`;

const transcriptMarkdown = `# Model Rehearsal 3D Decision Transcript

This is a deterministic rehearsal transcript for a future AI model. Each decision is based on compact 3D tool returns, not hidden simulator truth.

| tick | compact input | risk memory | model decision | reason | tool result | map belief |
| --- | --- | --- | --- | --- | --- | --- |
${transcript.map(renderTranscript).join("\n")}
`;

const auditMarkdown = `# Model Rehearsal 3D Tool Audit

| tick | tool | result | detail |
| --- | --- | --- | --- |
${agentLog.toolAuditLog.map(renderAudit).join("\n")}
`;

const mapMarkdown = `# Model Rehearsal 3D Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
${agentLog.mapBeliefs.map(renderMap).join("\n")}
`;

const rawMarkdown = `# Model Rehearsal 3D Raw Detail Requests

| tick | reason | decision | explanation |
| --- | --- | --- | --- |
${agentLog.rawRequests.map((row) => `| ${[row.tick, row.reason, row.decision, row.explanation].join(" | ")} |`).join("\n")}
`;

const hiddenTruthMarkdown = `# Model Rehearsal 3D Hidden Truth Log

Human evaluation only. The rehearsal prompt, transcript, tool audit, map beliefs, and raw-detail log do not read this file.

| tick | action | true x | true y | true base z | true top z | posture | movement result | blocker | terrain | overhead contact | step warning | drop warning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${hiddenFrames.map(renderTruth).join("\n")}
`;

const robotFacingText = [promptMarkdown, transcriptMarkdown, auditMarkdown, mapMarkdown, rawMarkdown].join("\n");
const noTruthLeaks = !robotFacingTextHasTruthLeak(robotFacingText);
const metrics = {
  transcriptTurns: transcript.length,
  predictions: agentLog.predictions.length,
  actions: agentLog.actions.length,
  mapBeliefs: agentLog.mapBeliefs.length,
  rawDetailDenials: agentLog.rawRequests.filter((row) => row.decision === "denied").length,
  crouchActions: hiddenFrames.filter((frame) => frame.action === "crouch_body").length,
  stepUpActions: hiddenFrames.filter((frame) => frame.action === "step_up").length,
  stepDownActions: hiddenFrames.filter((frame) => frame.action === "step_down").length,
  overheadStepContacts: hiddenFrames.filter(
    (frame) => frame.action === "step_forward" && frame.snapshot.lastInteraction.overheadContact
  ).length,
  unhandledStepBlocks: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.movementResult === "step_height_blocked").length,
  unhandledDropWarnings: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.movementResult === "drop_warning").length,
  predictionMismatches: agentLog.actions.filter((row) => row.comparison !== "matched_or_explained").length,
};

const checks = [
  ["prompt and transcript stay compact 3D only", noTruthLeaks],
  ["raw 3D detail request is denied", metrics.rawDetailDenials >= 1],
  ["every action has a prediction", metrics.predictions === metrics.actions],
  ["every turn writes a compact map belief", metrics.mapBeliefs === metrics.transcriptTurns],
  ["rehearsal completes the expected turn count", metrics.transcriptTurns === 16],
  ["rehearsal crouches for compact upper-volume risk", metrics.crouchActions >= 1],
  ["rehearsal uses step_up for compact raised support", metrics.stepUpActions >= 1],
  ["rehearsal uses step_down for compact lower support", metrics.stepDownActions >= 1],
  ["hidden evaluator sees zero overhead step contacts", metrics.overheadStepContacts === 0],
  ["hidden evaluator sees zero unhandled raised-step blocks", metrics.unhandledStepBlocks === 0],
  ["hidden evaluator sees zero unhandled drop warnings", metrics.unhandledDropWarnings === 0],
  ["predictions all match or are explained", metrics.predictionMismatches === 0],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Model Rehearsal 3D Result

Purpose: rehearse a future AI-in-the-loop session in the true 3D nursery without external API integration, using only \`embodied_3d_agent_tools.mjs\` tool calls and compact decision context.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | value |
| --- | --- |
| transcript turns | ${metrics.transcriptTurns} |
| predictions recorded | ${metrics.predictions} |
| body actions executed | ${metrics.actions} |
| compact map beliefs written | ${metrics.mapBeliefs} |
| raw detail denials | ${metrics.rawDetailDenials} |
| crouch actions | ${metrics.crouchActions} |
| step_up actions | ${metrics.stepUpActions} |
| step_down actions | ${metrics.stepDownActions} |
| overhead step contacts in hidden evaluator | ${metrics.overheadStepContacts} |
| unhandled raised-step blocks in hidden evaluator | ${metrics.unhandledStepBlocks} |
| unhandled drop warnings in hidden evaluator | ${metrics.unhandledDropWarnings} |
| prediction mismatches | ${metrics.predictionMismatches} |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| compact prompt | \`outputs/model_rehearsal_3d/compact_prompt.md\` |
| decision transcript | \`outputs/model_rehearsal_3d/decision_transcript.md\` |
| tool audit | \`outputs/model_rehearsal_3d/tool_audit.md\` |
| map beliefs | \`outputs/model_rehearsal_3d/map_beliefs.md\` |
| raw detail requests | \`outputs/model_rehearsal_3d/raw_detail_requests.md\` |
| hidden truth log | \`outputs/model_rehearsal_3d/hidden_truth_log.md\` |
| result report | \`outputs/model_rehearsal_3d/model_rehearsal_3d_result.md\` |
`;

await fs.writeFile(path.join(outputDir, "compact_prompt.md"), promptMarkdown);
await fs.writeFile(path.join(outputDir, "decision_transcript.md"), transcriptMarkdown);
await fs.writeFile(path.join(outputDir, "tool_audit.md"), auditMarkdown);
await fs.writeFile(path.join(outputDir, "map_beliefs.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "raw_detail_requests.md"), rawMarkdown);
await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), hiddenTruthMarkdown);
await fs.writeFile(path.join(outputDir, "model_rehearsal_3d_result.md"), resultMarkdown);

console.log(resultMarkdown);
