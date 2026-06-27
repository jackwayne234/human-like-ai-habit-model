const FACING_ORDER = ["north", "east", "south", "west"];

const FACING_VECTORS = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

const ROOM_2_5D = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  rampZone: { id: "ramp", x1: 1.45, y1: 2.0, x2: 2.85, y2: 3.05 },
  ledgeZone: { id: "ledge_drop", x1: 1.45, y1: 4.05, x2: 2.85, y2: 4.75 },
  lowTunnel: { id: "low_tunnel", x1: 1.45, y1: 5.35, x2: 2.85, y2: 6.35 },
  raisedPad: { id: "raised_pressure_pad", x1: 1.45, y1: 7.0, x2: 2.85, y2: 7.8 },
};

const LAYERED_ROOM_2_5D = {
  width: 10,
  height: 10,
  robotHalfSize: 0.34,
  rampZone: { id: "ramp", x1: 6.7, y1: 1.45, x2: 7.7, y2: 2.75 },
  ledgeZone: { id: "ledge_drop", x1: 6.7, y1: 3.7, x2: 7.7, y2: 4.55 },
  lowTunnel: { id: "low_tunnel", x1: 6.7, y1: 5.45, x2: 7.7, y2: 6.55 },
  raisedPad: { id: "raised_pressure_pad", x1: 6.7, y1: 7.35, x2: 7.7, y2: 8.1 },
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
  const steps = 18;
  for (let index = 1; index <= steps; index += 1) {
    const mix = index / steps;
    const point = {
      x: from.x + (to.x - from.x) * mix,
      y: from.y + (to.y - from.y) * mix,
    };
    if (inRect(point, rect, margin)) return true;
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
    overheadContact: false,
    footDropWarning: false,
    probed: false,
    crouched: false,
    blockedBy: "",
    terrain: [],
    bodyBalance: "balanced",
    bodyPitch: "level",
    heightPressure: "quiet",
    verticalEcho: "open",
    note: "",
  };
}

function pushTerrain(interaction, terrainId) {
  if (!interaction.terrain.includes(terrainId)) interaction.terrain.push(terrainId);
}

export function createPhysics25DNurseryWorld({ room = ROOM_2_5D, initialState = {} } = {}) {
  const state = {
    tick: 0,
    x: initialState.x ?? 2.15,
    y: initialState.y ?? 1.0,
    facing: initialState.facing ?? "south",
    posture: "standing",
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

  function applyHeightTerrain(interaction, point = currentPoint()) {
    if (inRect(point, room.rampZone, room.robotHalfSize)) {
      pushTerrain(interaction, "ramp_load_shift");
      interaction.bodyPitch = "nose_up";
      interaction.bodyBalance = "leaning_back";
      interaction.heightPressure = "ramp_pressure";
    }

    if (inRect(point, room.ledgeZone, room.robotHalfSize)) {
      pushTerrain(interaction, "ledge_drop_warning");
      interaction.footDropWarning = true;
      interaction.bodyPitch = "nose_down";
      interaction.heightPressure = "drop_pressure";
      interaction.movementResult =
        interaction.movementResult === "succeeded" ? "drop_warning" : interaction.movementResult;
    }

    if (inRect(point, room.lowTunnel, room.robotHalfSize)) {
      pushTerrain(interaction, "low_clearance_tunnel");
      interaction.verticalEcho = "low_ceiling";
      if (state.posture !== "crouched" || room.lowTunnel.requiresProne) {
        interaction.overheadContact = true;
        interaction.movementResult =
          interaction.movementResult === "succeeded" ? "overhead_blocked" : interaction.movementResult;
        interaction.blockedBy = "low_clearance";
        interaction.note = room.lowTunnel.requiresProne
          ? "upper body still met overhead clearance while crouched"
          : "upper body met a low overhead clearance";
      }
    }

    if (inRect(point, room.raisedPad, room.robotHalfSize)) {
      pushTerrain(interaction, "raised_pressure_surface");
      interaction.heightPressure = "raised_surface_pressure";
      interaction.bodyPitch = "nose_up";
      interaction.contactLeftBase = true;
      interaction.contactRightBase = true;
    }

    interaction.crouched = state.posture === "crouched";
    return interaction;
  }

  function checkForward(distance, action) {
    const from = currentPoint();
    const desired = aheadPoint(distance);
    const min = room.robotHalfSize;
    const maxX = room.width - room.robotHalfSize;
    const maxY = room.height - room.robotHalfSize;
    const interaction = makeInteraction(action, "succeeded");

    if (desired.x < min || desired.x > maxX || desired.y < min || desired.y > maxY) {
      interaction.movementResult = action === "probe_forward" ? "probe_blocked" : "blocked";
      interaction.contactFront = action !== "probe_forward";
      interaction.probed = action === "probe_forward";
      interaction.blockedBy = "room_boundary";
      interaction.note = "front space resisted forward intention";
      return {
        next: action === "probe_forward" ? from : { x: clamp(desired.x, min, maxX), y: clamp(desired.y, min, maxY) },
        interaction,
      };
    }

    if (action === "probe_forward") {
      const probeInteraction = applyHeightTerrain(interaction, desired);
      probeInteraction.probed = true;
      if (segmentTouchesRect(from, desired, room.ledgeZone, room.robotHalfSize * 0.45)) {
        probeInteraction.movementResult = "probe_drop_warning";
        probeInteraction.footDropWarning = true;
        probeInteraction.blockedBy = "ledge_drop";
        probeInteraction.note = "probe found a foot drop before committing body weight";
      } else if (
        segmentTouchesRect(from, desired, room.lowTunnel, room.robotHalfSize * 0.45) &&
        state.posture !== "crouched"
      ) {
        probeInteraction.movementResult = "probe_overhead_warning";
        probeInteraction.overheadContact = true;
        probeInteraction.blockedBy = "low_clearance";
        probeInteraction.note = "probe found low overhead clearance";
      } else if (segmentTouchesRect(from, desired, room.rampZone, room.robotHalfSize * 0.45)) {
        probeInteraction.movementResult = "probe_height_warning";
        probeInteraction.heightPressure = "ramp_pressure";
        probeInteraction.note = "probe found a height-load change";
      }
      return { next: from, interaction: probeInteraction };
    }

    const terrainInteraction = applyHeightTerrain(interaction, desired);
    let next = desired;
    if (terrainInteraction.movementResult === "overhead_blocked") {
      next = {
        x: from.x + (desired.x - from.x) * 0.42,
        y: from.y + (desired.y - from.y) * 0.42,
      };
    }
    return { next, interaction: terrainInteraction };
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
      const result = checkForward(0.78, action);
      state.x = result.next.x;
      state.y = result.next.y;
      interaction = result.interaction;
    } else if (action === "probe_forward") {
      const result = checkForward(0.88, action);
      interaction = result.interaction;
    } else if (action === "crouch_body") {
      state.posture = "crouched";
      interaction.movementResult = "crouched";
      interaction.crouched = true;
      interaction.note = "body lowered before testing overhead clearance";
    } else if (action === "stand_body") {
      state.posture = "standing";
      interaction.movementResult = "stood";
      interaction.note = "body returned to standing posture";
    } else if (action === "recenter_body") {
      interaction.movementResult = "recentered";
      interaction.bodyBalance = "balanced";
      interaction.bodyPitch = "level";
      interaction.note = "body attempted to reduce pitch and load difference";
    } else if (action === "pause") {
      interaction.movementResult = "paused";
    }

    state.lastInteraction = applyHeightTerrain(interaction);
    return snapshot();
  }

  function snapshot() {
    return {
      tick: state.tick,
      x: Number(state.x.toFixed(3)),
      y: Number(state.y.toFixed(3)),
      facing: state.facing,
      posture: state.posture,
      lastAction: state.lastAction,
      lastInteraction: { ...state.lastInteraction, terrain: [...state.lastInteraction.terrain] },
      room,
    };
  }

  return {
    step,
    snapshot,
    room,
  };
}

export { FACING_VECTORS, LAYERED_ROOM_2_5D, ROOM_2_5D };
