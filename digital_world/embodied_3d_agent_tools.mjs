import { buildCompactRows3D, readNursery3DSensors } from "./physics_3d_nursery_sensors.mjs";

const ALLOWED_ACTIONS_3D = new Set([
  "step_forward",
  "probe_forward",
  "crouch_body",
  "stand_body",
  "recenter_body",
  "pause",
  "turn_left",
  "turn_right",
  "step_up",
  "step_down",
]);

function compactSummary(rows) {
  if (rows.length === 0) return "compact 3d stream quiet";
  return rows
    .slice(0, 6)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function rowMentions(row, text) {
  return row.stream.includes(text) || row.event.includes(text);
}

function rowsMention(rows, text) {
  return rows.some((row) => rowMentions(row, text));
}

function activeMemoryText(memory) {
  return Object.entries(memory)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(", ") || "none";
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function createRiskMemory3D() {
  const state = {
    activeRiskMemory: {
      overheadAhead: false,
      stepUpAhead: false,
      dropAhead: false,
      loweredForClearance: false,
      raisedForStep: false,
      loweredForDrop: false,
    },
    lastAction: "",
    lastOutcome: "settled",
    riskMemoryLog: [],
  };

  function observe({ tick, action, sensors, compactRows }) {
    const memory = state.activeRiskMemory;
    const before = activeMemoryText(memory);

    if (rowsMention(compactRows, "overhead_clearance") || rowsMention(compactRows, "vertical_echo") || sensors.overhead_clearance >= 0.58) {
      memory.overheadAhead = true;
    }
    if (rowsMention(compactRows, "foot_step_warning") || sensors.foot_step_warning >= 0.58) {
      memory.stepUpAhead = true;
    }
    if (rowsMention(compactRows, "foot_drop_warning") || sensors.foot_drop_warning >= 0.58) {
      memory.dropAhead = true;
    }
    if (action === "crouch_body") {
      memory.loweredForClearance = true;
    }
    if (action === "step_up") {
      memory.raisedForStep = true;
      memory.stepUpAhead = false;
    }
    if (action === "step_down") {
      memory.loweredForDrop = true;
      memory.dropAhead = false;
    }
    if (action === "probe_forward" && sensors.overhead_clearance < 0.58 && sensors.foot_step_warning < 0.58 && sensors.foot_drop_warning < 0.58) {
      memory.overheadAhead = false;
      memory.stepUpAhead = false;
      memory.dropAhead = false;
    }
    if (action === "step_forward" && sensors.overhead_clearance < 0.58 && sensors.vertical_echo < 0.58) {
      memory.overheadAhead = false;
    }
    if (action === "step_forward" && sensors.foot_step_warning < 0.58) {
      memory.stepUpAhead = false;
      memory.raisedForStep = false;
    }
    if (action === "step_forward" && sensors.foot_drop_warning < 0.58) {
      memory.dropAhead = false;
      memory.loweredForDrop = false;
    }
    if (action === "stand_body") {
      memory.loweredForClearance = false;
    }

    state.lastAction = action;
    state.lastOutcome =
      sensors.movement_result >= 0.95
        ? "blocked_or_contact"
        : sensors.movement_result >= 0.82
          ? "probe_or_drop_warning"
          : sensors.movement_result >= 0.68
            ? "height_warning"
            : sensors.movement_result >= 0.3
              ? "vertical_body_action"
              : "settled_or_moved";

    state.riskMemoryLog.push({
      tick,
      action,
      before,
      compactEvidence: compactSummary(compactRows),
      after: activeMemoryText(memory),
      outcome: state.lastOutcome,
    });
  }

  function choose() {
    const memory = state.activeRiskMemory;
    if (memory.overheadAhead && !memory.loweredForClearance) {
      return {
        action: state.lastAction === "probe_forward" ? "crouch_body" : "probe_forward",
        reason:
          state.lastAction === "probe_forward"
            ? "compact upper-volume warning was probed, so lower the body before committing"
            : "compact upper-volume risk asks for a probe before upper-body commitment",
      };
    }
    if (memory.stepUpAhead && !memory.raisedForStep) {
      return {
        action: state.lastAction === "probe_forward" ? "step_up" : "probe_forward",
        reason:
          state.lastAction === "probe_forward"
            ? "compact raised-support warning was probed, so lift base height before crossing"
            : "compact foot support says the next floor support may be higher",
      };
    }
    if (memory.dropAhead && !memory.loweredForDrop) {
      return {
        action: state.lastAction === "probe_forward" ? "step_down" : "probe_forward",
        reason:
          state.lastAction === "probe_forward"
            ? "compact lower-support warning was probed, so lower base height before crossing"
            : "compact foot support says the next floor support may be lower",
      };
    }
    if (memory.overheadAhead && memory.loweredForClearance) {
      return {
        action: state.lastAction === "probe_forward" ? "pause" : "probe_forward",
        reason:
          state.lastAction === "probe_forward"
            ? "compact upper-volume risk persists even while lowered, so hold instead of committing"
            : "body is lowered but compact upper-volume risk still asks for a probe before moving",
      };
    }
    if (memory.loweredForClearance && state.lastAction === "probe_forward" && !memory.overheadAhead) {
      return {
        action: "step_forward",
        reason: "crouched probe did not keep upper-volume risk active, so cross while lowered",
      };
    }
    return {
      action: "step_forward",
      reason: "no compact 3d risk memory asks for probe, height change, or posture change",
    };
  }

  function snapshot() {
    return {
      activeRiskMemory: { ...state.activeRiskMemory },
      activeMemoryText: activeMemoryText(state.activeRiskMemory),
      lastAction: state.lastAction,
      lastOutcome: state.lastOutcome,
    };
  }

  function riskMemoryLog() {
    return state.riskMemoryLog.map((row) => ({ ...row }));
  }

  return {
    observe,
    choose,
    snapshot,
    riskMemoryLog,
  };
}

function expectationFor3D(action) {
  if (action === "probe_forward") return "compact probe should reveal upper or floor-height risk before body commitment";
  if (action === "crouch_body") return "body top pressure should reduce before forward movement";
  if (action === "stand_body") return "body can return to standing after upper clearance risk clears";
  if (action === "step_up") return "base height shift should rise toward raised support";
  if (action === "step_down") return "base height shift should fall toward lower support";
  if (action === "recenter_body") return "body pitch pressure should settle";
  if (action === "pause") return "compact pressure should settle without adding a new contact";
  return "forward movement should gather compact 3d evidence without hidden geometry";
}

function comparePrediction3D({ prediction, sensors }) {
  if (!prediction) return "no_prediction_recorded";
  const action = prediction.action;
  let matched = false;
  if (action === "probe_forward") matched = sensors.movement_result >= 0.68 || sensors.movement_result < 0.35;
  else if (action === "crouch_body") matched = sensors.base_height_shift >= 0.75 || sensors.overhead_clearance < 0.75;
  else if (action === "stand_body") matched = sensors.movement_result < 0.3;
  else if (action === "step_up" || action === "step_down") matched = sensors.base_height_shift >= 0.55;
  else if (action === "recenter_body") matched = sensors.body_pitch_pressure < 0.75;
  else matched = sensors.movement_result < 0.95;
  return matched ? "matched_or_explained" : "mismatch_needs_map_update";
}

export function createEmbodied3DAgentTools({ world, runId = "agent_3d_tool_run" }) {
  const riskMemory = createRiskMemory3D();
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
  };

  function ensureCurrentSensors() {
    if (!state.currentSensors) {
      state.currentSensors = readNursery3DSensors(world.snapshot());
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

  function readCompactSensors3D() {
    ensureCurrentSensors();
    audit("readCompactSensors3D", "ok", compactSummary(state.currentCompactRows));
    return {
      tick: state.tick,
      compactRows: cloneRows(state.currentCompactRows),
      compactSummary: compactSummary(state.currentCompactRows),
      sensorValues: { ...state.currentSensors },
    };
  }

  function readRiskMemory3D() {
    const snapshot = riskMemory.snapshot();
    audit("readRiskMemory3D", "ok", snapshot.activeMemoryText);
    return {
      tick: state.tick,
      activeRiskMemory: { ...snapshot.activeRiskMemory },
      activeMemoryText: snapshot.activeMemoryText,
      lastOutcome: snapshot.lastOutcome,
    };
  }

  function predictAction3D(action, reason) {
    if (!ALLOWED_ACTIONS_3D.has(action)) {
      audit("predictAction3D", "denied", `unknown action ${action}`);
      return { ok: false, denied: true, reason: "unknown action" };
    }
    const prediction = {
      tick: state.tick + 1,
      action,
      reason,
      expectedCompactResult: expectationFor3D(action),
    };
    state.predictions.push(prediction);
    audit("predictAction3D", "ok", `${action}: ${prediction.expectedCompactResult}`);
    return { ok: true, prediction: { ...prediction } };
  }

  function chooseAction3D(action, reason) {
    if (!ALLOWED_ACTIONS_3D.has(action)) {
      audit("chooseAction3D", "denied", `unknown action ${action}`);
      return { ok: false, denied: true, reason: "unknown action" };
    }
    const prediction = state.predictions.findLast((row) => row.action === action && row.tick === state.tick + 1) ?? null;
    const snapshot = world.step(action);
    const sensors = readNursery3DSensors(snapshot);
    const tick = state.tick + 1;
    const compactRows = buildCompactRows3D({
      runId,
      tick,
      action,
      sensors,
      previousSensors: state.currentSensors ?? state.previousSensors,
      olderSensors: state.previousSensors ?? state.olderSensors,
    });
    const comparison = comparePrediction3D({ prediction, sensors });
    riskMemory.observe({ tick, action, sensors, compactRows });
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
      comparison,
      riskMemory: riskMemory.snapshot().activeMemoryText,
    };
    state.actionReceipts.push(receipt);
    state.comparisons.push({ ...receipt, predicted: prediction?.expectedCompactResult ?? "" });
    audit("chooseAction3D", "ok", `${action}: ${comparison}`);
    return { ok: true, receipt: { ...receipt } };
  }

  function writeMapBelief3D({ belief, confidence = "low", evidence = "", nextPrediction = "" }) {
    const row = {
      tick: state.tick,
      belief,
      confidence,
      evidence,
      nextPrediction,
    };
    state.mapBeliefs.push(row);
    audit("writeMapBelief3D", "ok", belief);
    return { ok: true, mapBelief: { ...row } };
  }

  function requestRawDetail(reason) {
    const row = {
      tick: state.tick,
      reason,
      decision: "denied",
      explanation: "raw 3d detail is unavailable in this tool-boundary test; compact 3d logs remain the operating channel",
    };
    state.rawRequests.push(row);
    audit("requestRawDetail", "denied", reason);
    return { ok: false, denied: true, ...row };
  }

  function suggestActionFromRiskMemory3D() {
    const choice = riskMemory.choose();
    audit("suggestActionFromRiskMemory3D", "ok", `${choice.action}: ${choice.reason}`);
    return { ...choice };
  }

  function exportAgentLog() {
    return {
      predictions: state.predictions.map((row) => ({ ...row })),
      comparisons: state.comparisons.map((row) => ({ ...row })),
      actions: state.actionReceipts.map((row) => ({ ...row })),
      mapBeliefs: state.mapBeliefs.map((row) => ({ ...row })),
      rawRequests: state.rawRequests.map((row) => ({ ...row })),
      riskMemory: riskMemory.riskMemoryLog(),
      toolAuditLog: state.toolAuditLog.map((row) => ({ ...row })),
    };
  }

  return {
    readCompactSensors3D,
    readRiskMemory3D,
    predictAction3D,
    chooseAction3D,
    writeMapBelief3D,
    requestRawDetail,
    suggestActionFromRiskMemory3D,
    exportAgentLog,
  };
}
