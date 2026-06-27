const FACING_ORDER_3D = ["north", "east", "south", "west"];

const FACING_VECTORS_3D = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

const ROOM_3D_V0 = {
  width: 10,
  depth: 10,
  height: 4,
  robotHalfSize: 0.34,
  standingHeight: 1.6,
  crouchedHeight: 1.0,
  lowCeilingZone: { id: "low_ceiling_span", x1: 4.4, y1: 2.05, x2: 5.4, y2: 2.65, ceilingZ: 1.12 },
  stepBlock: { id: "raised_step_block", x1: 4.4, y1: 3.75, x2: 5.4, y2: 4.8, z: 0.55 },
  dropGap: { id: "floor_drop_gap", x1: 4.4, y1: 5.75, x2: 5.4, y2: 6.55, z: -0.45 },
  hangingBar: { id: "hanging_bar", x1: 4.4, y1: 7.35, x2: 5.4, y2: 7.9, bottomZ: 0.92 },
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
  const index = FACING_ORDER_3D.indexOf(facing);
  return FACING_ORDER_3D[(index + amount + FACING_ORDER_3D.length) % FACING_ORDER_3D.length];
}

function floorZAt(room, point) {
  if (inRect(point, room.stepBlock, room.robotHalfSize)) return room.stepBlock.z;
  if (inRect(point, room.dropGap, room.robotHalfSize)) return room.dropGap.z;
  return 0;
}

function makeInteraction(action, movementResult = "settled") {
  return {
    action,
    movementResult,
    contactFront: false,
    overheadContact: false,
    footStepWarning: false,
    footDropWarning: false,
    verticalBodyShift: false,
    probed: false,
    crouched: false,
    blockedBy: "",
    terrain: [],
    bodyPitch: "level",
    heightPressure: "quiet",
    verticalEcho: "open",
    note: "",
  };
}

function pushTerrain(interaction, terrainId) {
  if (!interaction.terrain.includes(terrainId)) interaction.terrain.push(terrainId);
}

export function createPhysics3DNurseryWorld({ room = ROOM_3D_V0, initialState = {} } = {}) {
  const state = {
    tick: 0,
    x: initialState.x ?? 4.9,
    y: initialState.y ?? 0.85,
    baseZ: initialState.baseZ ?? 0,
    facing: initialState.facing ?? "south",
    posture: "standing",
    lastAction: "start",
    lastInteraction: makeInteraction("start", "settled"),
  };

  function bodyHeight() {
    return state.posture === "crouched" ? room.crouchedHeight : room.standingHeight;
  }

  function currentPoint() {
    return { x: state.x, y: state.y };
  }

  function aheadPoint(distance) {
    const vector = FACING_VECTORS_3D[state.facing];
    return {
      x: state.x + vector.x * distance,
      y: state.y + vector.y * distance,
    };
  }

  function apply3DTerrain(interaction, point = currentPoint(), targetBaseZ = state.baseZ) {
    const topZ = targetBaseZ + bodyHeight();

    if (inRect(point, room.lowCeilingZone, room.robotHalfSize)) {
      pushTerrain(interaction, "low_ceiling_span");
      interaction.verticalEcho = "low_ceiling";
      if (topZ > room.lowCeilingZone.ceilingZ) {
        interaction.overheadContact = true;
        interaction.movementResult =
          interaction.movementResult === "succeeded" ? "overhead_blocked" : interaction.movementResult;
        interaction.blockedBy = "low_ceiling";
        interaction.note = "body top met a low ceiling span";
      }
    }

    if (inRect(point, room.stepBlock, room.robotHalfSize)) {
      pushTerrain(interaction, "raised_step_block");
      interaction.heightPressure = "step_up_pressure";
      interaction.bodyPitch = "nose_up";
      if (targetBaseZ < room.stepBlock.z - 0.2) {
        interaction.footStepWarning = true;
        interaction.movementResult =
          interaction.movementResult === "succeeded" ? "step_height_blocked" : interaction.movementResult;
        interaction.blockedBy = "step_block";
        interaction.note = "foot path met a raised step before body height changed";
      }
    }

    if (inRect(point, room.dropGap, room.robotHalfSize)) {
      pushTerrain(interaction, "floor_drop_gap");
      interaction.footDropWarning = true;
      interaction.heightPressure = "drop_pressure";
      interaction.bodyPitch = "nose_down";
      if (targetBaseZ > room.dropGap.z + 0.2) {
        interaction.movementResult =
          interaction.movementResult === "succeeded" ? "drop_warning" : interaction.movementResult;
        interaction.blockedBy = "floor_drop";
        interaction.note = "foot path found lower support before body lowered";
      }
    }

    if (inRect(point, room.hangingBar, room.robotHalfSize)) {
      pushTerrain(interaction, "hanging_bar");
      interaction.verticalEcho = "low_hanging_obstacle";
      if (topZ > room.hangingBar.bottomZ) {
        interaction.overheadContact = true;
        interaction.movementResult =
          interaction.movementResult === "succeeded" ? "overhead_blocked" : interaction.movementResult;
        interaction.blockedBy = "hanging_bar";
        interaction.note = "body top met a low hanging obstacle";
      }
    }

    interaction.crouched = state.posture === "crouched";
    return interaction;
  }

  function checkForward(distance, action) {
    const from = currentPoint();
    const desired = aheadPoint(distance);
    const min = room.robotHalfSize;
    const maxX = room.width - room.robotHalfSize;
    const maxY = room.depth - room.robotHalfSize;
    const interaction = makeInteraction(action, "succeeded");

    if (desired.x < min || desired.x > maxX || desired.y < min || desired.y > maxY) {
      interaction.movementResult = action === "probe_forward" ? "probe_blocked" : "blocked";
      interaction.contactFront = action !== "probe_forward";
      interaction.probed = action === "probe_forward";
      interaction.blockedBy = "room_boundary";
      interaction.note = "front space resisted forward intention";
      return {
        next: action === "probe_forward" ? from : { x: clamp(desired.x, min, maxX), y: clamp(desired.y, min, maxY) },
        nextBaseZ: state.baseZ,
        interaction,
      };
    }

    if (action === "probe_forward") {
      const probeInteraction = apply3DTerrain(interaction, desired, floorZAt(room, desired));
      probeInteraction.probed = true;
      if (
        segmentTouchesRect(from, desired, room.lowCeilingZone, room.robotHalfSize * 0.45) &&
        state.baseZ + bodyHeight() > room.lowCeilingZone.ceilingZ
      ) {
        probeInteraction.movementResult = "probe_overhead_warning";
        probeInteraction.overheadContact = true;
        probeInteraction.blockedBy = "low_ceiling";
        probeInteraction.note = "probe found low overhead clearance";
      } else if (segmentTouchesRect(from, desired, room.stepBlock, room.robotHalfSize * 0.45)) {
        probeInteraction.movementResult = "probe_step_warning";
        probeInteraction.footStepWarning = true;
        probeInteraction.blockedBy = "step_block";
        probeInteraction.note = "probe found a raised step";
      } else if (segmentTouchesRect(from, desired, room.dropGap, room.robotHalfSize * 0.45)) {
        probeInteraction.movementResult = "probe_drop_warning";
        probeInteraction.footDropWarning = true;
        probeInteraction.blockedBy = "floor_drop";
        probeInteraction.note = "probe found a lower floor before body commitment";
      } else if (
        segmentTouchesRect(from, desired, room.hangingBar, room.robotHalfSize * 0.45) &&
        state.baseZ + bodyHeight() > room.hangingBar.bottomZ
      ) {
        probeInteraction.movementResult = "probe_overhead_warning";
        probeInteraction.overheadContact = true;
        probeInteraction.blockedBy = "hanging_bar";
        probeInteraction.note = "probe found a low hanging obstacle";
      }
      return { next: from, nextBaseZ: state.baseZ, interaction: probeInteraction };
    }

    const targetFloorZ = floorZAt(room, desired);
    const terrainInteraction = apply3DTerrain(interaction, desired, state.baseZ);
    let next = desired;
    let nextBaseZ = state.baseZ;
    if (terrainInteraction.movementResult === "overhead_blocked" || terrainInteraction.movementResult === "step_height_blocked") {
      next = {
        x: from.x + (desired.x - from.x) * 0.42,
        y: from.y + (desired.y - from.y) * 0.42,
      };
      nextBaseZ = state.baseZ;
    } else if (terrainInteraction.movementResult === "drop_warning") {
      next = {
        x: from.x + (desired.x - from.x) * 0.56,
        y: from.y + (desired.y - from.y) * 0.56,
      };
      nextBaseZ = state.baseZ;
    } else {
      nextBaseZ = targetFloorZ;
    }
    return { next, nextBaseZ, interaction: terrainInteraction };
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
      const result = checkForward(0.74, action);
      state.x = result.next.x;
      state.y = result.next.y;
      state.baseZ = result.nextBaseZ;
      interaction = result.interaction;
    } else if (action === "probe_forward") {
      const result = checkForward(0.84, action);
      interaction = result.interaction;
    } else if (action === "crouch_body") {
      state.posture = "crouched";
      interaction.movementResult = "crouched";
      interaction.crouched = true;
      interaction.verticalBodyShift = true;
      interaction.note = "body lowered before testing vertical clearance";
    } else if (action === "stand_body") {
      state.posture = "standing";
      interaction.movementResult = "stood";
      interaction.verticalBodyShift = true;
      interaction.note = "body returned to standing height";
    } else if (action === "step_up") {
      const ahead = aheadPoint(0.62);
      if (inRect(ahead, room.stepBlock, room.robotHalfSize)) {
        state.baseZ = room.stepBlock.z;
        interaction.movementResult = "stepped_up";
        interaction.verticalBodyShift = true;
        interaction.heightPressure = "step_up_pressure";
        interaction.bodyPitch = "nose_up";
        interaction.note = "base height lifted onto a raised support";
      } else {
        interaction.movementResult = "step_up_unneeded";
        interaction.note = "no raised support was compactly confirmed ahead";
      }
    } else if (action === "step_down") {
      const ahead = aheadPoint(0.62);
      if (inRect(ahead, room.dropGap, room.robotHalfSize)) {
        state.baseZ = room.dropGap.z;
        interaction.movementResult = "stepped_down";
        interaction.verticalBodyShift = true;
        interaction.heightPressure = "drop_pressure";
        interaction.bodyPitch = "nose_down";
        interaction.note = "base height lowered toward compact drop evidence";
      } else {
        interaction.movementResult = "step_down_unneeded";
        interaction.note = "no lower support was compactly confirmed ahead";
      }
    } else if (action === "recenter_body") {
      interaction.movementResult = "recentered";
      interaction.bodyPitch = "level";
      interaction.note = "body attempted to settle pitch and load difference";
    } else if (action === "pause") {
      interaction.movementResult = "paused";
    }

    state.lastInteraction = apply3DTerrain(interaction);
    return snapshot();
  }

  function snapshot() {
    return {
      tick: state.tick,
      x: Number(state.x.toFixed(3)),
      y: Number(state.y.toFixed(3)),
      baseZ: Number(state.baseZ.toFixed(3)),
      topZ: Number((state.baseZ + bodyHeight()).toFixed(3)),
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

export { FACING_VECTORS_3D, ROOM_3D_V0 };
