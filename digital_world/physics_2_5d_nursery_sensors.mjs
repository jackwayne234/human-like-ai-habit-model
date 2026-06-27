import { FACING_VECTORS } from "./physics_2_5d_nursery_world.mjs";

const SENSOR_KEYS_2_5D = [
  "touch_torso_front",
  "touch_left_base",
  "touch_right_base",
  "overhead_clearance",
  "foot_drop_warning",
  "height_pressure",
  "vertical_echo",
  "body_pitch_pressure",
  "ramp_load_shift",
  "pressure_capsule_left",
  "pressure_capsule_right",
  "ultrasonic_echo",
  "movement_result",
];

const MOVEMENT_VALUES = {
  settled: 0.05,
  turned: 0.12,
  paused: 0.08,
  stood: 0.12,
  crouched: 0.16,
  recentered: 0.2,
  succeeded: 0.25,
  drop_warning: 0.74,
  probe_height_warning: 0.7,
  probe_drop_warning: 0.82,
  probe_overhead_warning: 0.84,
  overhead_blocked: 0.92,
  probe_blocked: 0.86,
  blocked: 1.0,
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
  const vector = FACING_VECTORS[facing];
  let distance = 3.4;

  if (vector.x < 0) distance = Math.min(distance, x - room.robotHalfSize);
  if (vector.x > 0) distance = Math.min(distance, room.width - room.robotHalfSize - x);
  if (vector.y < 0) distance = Math.min(distance, y - room.robotHalfSize);
  if (vector.y > 0) distance = Math.min(distance, room.height - room.robotHalfSize - y);

  const overhead = room.lowTunnel;
  if (vector.y > 0 && x >= overhead.x1 - 0.35 && x <= overhead.x2 + 0.35 && overhead.y1 > y) {
    distance = Math.min(distance, overhead.y1 - y);
  }
  if (vector.y < 0 && x >= overhead.x1 - 0.35 && x <= overhead.x2 + 0.35 && overhead.y2 < y) {
    distance = Math.min(distance, y - overhead.y2);
  }

  return Math.max(0.05, distance);
}

function movementValue(result) {
  return MOVEMENT_VALUES[result] ?? 0.1;
}

export function readNursery25DSensors(snapshot) {
  const interaction = snapshot.lastInteraction;
  const terrain = new Set(interaction.terrain);
  const point = { x: snapshot.x, y: snapshot.y };
  const nearRamp = pointInRect(point, snapshot.room.rampZone, 0.55);
  const nearLedge = pointInRect(point, snapshot.room.ledgeZone, 0.55);
  const nearTunnel = pointInRect(point, snapshot.room.lowTunnel, 0.72);
  const nearPad = pointInRect(point, snapshot.room.raisedPad, 0.55);
  const echo = clamp01(1 - distanceToForwardSurface(snapshot) / 2.4);
  const pitchActive = interaction.bodyPitch !== "level";
  const rampActive = terrain.has("ramp_load_shift") || interaction.heightPressure === "ramp_pressure";
  const raisedActive = terrain.has("raised_pressure_surface") || interaction.heightPressure === "raised_surface_pressure";
  const dropActive = interaction.footDropWarning || terrain.has("ledge_drop_warning");
  const overheadActive = interaction.overheadContact || terrain.has("low_clearance_tunnel");

  const sensors = {
    touch_torso_front: interaction.contactFront ? 1 : 0.04,
    touch_left_base: interaction.contactLeftBase ? 0.78 : rampActive ? 0.5 : 0.06,
    touch_right_base: interaction.contactRightBase ? 0.78 : rampActive ? 0.18 : 0.06,
    overhead_clearance: interaction.overheadContact ? 1 : nearTunnel ? (snapshot.posture === "crouched" ? 0.42 : 0.68) : 0.1,
    foot_drop_warning: dropActive ? 0.95 : nearLedge ? 0.58 : 0.08,
    height_pressure: raisedActive ? 0.88 : rampActive || dropActive ? 0.74 : nearRamp || nearPad ? 0.48 : 0.14,
    vertical_echo: overheadActive ? 0.86 : nearTunnel ? 0.64 : 0.18,
    body_pitch_pressure: pitchActive ? (interaction.bodyPitch === "nose_down" ? 0.86 : 0.72) : 0.14,
    ramp_load_shift: rampActive ? 0.84 : nearRamp ? 0.46 : 0.1,
    pressure_capsule_left: rampActive ? 0.72 : raisedActive ? 0.64 : 0.22,
    pressure_capsule_right: rampActive ? 0.24 : raisedActive ? 0.64 : 0.22,
    ultrasonic_echo: echo,
    movement_result: movementValue(interaction.movementResult),
  };

  return Object.fromEntries(SENSOR_KEYS_2_5D.map((key) => [key, Number(sensors[key].toFixed(2))]));
}

function signedDirection(change) {
  if (change >= 0.45) return "rising";
  if (change <= -0.45) return "falling";
  return "steady";
}

function compactEventName(key, value) {
  if (key === "movement_result" && value >= 0.95) return "movement_blocked_threshold";
  if (key === "foot_drop_warning") return "drop_warning_threshold";
  if (key === "overhead_clearance") return "low_clearance_threshold";
  if (key === "height_pressure") return "height_pressure_threshold";
  return "threshold_hit";
}

function patternShiftForKey(key, acceleration) {
  if (key === "vertical_echo" || key === "overhead_clearance") {
    return acceleration > 0 ? "overhead_clearance_pattern_shift" : "clearance_opening_pattern_shift";
  }
  if (key === "foot_drop_warning") return "foot_drop_pattern_shift";
  if (key === "height_pressure" || key === "ramp_load_shift" || key === "body_pitch_pressure") {
    return "height_load_pattern_shift";
  }
  if (key.startsWith("pressure_capsule") || key.includes("base")) return "body_pressure_pattern_shift";
  if (key === "movement_result") return "movement_consequence_pattern_shift";
  if (key === "ultrasonic_echo") return acceleration > 0 ? "closing_distance_pattern_shift" : "opening_space_pattern_shift";
  return "compact_pattern_shift";
}

export function buildCompactRows25D({ runId, tick, action, sensors, previousSensors, olderSensors }) {
  const rows = [];

  for (const key of SENSOR_KEYS_2_5D) {
    const value = sensors[key];
    if (value >= 0.95 || (key === "overhead_clearance" && value >= 0.95)) {
      rows.push({
        runId,
        tick,
        action,
        layer: "n",
        event: compactEventName(key, value),
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
          stream: "compact trigger stream",
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
  if (active.includes("foot_drop_warning") && active.includes("body_pitch_pressure")) {
    rows.push({
      runId,
      tick,
      action,
      layer: "n^-1",
      event: "cross_sensor_compact_agreement",
      stream: "foot_drop_warning, body_pitch_pressure",
      value: 2,
      signedChange: 0,
      direction: "agreement",
    });
  }

  return rows;
}

export { SENSOR_KEYS_2_5D };
