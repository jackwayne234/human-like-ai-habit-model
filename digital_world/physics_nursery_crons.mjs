function hasCompact(rows, streamOrEvent) {
  return rows.some((row) => row.stream.includes(streamOrEvent) || row.event.includes(streamOrEvent));
}

function strongestCompactSummary(rows) {
  if (rows.length === 0) return "compact stream stayed quiet";
  return rows
    .slice(0, 4)
    .map((row) => `${row.stream} ${row.layer} ${row.direction}`)
    .join("; ");
}

function expectationForAction(action, priorBeliefs = {}) {
  if (action === "probe_forward") {
    return priorBeliefs.expectForwardRisk
      ? "probe may find resistance or base warning before full body commitment"
      : "front space may be open with weak echo change and no torso contact";
  }
  if (action === "step_forward") {
    return priorBeliefs.expectForwardRisk
      ? "forward movement may be blocked, partial, or pressure-changing"
      : "body should move forward with quiet torso contact";
  }
  if (action === "recenter_body") {
    return "left/right pressure difference should reduce if the body was leaning";
  }
  if (action === "pause") {
    return priorBeliefs.expectExternalPressure
      ? "airflow or pressure may settle while base load stays quiet"
      : "compact body signals should settle or stay quiet";
  }
  if (action === "turn_left" || action === "turn_right") {
    return "front echo pattern should change without forward collision";
  }
  return "compact stream should remain stable";
}

export function predictBeforeAction({ runId, tick, action, intention, priorBeliefs }) {
  const expected = expectationForAction(action, priorBeliefs);
  return {
    runId,
    tick,
    action,
    intention,
    prediction: expected,
    expectedCompactResult: expected,
  };
}

export function compareAfterAction({ prediction, compactRows, sensors, delayed = false }) {
  const action = prediction.action;
  const movement = sensors.movement_result;
  const evidence = strongestCompactSummary(compactRows);
  let matched = false;
  let updateTarget = "watch";

  if (action === "probe_forward") {
    matched =
      prediction.expectedCompactResult.includes("resistance") || prediction.expectedCompactResult.includes("base warning")
        ? movement >= 0.65 || compactRows.length > 0
        : movement < 0.65 && !hasCompact(compactRows, "touch_torso_front");
    updateTarget = movement >= 0.65 ? "world_map" : "self_map";
  } else if (action === "step_forward") {
    matched = prediction.expectedCompactResult.includes("blocked")
      ? movement >= 0.65 || compactRows.length > 0
      : movement < 0.65 && !hasCompact(compactRows, "touch_torso_front");
    updateTarget = movement >= 0.65 ? "world_map" : "self_map";
  } else if (action === "recenter_body") {
    matched = sensors.pressure_capsule_left < 0.65 && sensors.pressure_capsule_right > 0.12;
    updateTarget = "self_map";
  } else if (action === "pause") {
    matched = true;
    updateTarget = hasCompact(compactRows, "airflow") ? "world_map" : "self_map";
  } else if (action === "turn_left" || action === "turn_right") {
    matched = !hasCompact(compactRows, "touch_torso_front");
    updateTarget = "world_map";
  }

  return {
    runId: prediction.runId,
    tick: delayed ? `${prediction.tick}+settle` : prediction.tick,
    action,
    phase: delayed ? "delayed_settling_check" : "immediate_comparison",
    predicted: prediction.prediction,
    evidence,
    result: matched ? "matched_or_explained" : "mismatch_needs_map_update",
    updateTarget,
  };
}

export function detectCompactSurprise({ runId, tick, action, compactRows }) {
  const surpriseRows = compactRows.filter(
    (row) =>
      row.layer === "n" ||
      row.layer === "n^-2" ||
      row.event === "cross_sensor_compact_agreement" ||
      (row.layer === "n^-1" && Math.abs(row.signedChange) >= 0.65)
  );

  return surpriseRows.map((row) => ({
    runId,
    tick,
    action,
    trigger: `${row.layer}:${row.event}`,
    evidence: `${row.stream} ${row.direction}`,
    route: "prediction_review_and_body_noticing",
  }));
}

export function runBodyNoticingCron({ runId, tick, action, compactRows, sensors, comparison, forced = false }) {
  const shouldRun = forced || tick % 3 === 0 || comparison.result === "mismatch_needs_map_update";
  if (!shouldRun) return [];

  const updates = [];
  const pressureGap = sensors.pressure_capsule_left - sensors.pressure_capsule_right;

  if (Math.abs(pressureGap) >= 0.4) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "self_map_update",
      belief: pressureGap > 0 ? "body_state: leaning_left" : "body_state: leaning_right",
      confidence: "medium",
      evidence: "left/right pressure capsule difference changed while moving",
      nextPrediction: "recenter_body should reduce pressure difference",
    });
  }

  if (hasCompact(compactRows, "touch_torso_front") || sensors.movement_result >= 0.95) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_front_path: likely wall_or_tall_obstacle",
      confidence: "high",
      evidence: "forward movement resisted with torso-front or blocked movement compact evidence",
      nextPrediction: "turning should change echo/reflection before another forward step",
    });
  }

  if (hasCompact(compactRows, "touch_left_base") || hasCompact(compactRows, "touch_right_base")) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "near_base_path: possible_low_obstacle_or_curb",
      confidence: "medium",
      evidence: "base contact changed without matching torso-front contact",
      nextPrediction: "probe_forward should warn before full step commitment",
    });
  }

  if (hasCompact(compactRows, "airflow") || sensors.airflow >= 0.7) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "world_map_update",
      belief: "local_air: possible_fan_or_external_pressure",
      confidence: "medium",
      evidence: "airflow changed while base touch stayed mostly quiet",
      nextPrediction: "pause should let pressure settle without obstacle contact",
    });
  }

  if (updates.length === 0) {
    updates.push({
      runId,
      tick,
      action,
      mapKind: "self_map_update",
      belief: "body_state: stable_enough_to_continue",
      confidence: "low",
      evidence: "no strong compact body surprise during this noticing window",
      nextPrediction: "small reversible action can gather more evidence",
    });
  }

  return updates;
}

export function movementUrge({ runId, tick, recentComparisons, recentUpdates }) {
  const latestMismatch = recentComparisons.some((row) => row.result === "mismatch_needs_map_update");
  const recentWorldUpdate = recentUpdates.some((row) => row.mapKind === "world_map_update");
  const latestCollision = recentUpdates.some((row) => row.belief.includes("wall_or_tall_obstacle"));
  const latestLean = recentUpdates.some((row) => row.belief.includes("leaning_"));

  if (latestMismatch) {
    return {
      runId,
      tick,
      state: "yield",
      suggestedAction: "pause",
      reason: "unresolved prediction mismatch should be processed before new movement",
    };
  }
  if (latestLean) {
    return {
      runId,
      tick,
      state: "speak",
      suggestedAction: "recenter_body",
      reason: "pressure suggests leaning; recenter before seeking more distance evidence",
    };
  }
  if (latestCollision) {
    return {
      runId,
      tick,
      state: "speak",
      suggestedAction: "turn_right",
      reason: "front path resisted; turning is safer than repeating forward movement",
    };
  }
  if (!recentWorldUpdate && tick % 4 === 0) {
    return {
      runId,
      tick,
      state: "speak",
      suggestedAction: "probe_forward",
      reason: "under-exploring; a probe can gather compact evidence with low commitment",
    };
  }
  return {
    runId,
    tick,
    state: "quiet",
    suggestedAction: "",
    reason: "recent compact evidence is being processed",
  };
}

export function lessonCandidate({ runId, tick, action, compactRows, comparison }) {
  if (comparison.result !== "matched_or_explained" || compactRows.length === 0) return null;

  if (hasCompact(compactRows, "touch_torso_front") || hasCompact(compactRows, "movement_result")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson:
        "when forward movement is blocked and torso/front or echo/reflection compact evidence rises, mark the near-front path as likely solid before repeating the same step",
      evidence: strongestCompactSummary(compactRows),
    };
  }
  if (hasCompact(compactRows, "base")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson:
        "base contact without torso-front contact may mean a low obstacle or curb warning, so probe before committing body weight",
      evidence: strongestCompactSummary(compactRows),
    };
  }
  if (hasCompact(compactRows, "airflow")) {
    return {
      runId,
      tick,
      status: "hypothesis",
      lesson:
        "airflow plus capsule pressure without matching foot load can mean external pressure rather than body imbalance",
      evidence: strongestCompactSummary(compactRows),
    };
  }
  return null;
}

export function promoteReusableLessons(candidates) {
  const groups = new Map();
  for (const candidate of candidates) {
    const key = candidate.lesson;
    groups.set(key, [...(groups.get(key) ?? []), candidate]);
  }

  return [...groups.entries()]
    .filter(([, rows]) => rows.length >= 2 || rows.some((row) => row.evidence.includes("cross_sensor")))
    .map(([lesson, rows], index) => ({
      ruleId: `tiny_nursery_rule_${index + 1}`,
      status: "candidate_reusable_rule",
      evidenceCount: rows.length,
      lesson,
    }));
}
