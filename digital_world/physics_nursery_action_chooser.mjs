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
    frontRisk:
      hasBelief(priorMapUpdates, ["wall_or_tall_obstacle", "near_front_path"]) ||
      hasLesson(lessonRows, ["near-front path", "solid", "blocked"]),
    baseRisk:
      hasBelief(priorMapUpdates, ["low_obstacle_or_curb", "near_base_path"]) ||
      hasLesson(lessonRows, ["low obstacle", "curb warning", "base contact"]),
    externalPressure:
      hasBelief(priorMapUpdates, ["fan_or_external_pressure", "local_air"]) ||
      hasLesson(lessonRows, ["airflow", "external pressure"]),
  };
}

function compactRowsInclude(rows, text) {
  return rows.some((row) => row.stream.includes(text) || row.event.includes(text));
}

export function createPhysicsNurseryActionChooser({ priorMapUpdates = [], priorLessonRows = [], learnedRules = [] }) {
  const seedBeliefs = buildSeedBeliefs({ priorMapUpdates, priorLessonRows, learnedRules });
  const state = {
    beliefs: { ...seedBeliefs },
    lastAction: "",
    lastMovementResult: "",
    lastComparison: "",
    consecutiveForwardSuccesses: 0,
    forwardSinceLastProbe: 0,
    recenteredAfterLean: false,
    steppedAfterRecenter: false,
    pausedAfterAirflow: false,
    turnedAfterRisk: false,
    ticks: 0,
  };

  function choose(tick) {
    state.ticks = tick;

    if (state.lastAction === "probe_forward" && /blocked|warning/.test(state.lastMovementResult)) {
      state.turnedAfterRisk = true;
      return {
        action: tick > 8 ? "turn_left" : "turn_right",
        intention: "turn away after compact probe warning instead of committing body weight",
        reason: "previous probe reported resistance or base warning",
      };
    }

    if (state.lastAction === "probe_forward" && state.lastMovementResult === "succeeded") {
      return {
        action: "step_forward",
        intention: "commit one small step after a quiet probe",
        reason: "probe did not report front or base risk",
      };
    }

    if (state.lastAction === "turn_left" || state.lastAction === "turn_right") {
      state.turnedAfterRisk = false;
      return {
        action: "step_forward",
        intention: "test the changed front direction with a small step",
        reason: "turn changed echo/front relation after a risk belief",
      };
    }

    if (/blocked|partial|warning/.test(state.lastMovementResult) && state.lastAction !== "pause") {
      return {
        action: "turn_right",
        intention: "avoid repeating a resisted movement",
        reason: "last movement outcome carried compact risk",
      };
    }

    if (state.beliefs.frontRisk && tick === 1) {
      return {
        action: "probe_forward",
        intention: "check learned front resistance before committing body weight",
        reason: "prior compact map says the first forward path may resist",
      };
    }

    if (state.beliefs.baseRisk && state.consecutiveForwardSuccesses >= 1 && state.forwardSinceLastProbe >= 1 && tick <= 5) {
      return {
        action: "probe_forward",
        intention: "check for low base obstacle before stepping",
        reason: "prior compact map says base contact can appear without torso contact",
      };
    }

    if (state.beliefs.leaning && !state.recenteredAfterLean && state.consecutiveForwardSuccesses >= 2) {
      state.recenteredAfterLean = true;
      state.steppedAfterRecenter = false;
      return {
        action: "recenter_body",
        intention: "reduce left/right pressure mismatch before more movement",
        reason: "compact pressure capsules suggest body leaning",
      };
    }

    if (state.recenteredAfterLean && !state.steppedAfterRecenter) {
      state.steppedAfterRecenter = true;
      return {
        action: "step_forward",
        intention: "move cautiously after recentering pressure",
        reason: "body recenter was attempted and the path still needs evidence",
      };
    }

    if (state.beliefs.externalPressure && !state.pausedAfterAirflow && state.consecutiveForwardSuccesses >= 3) {
      state.pausedAfterAirflow = true;
      return {
        action: "pause",
        intention: "separate external airflow pressure from body lean",
        reason: "compact airflow/pressure evidence is active",
      };
    }

    if (state.pausedAfterAirflow && state.beliefs.baseRisk && state.forwardSinceLastProbe >= 1) {
      return {
        action: "probe_forward",
        intention: "check for curb or edge warning before a full step",
        reason: "base-risk lesson says probe before committing after pressure/airflow zone",
      };
    }

    if (tick % 4 === 0 && state.forwardSinceLastProbe >= 2) {
      return {
        action: "probe_forward",
        intention: "gather compact evidence with a reversible probe",
        reason: "under-exploring guard fired after repeated forward movement",
      };
    }

    return {
      action: "step_forward",
      intention: "continue with a small forward test",
      reason: "no active compact risk requires turning, pausing, or recentering",
    };
  }

  function observe({ action, sensors, compactRows, comparison, mapUpdates }) {
    state.lastAction = action;
    state.lastMovementResult =
      sensors.movement_result >= 0.95
        ? "blocked"
        : sensors.movement_result >= 0.75
          ? "partial"
          : sensors.movement_result >= 0.65
            ? "warning"
            : sensors.movement_result >= 0.18
              ? "succeeded"
              : "settled";
    state.lastComparison = comparison.result;

    if (action === "step_forward" && state.lastMovementResult === "succeeded") {
      state.consecutiveForwardSuccesses += 1;
      state.forwardSinceLastProbe += 1;
    } else if (action === "probe_forward") {
      state.forwardSinceLastProbe = 0;
    } else if (/blocked|partial|warning/.test(state.lastMovementResult)) {
      state.consecutiveForwardSuccesses = 0;
    }

    if (compactRowsInclude(compactRows, "touch_torso_front") || sensors.movement_result >= 0.95) {
      state.beliefs.frontRisk = true;
    }
    if (compactRowsInclude(compactRows, "touch_left_base") || compactRowsInclude(compactRows, "touch_right_base")) {
      state.beliefs.baseRisk = true;
    }
    if (compactRowsInclude(compactRows, "airflow") || sensors.airflow >= 0.7) {
      state.beliefs.externalPressure = true;
    }
    if (Math.abs(sensors.pressure_capsule_left - sensors.pressure_capsule_right) >= 0.4) {
      state.beliefs.leaning = true;
    }

    for (const update of mapUpdates) {
      if (update.belief.includes("wall_or_tall_obstacle")) state.beliefs.frontRisk = true;
      if (update.belief.includes("low_obstacle_or_curb")) state.beliefs.baseRisk = true;
      if (update.belief.includes("fan_or_external_pressure")) state.beliefs.externalPressure = true;
      if (update.belief.includes("leaning_")) state.beliefs.leaning = true;
    }
  }

  function snapshot() {
    return {
      beliefs: { ...state.beliefs },
      lastAction: state.lastAction,
      lastMovementResult: state.lastMovementResult,
      consecutiveForwardSuccesses: state.consecutiveForwardSuccesses,
      forwardSinceLastProbe: state.forwardSinceLastProbe,
    };
  }

  return {
    choose,
    observe,
    snapshot,
  };
}
