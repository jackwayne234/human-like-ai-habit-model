import { buildCompactRows25D, readNursery25DSensors } from "./physics_2_5d_nursery_sensors.mjs";
import { createPhysics25DRiskMemoryChooser } from "./physics_2_5d_risk_memory_chooser.mjs";

const ALLOWED_ACTIONS = new Set([
  "step_forward",
  "probe_forward",
  "crouch_body",
  "stand_body",
  "recenter_body",
  "pause",
  "turn_left",
  "turn_right",
]);

const LEARNED_CONTROL_OPERATIONS = {
  adaptive_low_clearance_crossing_routine_v1: ["probe_forward", "crouch_body", "step_forward"],
};

function compactSummary(rows) {
  if (rows.length === 0) return "compact stream quiet";
  return rows
    .slice(0, 5)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function riskText(memory) {
  return Object.entries(memory)
    .filter(([, active]) => active)
    .map(([key]) => key)
    .join(", ") || "none";
}

function expectationFor(action, riskMemory = {}) {
  if (action === "probe_forward") return "probe should test compact forward risk before body commitment";
  if (action === "crouch_body") return "body height should lower before testing overhead clearance";
  if (action === "recenter_body") return "pitch/load pressure should settle before more movement";
  if (action === "pause") return "pressure should settle without adding new contact";
  if (action === "stand_body") return "body should return to standing posture after clearance risk";
  if (riskMemory.overheadAhead || riskMemory.dropAhead || riskMemory.rampLoadAhead || riskMemory.raisedSurfaceAhead) {
    return "forward movement may carry compact risk already held in risk memory";
  }
  return "movement should gather compact evidence without known active risk";
}

function comparePrediction({ prediction, compactRows, sensors }) {
  if (!prediction) return "no_prediction_recorded";
  if (prediction.action === "probe_forward") {
    return sensors.movement_result >= 0.65 || compactRows.length === 0 ? "matched_or_explained" : "mismatch_needs_map_update";
  }
  if (prediction.action === "crouch_body") {
    return sensors.overhead_clearance < 0.75 ? "matched_or_explained" : "mismatch_needs_map_update";
  }
  if (["pause", "recenter_body", "stand_body"].includes(prediction.action)) return "matched_or_explained";
  if (prediction.expectedCompactResult.includes("may carry")) {
    return sensors.movement_result >= 0.18 ? "matched_or_explained" : "mismatch_needs_map_update";
  }
  return sensors.movement_result < 0.65 && !compactRows.some((row) => row.stream.includes("overhead_clearance"))
    ? "matched_or_explained"
    : "mismatch_needs_map_update";
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

export function createEmbodiedAgentTools({ world, runId = "agent_tool_run", activeControlIds = [] }) {
  const riskChooser = createPhysics25DRiskMemoryChooser();
  const activeControls = new Set(activeControlIds);
  const state = {
    tick: 0,
    olderSensors: null,
    previousSensors: null,
    currentSensors: null,
    currentCompactRows: [],
    predictions: [],
    comparisons: [],
    actionReceipts: [],
    mapBeliefs: [],
    toolAuditLog: [],
    rawRequests: [],
    learnedControlQueue: [],
  };

  function ensureCurrentSensors() {
    if (!state.currentSensors) {
      const snapshot = world.snapshot();
      state.currentSensors = readNursery25DSensors(snapshot);
      state.currentCompactRows = [];
    }
  }

  function audit(tool, result, detail = "") {
    state.toolAuditLog.push({
      tick: state.tick,
      tool,
      result,
      detail,
    });
  }

  function readCompactSensors() {
    ensureCurrentSensors();
    audit("readCompactSensors", "ok", compactSummary(state.currentCompactRows));
    return {
      tick: state.tick,
      compactRows: cloneRows(state.currentCompactRows),
      compactSummary: compactSummary(state.currentCompactRows),
      sensorValues: { ...state.currentSensors },
    };
  }

  function readRiskMemory() {
    const snapshot = riskChooser.snapshot();
    audit("readRiskMemory", "ok", snapshot.activeMemoryText);
    return {
      tick: state.tick,
      activeRiskMemory: { ...snapshot.activeRiskMemory },
      activeMemoryText: snapshot.activeMemoryText,
      lastOutcome: snapshot.lastOutcome,
    };
  }

  function predictAction(action, reason) {
    if (!ALLOWED_ACTIONS.has(action)) {
      audit("predictAction", "denied", `unknown action ${action}`);
      return { ok: false, denied: true, reason: "unknown action" };
    }
    const memory = riskChooser.snapshot().activeRiskMemory;
    const prediction = {
      tick: state.tick + 1,
      action,
      reason,
      expectedCompactResult: expectationFor(action, memory),
    };
    state.predictions.push(prediction);
    audit("predictAction", "ok", `${action}: ${prediction.expectedCompactResult}`);
    return { ok: true, prediction: { ...prediction } };
  }

  function chooseAction(action, reason) {
    if (!ALLOWED_ACTIONS.has(action)) {
      audit("chooseAction", "denied", `unknown action ${action}`);
      return { ok: false, denied: true, reason: "unknown action" };
    }
    const prediction = state.predictions.findLast((row) => row.action === action && row.tick === state.tick + 1) ?? null;
    const snapshot = world.step(action);
    const sensors = readNursery25DSensors(snapshot);
    const tick = state.tick + 1;
    const compactRows = buildCompactRows25D({
      runId,
      tick,
      action,
      sensors,
      previousSensors: state.currentSensors ?? state.previousSensors,
      olderSensors: state.previousSensors ?? state.olderSensors,
    });
    const result = comparePrediction({ prediction, compactRows, sensors });
    riskChooser.observe({ tick, action, sensors, compactRows });
    state.olderSensors = state.previousSensors;
    state.previousSensors = state.currentSensors;
    state.currentSensors = sensors;
    state.currentCompactRows = compactRows;
    state.tick = tick;
    const receipt = {
      tick,
      action,
      reason,
      compactSummary: compactSummary(compactRows),
      comparison: result,
      riskMemory: riskChooser.snapshot().activeMemoryText,
    };
    state.actionReceipts.push(receipt);
    state.comparisons.push({ ...receipt, predicted: prediction?.expectedCompactResult ?? "" });
    audit("chooseAction", "ok", `${action}: ${result}`);
    return { ok: true, receipt: { ...receipt } };
  }

  function writeMapBelief({ belief, confidence = "low", evidence = "", nextPrediction = "" }) {
    const row = {
      tick: state.tick,
      belief,
      confidence,
      evidence,
      nextPrediction,
    };
    state.mapBeliefs.push(row);
    audit("writeMapBelief", "ok", belief);
    return { ok: true, mapBelief: { ...row } };
  }

  function useLearnedControl(controlId, reason = "") {
    const operation = LEARNED_CONTROL_OPERATIONS[controlId];
    if (!operation) {
      audit("useLearnedControl", "denied", `unknown control ${controlId}`);
      return { ok: false, denied: true, reason: "unknown learned control" };
    }
    if (!activeControls.has(controlId)) {
      audit("useLearnedControl", "denied", `${controlId} is not active`);
      return {
        ok: false,
        denied: true,
        reason: "learned control is not active",
        requiredStatus: "active",
      };
    }
    state.learnedControlQueue.push(...operation);
    audit("useLearnedControl", "ok", `${controlId}: ${operation.join(" -> ")}`);
    return {
      ok: true,
      controlId,
      reason,
      queuedActions: [...operation],
    };
  }

  function requestRawDetail(reason) {
    const row = {
      tick: state.tick,
      reason,
      decision: "denied",
      explanation: "raw detail is unavailable in this tool-boundary test; compact logs remain the operating channel",
    };
    state.rawRequests.push(row);
    audit("requestRawDetail", "denied", reason);
    return { ok: false, denied: true, ...row };
  }

  function suggestActionFromRiskMemory() {
    const choice = riskChooser.choose(state.tick + 1);
    audit("suggestActionFromRiskMemory", "ok", `${choice.action}: ${choice.reason}`);
    return { ...choice };
  }

  function takeQueuedLearnedControlAction() {
    const action = state.learnedControlQueue.shift();
    if (!action) return null;
    return {
      action,
      intention: "run queued learned operation control action",
      reason: "learned control queue",
    };
  }

  function exportAgentLog() {
    return {
      predictions: state.predictions.map((row) => ({ ...row })),
      comparisons: state.comparisons.map((row) => ({ ...row })),
      actions: state.actionReceipts.map((row) => ({ ...row })),
      mapBeliefs: state.mapBeliefs.map((row) => ({ ...row })),
      rawRequests: state.rawRequests.map((row) => ({ ...row })),
      riskMemory: riskChooser.riskMemoryLog(),
      toolAuditLog: state.toolAuditLog.map((row) => ({ ...row })),
    };
  }

  return {
    readCompactSensors,
    readRiskMemory,
    predictAction,
    chooseAction,
    writeMapBelief,
    useLearnedControl,
    requestRawDetail,
    suggestActionFromRiskMemory,
    takeQueuedLearnedControlAction,
    exportAgentLog,
  };
}
