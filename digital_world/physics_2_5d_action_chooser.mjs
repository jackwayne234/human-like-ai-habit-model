function textIncludesAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function hasBelief(updates, needles) {
  return updates.some((update) => textIncludesAny(update.belief, needles) || textIncludesAny(update.evidence, needles));
}

function hasLesson(lessons, needles) {
  return lessons.some((lesson) => textIncludesAny(lesson.lesson, needles) || textIncludesAny(lesson.evidence, needles));
}

function buildSeedBeliefs({ priorMapUpdates = [], priorLessonRows = [], learnedRules = [] }) {
  const lessonRows = [...priorLessonRows, ...learnedRules];
  return {
    rampRisk:
      hasBelief(priorMapUpdates, ["ramp_or_slope", "height_load"]) ||
      hasLesson(lessonRows, ["ramp", "height-load", "pitch"]),
    dropRisk:
      hasBelief(priorMapUpdates, ["drop_or_ledge", "foot_drop"]) ||
      hasLesson(lessonRows, ["drop", "ledge", "foot warning"]),
    overheadRisk:
      hasBelief(priorMapUpdates, ["low_overhead_clearance", "overhead"]) ||
      hasLesson(lessonRows, ["overhead", "low clearance", "duck"]),
    raisedSurfaceRisk:
      hasBelief(priorMapUpdates, ["raised_pressure_surface"]) ||
      hasLesson(lessonRows, ["raised pressure", "raised surface"]),
  };
}

function compactRowsInclude(rows, text) {
  return rows.some((row) => row.stream.includes(text) || row.event.includes(text));
}

export function createPhysics25DActionChooser({ priorMapUpdates = [], priorLessonRows = [], learnedRules = [] }) {
  const seedBeliefs = buildSeedBeliefs({ priorMapUpdates, priorLessonRows, learnedRules });
  const state = {
    beliefs: { ...seedBeliefs },
    lastAction: "",
    lastMovementResult: "",
    forwardSinceLastProbe: 0,
    steps: 0,
    recenteredAfterRamp: false,
    probedDrop: false,
    crouchedForClearance: false,
    stoodAfterTunnel: false,
    pausedOnRaisedSurface: false,
  };

  function choose(tick) {
    if (state.lastAction === "probe_forward" && state.lastMovementResult === "probe_overhead_warning") {
      state.crouchedForClearance = true;
      return {
        action: "crouch_body",
        intention: "lower body before testing the low-clearance path",
        reason: "compact probe reported overhead clearance pressure",
      };
    }

    if (state.lastAction === "crouch_body") {
      return {
        action: "step_forward",
        intention: "move while crouched after low-clearance warning",
        reason: "crouch should reduce overhead contact risk",
      };
    }

    if (state.crouchedForClearance && !state.stoodAfterTunnel && state.steps >= 7) {
      state.stoodAfterTunnel = true;
      return {
        action: "stand_body",
        intention: "return to normal body height after the clearance test",
        reason: "compact tunnel risk has likely been passed",
      };
    }

    if (state.beliefs.rampRisk && !state.recenteredAfterRamp && state.steps >= 1) {
      state.recenteredAfterRamp = true;
      return {
        action: "recenter_body",
        intention: "reduce pitch/load mismatch before continuing over height change",
        reason: "compact height pressure suggests ramp or slope load shift",
      };
    }

    if (state.beliefs.dropRisk && !state.probedDrop && state.steps >= 2) {
      state.probedDrop = true;
      return {
        action: "probe_forward",
        intention: "test for foot drop before committing body weight",
        reason: "prior compact map says a forward path may contain a ledge or drop",
      };
    }

    if (state.lastAction === "probe_forward" && state.lastMovementResult === "probe_drop_warning") {
      return {
        action: "step_forward",
        intention: "commit slowly after the drop was noticed by the foot probe",
        reason: "drop warning was routed through probe before body commitment",
      };
    }

    if (state.beliefs.overheadRisk && !state.crouchedForClearance && state.steps >= 3) {
      return {
        action: "probe_forward",
        intention: "test vertical clearance before moving upper body forward",
        reason: "prior compact map says overhead clearance may be low",
      };
    }

    if (state.beliefs.raisedSurfaceRisk && !state.pausedOnRaisedSurface && state.steps >= 8) {
      state.pausedOnRaisedSurface = true;
      return {
        action: "pause",
        intention: "let raised-surface pressure settle before another step",
        reason: "compact height pressure suggests a raised load surface nearby",
      };
    }

    return {
      action: "step_forward",
      intention: "continue with a small forward test",
      reason: "no compact height belief currently asks for ducking, probing, pausing, or recentering",
    };
  }

  function observe({ action, sensors, compactRows, mapUpdates }) {
    state.lastAction = action;
    state.lastMovementResult =
      sensors.movement_result >= 0.95
        ? "blocked"
        : sensors.movement_result >= 0.9
          ? "overhead_blocked"
          : compactRowsInclude(compactRows, "probe_overhead") || compactRowsInclude(compactRows, "low_clearance")
            ? "probe_overhead_warning"
            : compactRowsInclude(compactRows, "probe_drop") || compactRowsInclude(compactRows, "drop_warning")
              ? "probe_drop_warning"
              : sensors.movement_result >= 0.68
                ? "height_warning"
                : sensors.movement_result >= 0.18
                  ? "succeeded"
                  : "settled";

    if (action === "step_forward" && state.lastMovementResult !== "blocked" && state.lastMovementResult !== "overhead_blocked") {
      state.steps += 1;
      state.forwardSinceLastProbe += 1;
    } else if (action === "probe_forward") {
      state.forwardSinceLastProbe = 0;
    }

    if (compactRowsInclude(compactRows, "ramp_load_shift") || compactRowsInclude(compactRows, "height_load")) {
      state.beliefs.rampRisk = true;
    }
    if (compactRowsInclude(compactRows, "foot_drop_warning") || compactRowsInclude(compactRows, "foot_drop")) {
      state.beliefs.dropRisk = true;
    }
    if (compactRowsInclude(compactRows, "overhead_clearance") || compactRowsInclude(compactRows, "vertical_echo")) {
      state.beliefs.overheadRisk = true;
    }
    if (sensors.height_pressure >= 0.85 || compactRowsInclude(compactRows, "height_pressure_threshold")) {
      state.beliefs.raisedSurfaceRisk = true;
    }

    for (const update of mapUpdates) {
      if (update.belief.includes("ramp_or_slope")) state.beliefs.rampRisk = true;
      if (update.belief.includes("drop_or_ledge")) state.beliefs.dropRisk = true;
      if (update.belief.includes("low_overhead_clearance")) state.beliefs.overheadRisk = true;
      if (update.belief.includes("raised_pressure_surface")) state.beliefs.raisedSurfaceRisk = true;
    }
  }

  function snapshot() {
    return {
      beliefs: { ...state.beliefs },
      lastAction: state.lastAction,
      lastMovementResult: state.lastMovementResult,
      steps: state.steps,
      forwardSinceLastProbe: state.forwardSinceLastProbe,
    };
  }

  return {
    choose,
    observe,
    snapshot,
  };
}
