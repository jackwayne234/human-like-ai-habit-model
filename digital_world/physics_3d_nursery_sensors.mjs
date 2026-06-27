import { FACING_VECTORS_3D } from "./physics_3d_nursery_world.mjs";

const SENSOR_KEYS_3D = [
  "touch_torso_front",
  "overhead_clearance",
  "vertical_echo",
  "foot_step_warning",
  "foot_drop_warning",
  "height_delta_pressure",
  "body_top_pressure",
  "base_height_shift",
  "body_pitch_pressure",
  "pressure_capsule_left",
  "pressure_capsule_right",
  "ultrasonic_echo",
  "movement_result",
];

const MOVEMENT_VALUES_3D = {
  settled: 0.05,
  turned: 0.12,
  paused: 0.08,
  stood: 0.12,
  crouched: 0.16,
  recentered: 0.2,
  succeeded: 0.25,
  stepped_up: 0.36,
  stepped_down: 0.38,
  step_up_unneeded: 0.44,
  step_down_unneeded: 0.44,
  probe_step_warning: 0.72,
  probe_drop_warning: 0.82,
  probe_overhead_warning: 0.84,
  step_height_blocked: 0.9,
  drop_warning: 0.92,
  overhead_blocked: 0.96,
  probe_blocked: 0.86,
  blocked: 1,
};

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function pointInRect(point, rect, margin = 0) {
  return (
    point.x >= rect.x1 - margin &&
    point.x <= rect.x2 + margin &&
    point.y >= rect.y1 - margin &&
    point.y <= rect.y2 + margin
  );
}

function distanceToForwardSurface(snapshot) {
  const { room, x, y, facing } = snapshot;
  const vector = FACING_VECTORS_3D[facing];
  let distance = 3.4;

  if (vector.x < 0) distance = Math.min(distance, x - room.robotHalfSize);
  if (vector.x > 0) distance = Math.min(distance, room.width - room.robotHalfSize - x);
  if (vector.y < 0) distance = Math.min(distance, y - room.robotHalfSize);
  if (vector.y > 0) distance = Math.min(distance, room.depth - room.robotHalfSize - y);

  for (const rect of [room.lowCeilingZone, room.stepBlock, room.dropGap, room.hangingBar]) {
    if (vector.y > 0 && x >= rect.x1 - 0.35 && x <= rect.x2 + 0.35 && rect.y1 > y) {
      distance = Math.min(distance, rect.y1 - y);
    }
    if (vector.y < 0 && x >= rect.x1 - 0.35 && x <= rect.x2 + 0.35 && rect.y2 < y) {
      distance = Math.min(distance, y - rect.y2);
    }
  }

  return Math.max(0.05, distance);
}

function movementValue(result) {
  return MOVEMENT_VALUES_3D[result] ?? 0.1;
}

export function readNursery3DSensors(snapshot) {
  const interaction = snapshot.lastInteraction;
  const terrain = new Set(interaction.terrain);
  const point = { x: snapshot.x, y: snapshot.y };
  const nearLowCeiling = pointInRect(point, snapshot.room.lowCeilingZone, 0.72);
  const nearStep = pointInRect(point, snapshot.room.stepBlock, 0.85);
  const nearDrop = pointInRect(point, snapshot.room.dropGap, 0.9);
  const nearHanging = pointInRect(point, snapshot.room.hangingBar, 0.85);
  const overheadActive = interaction.overheadContact || terrain.has("low_ceiling_span") || terrain.has("hanging_bar");
  const stepActive = interaction.footStepWarning || terrain.has("raised_step_block");
  const dropActive = interaction.footDropWarning || terrain.has("floor_drop_gap");
  const verticalShift = interaction.verticalBodyShift || interaction.movementResult === "stepped_up" || interaction.movementResult === "stepped_down";
  const pitchActive = interaction.bodyPitch !== "level";
  const echo = clamp01(1 - distanceToForwardSurface(snapshot) / 2.4);

  const sensors = {
    touch_torso_front: interaction.contactFront ? 1 : 0.04,
    overhead_clearance: interaction.overheadContact ? 1 : nearLowCeiling || nearHanging ? (snapshot.posture === "crouched" ? 0.46 : 0.7) : 0.1,
    vertical_echo: overheadActive ? 0.88 : nearLowCeiling || nearHanging ? 0.66 : 0.18,
    foot_step_warning: interaction.footStepWarning ? 0.96 : nearStep ? 0.58 : 0.08,
    foot_drop_warning: interaction.footDropWarning ? 0.96 : nearDrop ? 0.58 : 0.08,
    height_delta_pressure: stepActive ? 0.82 : dropActive ? 0.86 : nearStep || nearDrop ? 0.5 : 0.12,
    body_top_pressure: interaction.overheadContact ? 1 : overheadActive ? 0.72 : nearLowCeiling || nearHanging ? 0.54 : 0.1,
    base_height_shift: verticalShift ? 0.9 : Math.abs(snapshot.baseZ) >= 0.35 ? 0.62 : 0.08,
    body_pitch_pressure: pitchActive ? (interaction.bodyPitch === "nose_down" ? 0.86 : 0.74) : 0.14,
    pressure_capsule_left: stepActive ? 0.7 : dropActive ? 0.28 : 0.22,
    pressure_capsule_right: stepActive ? 0.32 : dropActive ? 0.7 : 0.22,
    ultrasonic_echo: echo,
    movement_result: movementValue(interaction.movementResult),
  };

  return Object.fromEntries(SENSOR_KEYS_3D.map((key) => [key, Number(sensors[key].toFixed(2))]));
}

function signedDirection(change) {
  if (change >= 0.45) return "rising";
  if (change <= -0.45) return "falling";
  return "steady";
}

function compactEventName(key) {
  if (key === "movement_result") return "movement_consequence_threshold";
  if (key === "overhead_clearance" || key === "body_top_pressure") return "top_clearance_threshold";
  if (key === "foot_step_warning") return "raised_support_threshold";
  if (key === "foot_drop_warning") return "lower_support_threshold";
  if (key === "base_height_shift") return "body_height_shift_threshold";
  return "threshold_hit";
}

function patternShiftForKey(key, acceleration) {
  if (key === "vertical_echo" || key === "overhead_clearance" || key === "body_top_pressure") {
    return acceleration > 0 ? "upper_volume_closing_pattern_shift" : "upper_volume_opening_pattern_shift";
  }
  if (key === "foot_step_warning" || key === "height_delta_pressure") return "raised_support_pattern_shift";
  if (key === "foot_drop_warning") return "lower_support_pattern_shift";
  if (key === "base_height_shift" || key === "body_pitch_pressure") return "body_vertical_motion_pattern_shift";
  if (key.startsWith("pressure_capsule")) return "body_load_pattern_shift";
  if (key === "movement_result") return "movement_consequence_pattern_shift";
  if (key === "ultrasonic_echo") return acceleration > 0 ? "closing_distance_pattern_shift" : "opening_space_pattern_shift";
  return "compact_3d_pattern_shift";
}

export function buildCompactRows3D({ runId, tick, action, sensors, previousSensors, olderSensors }) {
  const rows = [];

  for (const key of SENSOR_KEYS_3D) {
    const value = sensors[key];
    if (value >= 0.95) {
      rows.push({
        runId,
        tick,
        action,
        layer: "n",
        event: compactEventName(key),
        stream: key,
        value,
        signedChange: 0,
        direction: "at_threshold",
      });
    }

    if (previousSensors) {
      const change = Number((value - previousSensors[key]).toFixed(2));
      if (Math.abs(change) >= 0.45) {
        rows.push({
          runId,
          tick,
          action,
          layer: "n^-1",
          event: key === "movement_result" ? "movement_result_change" : "rate_of_change_within_sensor",
          stream: key,
          value,
          signedChange: change,
          direction: signedDirection(change),
        });
      }
    }

    if (previousSensors && olderSensors) {
      const lastChange = previousSensors[key] - olderSensors[key];
      const currentChange = value - previousSensors[key];
      const acceleration = Number((currentChange - lastChange).toFixed(2));
      if (Math.abs(acceleration) >= 0.5) {
        rows.push({
          runId,
          tick,
          action,
          layer: "n^-2",
          event: patternShiftForKey(key, acceleration),
          stream: "compact 3d trigger stream",
          value: Number(Math.abs(acceleration).toFixed(2)),
          signedChange: acceleration,
          direction: signedDirection(acceleration),
        });
      }
    }
  }

  const active = rows.filter((row) => row.layer !== "n^-2").map((row) => row.stream);
  if (active.includes("overhead_clearance") && active.includes("vertical_echo")) {
    rows.push({
      runId,
      tick,
      action,
      layer: "n^-1",
      event: "cross_sensor_compact_agreement",
      stream: "overhead_clearance, vertical_echo",
      value: 2,
      signedChange: 0,
      direction: "agreement",
    });
  }
  if (active.includes("foot_step_warning") && active.includes("height_delta_pressure")) {
    rows.push({
      runId,
      tick,
      action,
      layer: "n^-1",
      event: "cross_sensor_compact_agreement",
      stream: "foot_step_warning, height_delta_pressure",
      value: 2,
      signedChange: 0,
      direction: "agreement",
    });
  }
  if (active.includes("foot_drop_warning") && active.includes("height_delta_pressure")) {
    rows.push({
      runId,
      tick,
      action,
      layer: "n^-1",
      event: "cross_sensor_compact_agreement",
      stream: "foot_drop_warning, height_delta_pressure",
      value: 2,
      signedChange: 0,
      direction: "agreement",
    });
  }

  return rows;
}

export { SENSOR_KEYS_3D };
