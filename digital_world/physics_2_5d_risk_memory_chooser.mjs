function rowMentions(row, text) {
  return row.stream.includes(text) || row.event.includes(text);
}

function rowsMention(rows, text) {
  return rows.some((row) => rowMentions(row, text));
}

function summarizeActive(memory) {
  return Object.entries(memory)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(", ") || "none";
}

function compactRiskFromRows(rows) {
  return {
    rampLoadAhead: rowsMention(rows, "ramp_load_shift") || rowsMention(rows, "height_load"),
    dropAhead: rowsMention(rows, "foot_drop_warning") || rowsMention(rows, "foot_drop"),
    overheadAhead: rowsMention(rows, "overhead_clearance") || rowsMention(rows, "vertical_echo"),
    raisedSurfaceAhead: rowsMention(rows, "height_pressure") || rowsMention(rows, "raised"),
  };
}

export function createPhysics25DRiskMemoryChooser() {
  const state = {
    activeRiskMemory: {
      rampLoadAhead: false,
      dropAhead: false,
      overheadAhead: false,
      raisedSurfaceAhead: false,
      crouchedForClearance: false,
      settledRaisedSurface: false,
      recenteredForLoad: false,
    },
    lastAction: "",
    lastOutcome: "settled",
    lastCompactSummary: "compact stream quiet",
    actionTrail: [],
    riskMemoryLog: [],
  };

  function choose(tick) {
    const memory = state.activeRiskMemory;

    if (state.lastAction === "probe_forward" && state.lastOutcome === "probe_overhead_warning") {
      memory.crouchedForClearance = true;
      return {
        action: "crouch_body",
        intention: "lower body because compact risk memory says overhead clearance is tight",
        reason: "risk memory: overheadAhead confirmed by probe",
      };
    }

    if (state.lastAction === "crouch_body") {
      return {
        action: "step_forward",
        intention: "cross low-clearance area while the body is lowered",
        reason: "risk memory: crouchedForClearance is active",
      };
    }

    if (state.lastAction === "probe_forward" && state.lastOutcome === "probe_drop_warning") {
      memory.dropAhead = false;
      return {
        action: "step_forward",
        intention: "commit slowly after compact foot-drop probe warning",
        reason: "risk memory: dropAhead was probed before body commitment",
      };
    }

    if (memory.overheadAhead && !memory.crouchedForClearance) {
      return {
        action: "probe_forward",
        intention: "test upper-body clearance from compact vertical risk memory",
        reason: "risk memory: overheadAhead",
      };
    }

    if (memory.dropAhead) {
      return {
        action: "probe_forward",
        intention: "test foot support from compact drop risk memory",
        reason: "risk memory: dropAhead",
      };
    }

    if (memory.rampLoadAhead && !memory.recenteredForLoad) {
      memory.recenteredForLoad = true;
      return {
        action: "recenter_body",
        intention: "settle pitch/load before moving across height change",
        reason: "risk memory: rampLoadAhead",
      };
    }

    if (memory.raisedSurfaceAhead && !memory.settledRaisedSurface) {
      memory.settledRaisedSurface = true;
      return {
        action: "pause",
        intention: "separate raised-surface load from collision",
        reason: "risk memory: raisedSurfaceAhead",
      };
    }

    return {
      action: "step_forward",
      intention: "gather the next compact body/world sample",
      reason: "risk memory has no active stop, duck, probe, or settle request",
    };
  }

  function observe({ tick, action, sensors, compactRows }) {
    const risk = compactRiskFromRows(compactRows);
    const memory = state.activeRiskMemory;
    const before = summarizeActive(memory);
    const probeOverheadWarning = action === "probe_forward" && (risk.overheadAhead || sensors.overhead_clearance >= 0.9);
    const probeDropWarning = action === "probe_forward" && (risk.dropAhead || sensors.foot_drop_warning >= 0.85);

    if (risk.rampLoadAhead || sensors.ramp_load_shift >= 0.7 || sensors.body_pitch_pressure >= 0.7) {
      memory.rampLoadAhead = true;
    }
    if (risk.dropAhead || sensors.foot_drop_warning >= 0.58) {
      memory.dropAhead = true;
    }
    if (risk.overheadAhead || sensors.overhead_clearance >= 0.58 || sensors.vertical_echo >= 0.58) {
      memory.overheadAhead = true;
    }
    if (risk.raisedSurfaceAhead || sensors.height_pressure >= 0.85) {
      memory.raisedSurfaceAhead = true;
    }
    if (action === "probe_forward" && !probeOverheadWarning && !probeDropWarning) {
      memory.overheadAhead = false;
      memory.dropAhead = false;
    }

    state.lastAction = action;
    state.lastOutcome =
      probeOverheadWarning
        ? "probe_overhead_warning"
        : probeDropWarning
          ? "probe_drop_warning"
          : sensors.movement_result >= 0.9
            ? "blocked_or_overhead_contact"
            : sensors.movement_result >= 0.68
              ? "height_warning"
              : sensors.movement_result >= 0.18
                ? "succeeded"
                : "settled";
    state.lastCompactSummary = compactRows.length
      ? compactRows
          .slice(0, 4)
          .map((row) => `${row.stream}:${row.layer}:${row.direction}`)
          .join("; ")
      : "compact stream quiet";
    state.actionTrail.push(action);
    state.riskMemoryLog.push({
      tick,
      action,
      before,
      compactEvidence: state.lastCompactSummary,
      after: summarizeActive(memory),
      outcome: state.lastOutcome,
    });
  }

  function snapshot() {
    return {
      activeRiskMemory: { ...state.activeRiskMemory },
      activeMemoryText: summarizeActive(state.activeRiskMemory),
      lastAction: state.lastAction,
      lastOutcome: state.lastOutcome,
      lastCompactSummary: state.lastCompactSummary,
      actionTrail: [...state.actionTrail],
    };
  }

  function riskMemoryLog() {
    return state.riskMemoryLog.map((row) => ({ ...row }));
  }

  return {
    choose,
    observe,
    snapshot,
    riskMemoryLog,
  };
}
