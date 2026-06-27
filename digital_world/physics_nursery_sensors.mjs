import { FACING_VECTORS } from "./physics_nursery_world.mjs";

const SENSOR_KEYS = [
  "touch_torso_front",
  "touch_left_base",
  "touch_right_base",
  "pressure_capsule_left",
  "pressure_capsule_right",
  "pressure_capsule_front",
  "pressure_capsule_back",
  "airflow",
  "ultrasonic_echo",
  "reflection_volume",
  "movement_result",
];

const MOVEMENT_VALUES = {
  settled: 0.05,
  turned: 0.12,
  paused: 0.08,
  recentered: 0.2,
  succeeded: 0.25,
  warning: 0.68,
  probe_warning: 0.72,
  partial: 0.78,
  probe_blocked: 0.86,
  blocked: 1.0,
};

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function distanceToForwardSurface(snapshot) {
  const { room, x, y, facing } = snapshot;
  const vector = FACING_VECTORS[facing];
  let distance = 3.2;

  if (vector.x < 0) distance = Math.min(distance, x - room.robotHalfSize);
  if (vector.x > 0) distance = Math.min(distance, room.width - room.robotHalfSize - x);
  if (vector.y < 0) distance = Math.min(distance, y - room.robotHalfSize);
  if (vector.y > 0) distance = Math.min(distance, room.height - room.robotHalfSize - y);

  const obstacle = room.lowObstacle;
  if (vector.x > 0 && y >= obstacle.y1 - 0.35 && y <= obstacle.y2 + 0.35 && obstacle.x1 > x) {
    distance = Math.min(distance, obstacle.x1 - x);
  }
  if (vector.x < 0 && y >= obstacle.y1 - 0.35 && y <= obstacle.y2 + 0.35 && obstacle.x2 < x) {
    distance = Math.min(distance, x - obstacle.x2);
  }
  if (vector.y > 0 && x >= obstacle.x1 - 0.35 && x <= obstacle.x2 + 0.35 && obstacle.y1 > y) {
    distance = Math.min(distance, obstacle.y1 - y);
  }
  if (vector.y < 0 && x >= obstacle.x1 - 0.35 && x <= obstacle.x2 + 0.35 && obstacle.y2 < y) {
    distance = Math.min(distance, y - obstacle.y2);
  }

  return Math.max(0.05, distance);
}

function movementValue(result) {
  return MOVEMENT_VALUES[result] ?? 0.1;
}

export function readNurserySensors(snapshot) {
  const interaction = snapshot.lastInteraction;
  const terrain = new Set(interaction.terrain);
  const echoDistance = distanceToForwardSurface(snapshot);
  const echo = clamp01(1 - echoDistance / 2.1);
  const airflow = terrain.has("airflow_zone") ? 0.82 : 0.12;
  const leftLean = interaction.bodyBalance === "leaning_left";
  const curb = terrain.has("curb_warning_zone");

  const sensors = {
    touch_torso_front: interaction.contactFront ? 1 : interaction.movementResult === "probe_blocked" ? 0.54 : 0.04,
    touch_left_base: interaction.contactLeftBase ? (curb ? 0.88 : 0.76) : leftLean ? 0.16 : 0.06,
    touch_right_base: interaction.contactRightBase ? (curb ? 0.82 : 0.68) : leftLean ? 0.04 : 0.06,
    pressure_capsule_left: leftLean ? 0.84 : airflow > 0.5 ? 0.58 : 0.22,
    pressure_capsule_right: leftLean ? 0.18 : airflow > 0.5 ? 0.42 : 0.22,
    pressure_capsule_front:
      interaction.movementResult === "blocked" || interaction.movementResult === "partial"
        ? 0.72
        : airflow > 0.5
          ? 0.5
          : 0.18,
    pressure_capsule_back: interaction.movementResult === "succeeded" ? 0.2 : 0.18,
    airflow,
    ultrasonic_echo: echo,
    reflection_volume: clamp01(echo * 0.82 + (interaction.contactFront ? 0.18 : 0)),
    movement_result: movementValue(interaction.movementResult),
  };

  return Object.fromEntries(SENSOR_KEYS.map((key) => [key, Number(sensors[key].toFixed(2))]));
}

function compactLayerForValue(key, value) {
  if (key === "movement_result") return value >= 0.95 ? "n" : "";
  return value >= 0.95 ? "n" : "";
}

function compactEventName(key, value) {
  if (key === "movement_result" && value >= 0.95) return "movement_blocked_threshold";
  if (key.startsWith("touch_")) return "threshold_hit";
  return "threshold_hit";
}

function signedDirection(change) {
  if (change >= 0.45) return "rising";
  if (change <= -0.45) return "falling";
  return "steady";
}

export function buildCompactRows({ runId, tick, action, sensors, previousSensors, olderSensors }) {
  const rows = [];

  for (const key of SENSOR_KEYS) {
    const value = sensors[key];
    const nLayer = compactLayerForValue(key, value);
    if (nLayer) {
      rows.push({
        runId,
        tick,
        action,
        layer: nLayer,
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
  if (active.includes("ultrasonic_echo") && active.includes("reflection_volume")) {
    rows.push({
      runId,
      tick,
      action,
      layer: "n^-1",
      event: "cross_sensor_compact_agreement",
      stream: "ultrasonic_echo, reflection_volume",
      value: 2,
      signedChange: 0,
      direction: "agreement",
    });
  }

  return rows;
}

function patternShiftForKey(key, acceleration) {
  if (key === "ultrasonic_echo" || key === "reflection_volume") {
    return acceleration > 0 ? "closing_distance_pattern_shift" : "opening_space_pattern_shift";
  }
  if (key.startsWith("pressure_capsule") || key.includes("base")) {
    return "body_pressure_pattern_shift";
  }
  if (key === "airflow") {
    return "external_pressure_pattern_shift";
  }
  if (key === "movement_result") {
    return "movement_consequence_pattern_shift";
  }
  return "compact_pattern_shift";
}

export { SENSOR_KEYS };
