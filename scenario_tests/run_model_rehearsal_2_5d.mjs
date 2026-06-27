import fs from "node:fs/promises";
import path from "node:path";
import { createEmbodiedAgentTools } from "../digital_world/embodied_agent_tools.mjs";
import { createPhysics25DNurseryWorld } from "../digital_world/physics_2_5d_nursery_world.mjs";

const outputDir = path.resolve("outputs/model_rehearsal_2_5d");
const learnedControlsPath = path.resolve("learned_operation_controls.md");
const learnedControlId = "adaptive_low_clearance_crossing_routine_v1";
const rehearsalRoom = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  rampZone: { id: "ramp", x1: 4.4, y1: 7.05, x2: 5.4, y2: 8.1 },
  ledgeZone: { id: "ledge_drop", x1: 4.4, y1: 5.45, x2: 5.4, y2: 6.2 },
  lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 2.05, x2: 5.4, y2: 3.25 },
  raisedPad: { id: "raised_pressure_pad", x1: 4.4, y1: 4.0, x2: 5.4, y2: 4.75 },
};

function extractControlBlock(text, controlId) {
  const heading = `### ${controlId}`;
  const start = text.indexOf(heading);
  if (start === -1) return "";
  const rest = text.slice(start + heading.length);
  const nextHeading = rest.search(/\n### /);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

async function readActiveLearnedControlIds() {
  const controlsText = await fs.readFile(learnedControlsPath, "utf8");
  const block = extractControlBlock(controlsText, learnedControlId);
  return /^status:\s*active\s*$/m.test(block) ? [learnedControlId] : [];
}

function robotFacingTextHasTruthLeak(text) {
  return /\b(x|y|coord|coordinate|position|true_position|room\.|rampZone|ledgeZone|lowTunnel|raisedPad)\b/i.test(text);
}

function compactPolicy({ compact, memory, queuedAction, learnedControlAlreadyRequested }) {
  if (queuedAction) {
    return {
      action: queuedAction.action,
      reason: "continue queued active learned operation",
      mapBelief: "active routine is being tested from compact tool receipts",
      confidence: "medium",
    };
  }

  if (memory.activeRiskMemory.overheadAhead && !learnedControlAlreadyRequested) {
    return {
      action: "use_control",
      controlId: learnedControlId,
      reason: "compact overhead risk memory matches the active low-clearance routine trigger",
      mapBelief: "near body path may require lower posture before forward commitment",
      confidence: "medium",
    };
  }

  if (memory.activeRiskMemory.overheadAhead) {
    return {
      action: "probe_forward",
      reason: "compact overhead risk remains active after routine request",
      mapBelief: "forward clearance still needs compact confirmation",
      confidence: "medium",
    };
  }

  if (memory.activeRiskMemory.dropAhead) {
    return {
      action: "probe_forward",
      reason: "compact foot-support warning asks for a probe before body commitment",
      mapBelief: "forward floor support may be uncertain",
      confidence: "medium",
    };
  }

  if (memory.activeRiskMemory.rampLoadAhead) {
    return {
      action: "recenter_body",
      reason: "compact load and pitch memory asks the body to settle",
      mapBelief: "height-load transition may be affecting posture",
      confidence: "medium",
    };
  }

  if (memory.activeRiskMemory.raisedSurfaceAhead) {
    return {
      action: "pause",
      reason: "compact raised-surface pressure asks for a separating pause",
      mapBelief: "base pressure may be from a raised surface, not a wall",
      confidence: "medium",
    };
  }

  return {
    action: "step_forward",
    reason:
      compact.compactRows.length === 0
        ? "compact stream is quiet and no risk memory asks for a safer action"
        : "compact stream has evidence but no active stop, probe, duck, or settle request",
    mapBelief: "local path is open enough to sample with a normal forward action",
    confidence: compact.compactRows.length === 0 ? "low" : "medium",
  };
}

function renderTranscriptRow(row) {
  return `| ${[
    row.tick,
    row.compactSummary,
    row.riskMemory,
    row.decision,
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
    frame.snapshot.posture,
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.overheadContact ? "yes" : "no",
    interaction.footDropWarning ? "yes" : "no",
  ].join(" | ")} |`;
}

async function runRehearsal() {
  const activeControlIds = await readActiveLearnedControlIds();
  const world = createPhysics25DNurseryWorld({
    room: rehearsalRoom,
    initialState: { x: 4.9, y: 0.85, facing: "south" },
  });
  const tools = createEmbodiedAgentTools({
    world,
    runId: "model_rehearsal_2_5d",
    activeControlIds,
  });
  const transcript = [];
  const hiddenFrames = [];
  let learnedControlAlreadyRequested = false;

  tools.requestRawDetail("bootstrap rehearsal asks whether exact geometry is available");

  for (let turn = 1; turn <= 14; turn += 1) {
    const queuedAction = tools.takeQueuedLearnedControlAction();
    const compact = tools.readCompactSensors();
    const memory = tools.readRiskMemory();
    const decision = compactPolicy({
      compact,
      memory,
      queuedAction,
      learnedControlAlreadyRequested,
    });

    let action = decision.action;
    let toolResult = "";

    if (decision.action === "use_control") {
      const controlResult = tools.useLearnedControl(decision.controlId, decision.reason);
      learnedControlAlreadyRequested = controlResult.ok;
      const queued = tools.takeQueuedLearnedControlAction();
      action = queued?.action ?? "pause";
      toolResult = controlResult.ok
        ? `control queued; first queued action ${action}`
        : `control denied; fallback action ${action}`;
    }

    tools.predictAction(action, decision.reason);
    const actionResult = tools.chooseAction(action, decision.reason);
    const afterCompact = tools.readCompactSensors();
    tools.writeMapBelief({
      belief: decision.mapBelief,
      confidence: decision.confidence,
      evidence: afterCompact.compactSummary,
      nextPrediction: actionResult.receipt.comparison,
    });

    transcript.push({
      tick: actionResult.receipt.tick,
      compactSummary: compact.compactSummary,
      riskMemory: memory.activeMemoryText,
      decision: action,
      reason: decision.reason,
      toolResult: toolResult || actionResult.receipt.comparison,
      mapBelief: decision.mapBelief,
    });
    hiddenFrames.push({
      tick: actionResult.receipt.tick,
      action,
      snapshot: world.snapshot(),
    });
  }

  return {
    activeControlIds,
    transcript,
    hiddenFrames,
    agentLog: tools.exportAgentLog(),
  };
}

await fs.mkdir(outputDir, { recursive: true });
const run = await runRehearsal();
const { transcript, hiddenFrames, agentLog, activeControlIds } = run;

const metrics = {
  transcriptTurns: transcript.length,
  rawDetailDenials: agentLog.rawRequests.filter((row) => row.decision === "denied").length,
  activeControlAvailable: activeControlIds.includes(learnedControlId),
  activeControlUsed: agentLog.toolAuditLog.some((row) => row.tool === "useLearnedControl" && row.result === "ok"),
  predictions: agentLog.predictions.length,
  actions: agentLog.actions.length,
  mapBeliefs: agentLog.mapBeliefs.length,
  overheadStepContacts: hiddenFrames.filter(
    (frame) => frame.action === "step_forward" && frame.snapshot.lastInteraction.overheadContact
  ).length,
};

const promptMarkdown = `# Model Rehearsal 2.5D Compact Prompt

You are the temporary deterministic stand-in for a future model in the embodied nursery.

Rules:

- Use only the compact tool surface.
- Do not ask for hidden simulator state.
- Make one small prediction before each body action.
- Prefer probe, pause, crouch, or recenter actions when compact risk memory asks for caution.
- Use active learned operation controls only through \`useLearnedControl(control_id)\`.
- Write compact body/world beliefs after actions.
- Treat denied raw detail as normal; keep operating from compact logs.
`;

const transcriptMarkdown = `# Model Rehearsal 2.5D Decision Transcript

This is a deterministic rehearsal transcript for a future AI model. Each decision is based on compact tool returns, not hidden simulator truth.

| tick | compact input summary | risk memory | decision | reason | tool result | map belief |
| --- | --- | --- | --- | --- | --- | --- |
${transcript.map(renderTranscriptRow).join("\n")}
`;

const auditMarkdown = `# Model Rehearsal 2.5D Tool Audit

| tick | tool | result | detail |
| --- | --- | --- | --- |
${agentLog.toolAuditLog.map(renderAudit).join("\n")}
`;

const mapMarkdown = `# Model Rehearsal 2.5D Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
${agentLog.mapBeliefs.map(renderMap).join("\n")}
`;

const rawMarkdown = `# Model Rehearsal 2.5D Raw Detail Requests

| tick | reason | decision | explanation |
| --- | --- | --- | --- |
${agentLog.rawRequests.map((row) => `| ${[row.tick, row.reason, row.decision, row.explanation].join(" | ")} |`).join("\n")}
`;

const hiddenTruthMarkdown = `# Model Rehearsal 2.5D Hidden Truth Log

Human evaluation only. The rehearsal policy and transcript do not read this file.

| tick | action | true x | true y | true posture | true movement result | true blocker | true terrain | overhead contact | foot drop |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${hiddenFrames.map(renderTruth).join("\n")}
`;

const robotFacingText = [promptMarkdown, transcriptMarkdown, auditMarkdown, mapMarkdown, rawMarkdown].join("\n");
const noTruthLeaks = !robotFacingTextHasTruthLeak(robotFacingText);
const checks = [
  ["prompt and transcript stay compact-only", noTruthLeaks],
  ["raw detail request is denied", metrics.rawDetailDenials >= 1],
  ["active learned control is available from registry", metrics.activeControlAvailable],
  ["active learned control is used through the tool boundary", metrics.activeControlUsed],
  ["every action has a prediction", metrics.predictions === metrics.actions],
  ["every turn writes a compact map belief", metrics.mapBeliefs === metrics.transcriptTurns],
  ["rehearsal completes the expected turn count", metrics.transcriptTurns === 14],
  ["hidden evaluator sees zero overhead step contacts", metrics.overheadStepContacts === 0],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Model Rehearsal 2.5D Result

Purpose: rehearse a future AI-in-the-loop nursery session without external API integration, using only \`embodied_agent_tools.mjs\` tool calls and compact decision context.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | value |
| --- | --- |
| transcript turns | ${metrics.transcriptTurns} |
| predictions recorded | ${metrics.predictions} |
| body actions executed | ${metrics.actions} |
| compact map beliefs written | ${metrics.mapBeliefs} |
| raw detail denials | ${metrics.rawDetailDenials} |
| active learned control available | ${metrics.activeControlAvailable ? "yes" : "no"} |
| active learned control used through tools | ${metrics.activeControlUsed ? "yes" : "no"} |
| overhead step contacts in hidden evaluator | ${metrics.overheadStepContacts} |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| compact prompt | \`outputs/model_rehearsal_2_5d/compact_prompt.md\` |
| decision transcript | \`outputs/model_rehearsal_2_5d/decision_transcript.md\` |
| tool audit | \`outputs/model_rehearsal_2_5d/tool_audit.md\` |
| map beliefs | \`outputs/model_rehearsal_2_5d/map_beliefs.md\` |
| raw detail requests | \`outputs/model_rehearsal_2_5d/raw_detail_requests.md\` |
| hidden truth log | \`outputs/model_rehearsal_2_5d/hidden_truth_log.md\` |
| result report | \`outputs/model_rehearsal_2_5d/model_rehearsal_2_5d_result.md\` |
`;

await fs.writeFile(path.join(outputDir, "compact_prompt.md"), promptMarkdown);
await fs.writeFile(path.join(outputDir, "decision_transcript.md"), transcriptMarkdown);
await fs.writeFile(path.join(outputDir, "tool_audit.md"), auditMarkdown);
await fs.writeFile(path.join(outputDir, "map_beliefs.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "raw_detail_requests.md"), rawMarkdown);
await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), hiddenTruthMarkdown);
await fs.writeFile(path.join(outputDir, "model_rehearsal_2_5d_result.md"), resultMarkdown);

console.log(resultMarkdown);
