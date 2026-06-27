const FACING_ORDER = ["north", "east", "south", "west"];

const FACING_VECTORS = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

const ROOM = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  lowObstacle: { id: "low_obstacle", x1: 3.45, y1: 0.05, x2: 4.2, y2: 0.85 },
  slopePatch: { id: "slope_patch", x1: 2.7, y1: 1.55, x2: 4.65, y2: 3.05 },
  fanZone: { id: "fan_airflow", x1: 2.35, y1: 2.35, x2: 4.75, y2: 4.05 },
  curbZone: { id: "curb_warning", x1: 2.45, y1: 4.05, x2: 4.85, y2: 4.85 },
  fanSource: { x: 1.0, y: 3.0 },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function inRect(point, rect, margin = 0) {
  return (
    point.x >= rect.x1 - margin &&
    point.x <= rect.x2 + margin &&
    point.y >= rect.y1 - margin &&
    point.y <= rect.y2 + margin
  );
}

function segmentTouchesRect(from, to, rect, margin = 0) {
  const steps = 16;
  for (let index = 1; index <= steps; index += 1) {
    const mix = index / steps;
    const point = {
      x: from.x + (to.x - from.x) * mix,
      y: from.y + (to.y - from.y) * mix,
    };
    if (inRect(point, rect, margin)) {
      return true;
    }
  }
  return false;
}

function rotateFacing(facing, amount) {
  const index = FACING_ORDER.indexOf(facing);
  return FACING_ORDER[(index + amount + FACING_ORDER.length) % FACING_ORDER.length];
}

function makeInteraction(action, movementResult = "settled") {
  return {
    action,
    movementResult,
    contactFront: false,
    contactLeftBase: false,
    contactRightBase: false,
    probed: false,
    blockedBy: "",
    terrain: [],
    bodyBalance: "balanced",
    externalPressure: "quiet",
    note: "",
  };
}

function pushTerrain(interaction, terrainId) {
  if (!interaction.terrain.includes(terrainId)) {
    interaction.terrain.push(terrainId);
  }
}

export function createPhysicsNurseryWorld() {
  const state = {
    tick: 0,
    x: 2.0,
    y: 0.72,
    facing: "north",
    lastAction: "start",
    lastInteraction: makeInteraction("start", "settled"),
  };

  function currentPoint() {
    return { x: state.x, y: state.y };
  }

  function aheadPoint(distance) {
    const vector = FACING_VECTORS[state.facing];
    return {
      x: state.x + vector.x * distance,
      y: state.y + vector.y * distance,
    };
  }

  function applyTerrain(interaction) {
    const point = currentPoint();
    if (inRect(point, ROOM.slopePatch, ROOM.robotHalfSize)) {
      pushTerrain(interaction, "uneven_pressure_patch");
      interaction.bodyBalance = "leaning_left";
    }
    if (inRect(point, ROOM.fanZone, ROOM.robotHalfSize)) {
      pushTerrain(interaction, "airflow_zone");
      interaction.externalPressure = "left_to_right_airflow";
    }
    if (inRect(point, ROOM.curbZone, ROOM.robotHalfSize)) {
      pushTerrain(interaction, "curb_warning_zone");
      interaction.contactLeftBase = true;
      interaction.movementResult =
        interaction.movementResult === "succeeded" ? "warning" : interaction.movementResult;
    }
    return interaction;
  }

  function checkForward(distance, action) {
    const from = currentPoint();
    const desired = aheadPoint(distance);
    const min = ROOM.robotHalfSize;
    const maxX = ROOM.width - ROOM.robotHalfSize;
    const maxY = ROOM.height - ROOM.robotHalfSize;
    const interaction = makeInteraction(action, "succeeded");

    if (desired.x < min || desired.x > maxX || desired.y < min || desired.y > maxY) {
      interaction.movementResult = action === "probe_forward" ? "probe_blocked" : "blocked";
      interaction.contactFront = action !== "probe_forward";
      interaction.probed = action === "probe_forward";
      interaction.blockedBy = "room_boundary";
      interaction.note = "front space resisted forward intention";
      return {
        next:
          action === "probe_forward"
            ? from
            : { x: clamp(desired.x, min, maxX), y: clamp(desired.y, min, maxY) },
        interaction,
      };
    }

    if (segmentTouchesRect(from, desired, ROOM.lowObstacle, ROOM.robotHalfSize * 0.55)) {
      interaction.movementResult = action === "probe_forward" ? "probe_warning" : "partial";
      interaction.contactLeftBase = state.facing === "east" || state.facing === "south";
      interaction.contactRightBase = state.facing === "west" || state.facing === "north";
      interaction.probed = action === "probe_forward";
      interaction.blockedBy = "low_obstacle";
      interaction.note = "base met a low object before torso contact";
      if (action === "probe_forward") {
        return { next: from, interaction };
      }
      return {
        next: {
          x: from.x + (desired.x - from.x) * 0.35,
          y: from.y + (desired.y - from.y) * 0.35,
        },
        interaction,
      };
    }

    const terrainInteraction = applyTerrain(interaction);
    if (action === "probe_forward" && inRect(desired, ROOM.curbZone, ROOM.robotHalfSize)) {
      terrainInteraction.movementResult = "probe_warning";
      terrainInteraction.contactLeftBase = true;
      terrainInteraction.contactRightBase = true;
      terrainInteraction.probed = true;
      terrainInteraction.blockedBy = "curb_warning";
      terrainInteraction.note = "probe found a base warning before committing body weight";
      return { next: from, interaction: terrainInteraction };
    }

    return { next: action === "probe_forward" ? from : desired, interaction: terrainInteraction };
  }

  function step(action) {
    state.tick += 1;
    state.lastAction = action;
    let interaction = makeInteraction(action, "settled");

    if (action === "turn_left") {
      state.facing = rotateFacing(state.facing, -1);
      interaction.movementResult = "turned";
    } else if (action === "turn_right") {
      state.facing = rotateFacing(state.facing, 1);
      interaction.movementResult = "turned";
    } else if (action === "step_forward") {
      const result = checkForward(0.82, action);
      state.x = result.next.x;
      state.y = result.next.y;
      interaction = result.interaction;
    } else if (action === "probe_forward") {
      const result = checkForward(0.92, action);
      state.x = result.next.x;
      state.y = result.next.y;
      interaction = result.interaction;
    } else if (action === "recenter_body") {
      interaction.movementResult = "recentered";
      interaction.bodyBalance = "balanced";
      interaction.note = "body attempted to reduce left/right pressure difference";
    } else if (action === "pause") {
      interaction.movementResult = "paused";
    }

    state.lastInteraction = applyTerrain(interaction);
    return snapshot();
  }

  function snapshot() {
    return {
      tick: state.tick,
      x: Number(state.x.toFixed(3)),
      y: Number(state.y.toFixed(3)),
      facing: state.facing,
      lastAction: state.lastAction,
      lastInteraction: { ...state.lastInteraction, terrain: [...state.lastInteraction.terrain] },
      room: ROOM,
    };
  }

  return {
    step,
    snapshot,
    room: ROOM,
  };
}

export { FACING_VECTORS };
