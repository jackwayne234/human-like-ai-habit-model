import fs from "node:fs/promises";
import path from "node:path";
import { createEmbodiedAgentTools } from "../digital_world/embodied_agent_tools.mjs";
import { createPhysics25DNurseryWorld } from "../digital_world/physics_2_5d_nursery_world.mjs";

const outputDir = path.resolve("outputs/embodied_agent_tools");
const learnedControlsPath = path.resolve("learned_operation_controls.md");
const learnedControlId = "adaptive_low_clearance_crossing_routine_v1";
const toolRoom = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  rampZone: { id: "ramp", x1: 4.4, y1: 7.05, x2: 5.4, y2: 8.1 },
  ledgeZone: { id: "ledge_drop", x1: 4.4, y1: 5.45, x2: 5.4, y2: 6.2 },
  lowTunnel: { id: "low_tunnel", x1: 4.4, y1: 2.05, x2: 5.4, y2: 3.25 },
  raisedPad: { id: "raised_pressure_pad", x1: 4.4, y1: 4.0, x2: 5.4, y2: 4.75 },
};

function robotFacingTextHasCoordinateLeak(text) {
  return /\b(x|y|coord|coordinate|position|true_position|room\.|rampZone|ledgeZone|lowTunnel|raisedPad)\b/i.test(text);
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
    frame.snapshot.posture,
    interaction.movementResult,
    interaction.blockedBy || "none",
    interaction.terrain.join(", ") || "plain_floor",
    interaction.overheadContact ? "yes" : "no",
    interaction.footDropWarning ? "yes" : "no",
  ].join(" | ")} |`;
}

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

async function runToolBoundaryPass({ activeControlIds = [] } = {}) {
  const world = createPhysics25DNurseryWorld({ room: toolRoom, initialState: { x: 4.9, y: 0.85, facing: "south" } });
  const tools = createEmbodiedAgentTools({ world, runId: "tool_boundary", activeControlIds });
  const hiddenFrames = [];
  let activeControlResult = null;
  let requestedActiveControl = false;

  const deniedRaw = tools.requestRawDetail("check exact tunnel geometry before moving");

  for (let tick = 1; tick <= 14; tick += 1) {
    const queued = tools.takeQueuedLearnedControlAction();
    const choice = queued ?? tools.suggestActionFromRiskMemory();
    tools.readCompactSensors();
    tools.readRiskMemory();
    tools.predictAction(choice.action, choice.reason);
    const result = tools.chooseAction(choice.action, choice.reason);
    const sensors = tools.readCompactSensors();
    const memory = tools.readRiskMemory();
    if (memory.activeRiskMemory.overheadAhead) {
      if (!requestedActiveControl) {
        activeControlResult = tools.useLearnedControl(learnedControlId, "compact overhead risk memory matched active routine trigger");
        requestedActiveControl = true;
      }
      tools.writeMapBelief({
        belief: "near_body_height: possible_low_overhead_clearance",
        confidence: "medium",
        evidence: sensors.compactSummary,
        nextPrediction: "probe_forward then crouch_body should reduce upper-body contact risk",
      });
    }
    hiddenFrames.push({
      tick,
      action: choice.action,
      snapshot: world.snapshot(),
      receipt: result.receipt,
    });
  }

  return {
    tools,
    agentLog: tools.exportAgentLog(),
    hiddenFrames,
    deniedRaw,
    activeControlResult,
  };
}

await fs.mkdir(outputDir, { recursive: true });

const activeControlIds = await readActiveLearnedControlIds();
const run = await runToolBoundaryPass({ activeControlIds });
const agentLog = run.agentLog;
const actionRows = agentLog.actions;
const toolAuditRows = agentLog.toolAuditLog;
const riskRows = agentLog.riskMemory;
const mapRows = agentLog.mapBeliefs;
const rawRows = agentLog.rawRequests;
const hiddenFrames = run.hiddenFrames;
const activeControlAccepted = agentLog.toolAuditLog.some(
  (row) => row.tool === "useLearnedControl" && row.result === "ok"
);
const activeControlFromRegistry = activeControlIds.includes(learnedControlId);

const metrics = {
  overheadContacts: hiddenFrames.filter((frame) => frame.snapshot.lastInteraction.overheadContact && frame.action === "step_forward").length,
  probeWarnings: hiddenFrames.filter((frame) => frame.action === "probe_forward" && frame.snapshot.lastInteraction.movementResult.includes("warning")).length,
  crouchActions: hiddenFrames.filter((frame) => frame.action === "crouch_body").length,
  rawDenied: rawRows.filter((row) => row.decision === "denied").length,
  activeControlAccepted,
  activeControlFromRegistry,
  mapBeliefs: mapRows.length,
};

const agentActionMarkdown = `# Embodied Agent Tool Boundary Action Log

Agent-facing action receipts only. This log intentionally omits hidden simulator coordinates and room feature objects.

| tick | action | reason | compact summary | comparison | risk memory |
| --- | --- | --- | --- | --- | --- |
${actionRows.map(renderAction).join("\n")}
`;

const riskMemoryMarkdown = `# Embodied Agent Tool Boundary Risk Memory Log

| tick | action | before | compact evidence | after | outcome |
| --- | --- | --- | --- | --- | --- |
${riskRows.map(renderRisk).join("\n")}
`;

const mapMarkdown = `# Embodied Agent Tool Boundary Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
${mapRows.map((row) => `| ${[row.tick, row.belief, row.confidence, row.evidence, row.nextPrediction].join(" | ")} |`).join("\n")}
`;

const rawMarkdown = `# Embodied Agent Tool Boundary Raw Detail Requests

Raw detail is denied in this boundary test.

| tick | reason | decision | explanation |
| --- | --- | --- | --- |
${rawRows.map((row) => `| ${[row.tick, row.reason, row.decision, row.explanation].join(" | ")} |`).join("\n")}
`;

const auditMarkdown = `# Embodied Agent Tool Boundary Tool Audit Log

| tick | tool | result | detail |
| --- | --- | --- | --- |
${toolAuditRows.map(renderAudit).join("\n")}
`;

const hiddenTruthMarkdown = `# Embodied Agent Tool Boundary Hidden Truth Log

Human evaluation only. Agent-facing tools do not return this file's fields.

| tick | action | true x | true y | true posture | true movement result | true blocker | true terrain | overhead contact | foot drop |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${hiddenFrames.map(renderTruth).join("\n")}
`;

const robotFacingText = [agentActionMarkdown, riskMemoryMarkdown, mapMarkdown, rawMarkdown, auditMarkdown].join("\n");
const noCoordinateLeaks = !robotFacingTextHasCoordinateLeak(robotFacingText);
const checks = [
  ["agent-facing logs do not include hidden coordinates or feature objects", noCoordinateLeaks],
  ["raw detail request is denied", metrics.rawDenied >= 1],
  ["learned control is active in the registry", metrics.activeControlFromRegistry],
  ["active learned control queues its operation through the tool boundary", metrics.activeControlAccepted],
  ["tool-mediated run uses a probe before low-clearance commitment", metrics.probeWarnings >= 1],
  ["tool-mediated run crouches for low-clearance risk", metrics.crouchActions >= 1],
  ["tool-mediated run has zero overhead step contacts", metrics.overheadContacts === 0],
  ["tool-mediated run writes compact map beliefs", metrics.mapBeliefs > 0],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Embodied Agent Tool Boundary Result

Purpose: expose the 2.5D embodied nursery through model-ready tools before putting a real AI model in the world.

Verdict: ${passed ? "PASS" : "FAIL"}

| metric | value |
| --- | --- |
| overhead step contacts | ${metrics.overheadContacts} |
| probe warnings | ${metrics.probeWarnings} |
| crouch actions | ${metrics.crouchActions} |
| raw detail denials | ${metrics.rawDenied} |
| learned control active in registry | ${metrics.activeControlFromRegistry ? "yes" : "no"} |
| active learned control accepted from registry | ${metrics.activeControlAccepted ? "yes" : "no"} |
| compact map beliefs written | ${metrics.mapBeliefs} |

## Tool Surface

| tool | purpose |
| --- | --- |
| \`readCompactSensors()\` | Read compact rows and normalized compact-facing sensor values. |
| \`readRiskMemory()\` | Read active compact risk memory. |
| \`predictAction(action, reason)\` | Record an expected compact result before acting. |
| \`chooseAction(action, reason)\` | Execute one allowed body action and receive compact comparison. |
| \`writeMapBelief(...)\` | Store a compact-derived body/world belief. |
| \`useLearnedControl(control_id)\` | Queue a learned operation only when the registry marks it active. |
| \`requestRawDetail(reason)\` | Denied in this boundary test. |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Artifacts

| artifact | path |
| --- | --- |
| action log | \`outputs/embodied_agent_tools/action_log.md\` |
| risk memory log | \`outputs/embodied_agent_tools/risk_memory_log.md\` |
| map beliefs | \`outputs/embodied_agent_tools/map_beliefs.md\` |
| raw detail requests | \`outputs/embodied_agent_tools/raw_detail_requests.md\` |
| tool audit log | \`outputs/embodied_agent_tools/tool_audit_log.md\` |
| hidden truth log | \`outputs/embodied_agent_tools/hidden_truth_log.md\` |
`;

await fs.writeFile(path.join(outputDir, "action_log.md"), agentActionMarkdown);
await fs.writeFile(path.join(outputDir, "risk_memory_log.md"), riskMemoryMarkdown);
await fs.writeFile(path.join(outputDir, "map_beliefs.md"), mapMarkdown);
await fs.writeFile(path.join(outputDir, "raw_detail_requests.md"), rawMarkdown);
await fs.writeFile(path.join(outputDir, "tool_audit_log.md"), auditMarkdown);
await fs.writeFile(path.join(outputDir, "hidden_truth_log.md"), hiddenTruthMarkdown);
await fs.writeFile(path.join(outputDir, "embodied_agent_tools_result.md"), resultMarkdown);

console.log(resultMarkdown);
