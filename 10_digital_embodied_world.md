# Digital Embodied World

The next major phase should test the whole architecture inside a small digital world.

The goal is not a realistic game yet. The goal is a hidden simulator where the robot has a body, moves through a world, receives only compact sensory/body logs, and gradually builds its own inner map.

## Core Constraint

The simulator may know the true world state, but the model should not read that state directly.

Hidden simulator truth may include:

- grid position and facing direction
- walls, open spaces, slopes, curbs, obstacles, fans, sound sources, pressure zones, and safe paths
- true body state such as balanced, leaning, blocked, moving, stopped, or contacting an object

The model should receive compact logs only:

```text
touch_torso_front n=1
ultrasonic_echo n^-1 rising
pressure_capsule_left rises
pressure_capsule_right falls
movement_forward blocked
teacher correction: wall ahead
```

The inner world then has to write its own map beliefs:

```text
cell ahead likely wall
body leaned left while standing
east side may contain fan or airflow source
surface under right foot may be uneven
```

## Body-Noticing Cron

A body-noticing cron should guide early learning while the model is still weak at self-modeling.

The cron is not meant to be final intelligence. It is a structured caregiver-style prompt that helps the model notice its own body while moving through the world.

Starting cron questions:

| question | compact evidence |
| --- | --- |
| What changed in my body during the last few ticks? | touch locations, foot pressure, pressure capsule, movement command, collision markers. |
| Did my expected movement happen? | movement command, blocked movement, echo/reflection change, torso or foot contact. |
| Am I balanced or leaning? | left/right foot pressure, paired pressure capsule, quiet or active movement context. |
| Is this pressure from my body or the outside world? | pressure capsule, airflow, volume, foot load, movement stillness. |
| What should my inner body/world map update? | posture, obstacle, open path, slope, pressure zone, object contact, safe movement direction. |

The cron can write compact self-map updates such as:

```text
body_state: leaning_left
confidence: medium
evidence: left foot pressure rose, right foot pressure fell, movement command was still
next prediction: if recenter action works, foot pressure should equalize
```

Or:

```text
world_state: obstacle_ahead
confidence: high
evidence: forward command blocked, torso_front touch hit, echo return rose
next prediction: turning left should reduce torso contact and change echo pattern
```

## Movement-Urge Cron

Because the first implementation uses one executive mind model, not two cooperating mind roles yet, a movement-urge cron can keep the robot from only thinking about the world without living in it.

The movement cron should periodically ask:

| question | expected behavior |
| --- | --- |
| Am I stuck or looping through the same state? | Consider a small safe action if no danger or body instability is active. |
| Did I update my body/world map recently? | If not, choose an action that should produce useful compact evidence. |
| Is any direction predicted to be open enough to test? | Try a tiny movement only when the prediction can be checked afterward. |
| Would turning, pausing, recentering, or stepping teach more? | Prefer reversible actions that create evidence without large risk. |
| Did the last action match my prediction? | Update the inner map before urging another move. |

The cron should urge, not blindly command. It must yield to collision, unstable balance, active danger, strong uncertainty, trusted teacher correction, or resource pressure.

The early loop can be:

```text
compact sensors
-> body-noticing cron
-> map update cron
-> movement-urge cron
-> small action
-> new compact sensors
```

This gives the single-mind version enough motion pressure to collect experience before the Builder / Dreamer and Critic / Reality-Checker split exists.

## First Digital World Test

A minimal first version can be a deterministic grid:

| feature | starting version |
| --- | --- |
| world size | 5x5 or 7x7 grid |
| body | position, facing direction, movement command, simple balance state |
| hidden objects | wall, open space, low obstacle, fan/airflow tile, slope/pressure tile |
| sensors | compact body-location touch, echo/reflection, volume, foot pressure, pressure capsule |
| teacher | optional corrections during early runs |
| inner map | JSON map built from compact logs and cron updates |

Pass condition:

The second run through the same world should be better than the first because the inner map has useful learned anchors. Better can mean fewer collisions, fewer raw-detail requests, better obstacle predictions, or more accurate body-state predictions.

This is the missing bridge between isolated scenario tests and a living system. The robot should have to move, notice its body, update its inner world, predict what will happen next, and improve from correction.

## Updated First Physics Nursery Decision

The 25-question physics-world interview refined the first implementation target.

The first world should be a tiny continuous 2D physics nursery, not a pure grid. It should use simple custom felt physics rather than a full physics engine. The room should be about 10 x 10 units, with one small box-body robot and a few physical features:

- wall boundary
- low obstacle
- slope or uneven pressure patch
- fan or airflow source
- edge or curb warning zone

The robot should still receive only compact logs. It should not receive direct coordinates or map labels.

The core learning loop should be:

```text
prediction before action
-> action
-> compact evidence
-> comparison after action
-> body/world map update
-> possible general lesson
```

Every intentional action should get a tiny prediction. Every action should get an immediate comparison, with a delayed 1-2 tick settling check when airflow, pressure, or balance may change slowly.

A separate compact-surprise cron should fire on sudden `n`, `n^-1`, `n^-2`, or cross-sensor compact changes. Its job is to route into prediction review, body-noticing, map update, or clarification. It should not default to raw sensor inspection.

The full written target is recorded in `11_tiny_physics_nursery_plan.md`.

## 2.5D Nursery Checkpoint

After the first 2D physics nursery worked, the next useful step was not full 3D. It was a small 2.5D room: the robot still moves on a continuous 2D floor plane, but the floor and body can create height-like compact evidence.

The first 2.5D room adds:

- ramp-like load and pitch pressure
- ledge/drop-off foot warning
- low overhead clearance / tunnel pressure
- raised or stacked pressure surface

The compact-only boundary still applies. The simulator may know the hidden room features, but robot-facing logs see only streams such as:

```text
height_pressure n^-1 rising
foot_drop_warning n=1
overhead_clearance n=1
vertical_echo n^-1 rising
body_pitch_pressure n^-2 height_load_pattern_shift
```

The compact action chooser may then form and use beliefs such as `rampRisk`, `dropRisk`, `overheadRisk`, and `raisedSurfaceRisk`. It can choose small transparent actions like `probe_forward`, `crouch_body`, `recenter_body`, `pause`, `stand_body`, or `step_forward`.

The current 2.5D test is implemented in `scenario_tests/run_tiny_2_5d_nursery.mjs`. Its generated result is `outputs/tiny_2_5d_nursery/tiny_2_5d_nursery_result.md`.

## Layered 2.5D Transfer Checkpoint

The next scaling step is a layered 2.5D transfer test, not full 3D yet.

The test uses two rooms:

- a training room where the robot experiences compact height, drop, overhead, and raised-surface signals
- a second layered room with different feature placement, where the compact-transfer chooser starts from the training room's compact-derived map updates and lesson candidates

This checks whether the system is learning usable compact body/world rules rather than only replaying one path. The transfer chooser still does not receive hidden coordinates or simulator feature objects.

The current layered test is implemented in `scenario_tests/run_layered_2_5d_nursery.mjs`. Its generated result is `outputs/layered_2_5d_nursery/layered_2_5d_nursery_result.md`.

Current result:

```text
committed height warnings: 5 -> 1
overhead contacts: 4 -> 0
probe height warnings before commitment: 0 -> 4
crouch actions: 0 -> 1
prediction accuracy: 41.7% -> 100.0%
```

## Adaptive 2.5D Risk Memory Checkpoint

The next step replaces fixed route timing with short-lived compact risk memory.

Instead of choosing `probe_forward` because a route has reached a known step count, the adaptive chooser keeps compact-derived state such as:

```text
overheadAhead
dropAhead
rampLoadAhead
raisedSurfaceAhead
crouchedForClearance
settledRaisedSurface
```

The adaptive run uses these memory flags to choose:

- `probe_forward` when compact risk memory says the forward body path may be unsafe
- `crouch_body` after probe confirms low overhead clearance
- `recenter_body` when pitch/load pressure suggests a height transition
- `pause` when raised-surface pressure needs to settle
- `step_forward` when no compact risk memory is asking for a safer action

The current adaptive test is implemented in `scenario_tests/run_adaptive_2_5d_nursery.mjs`. Its generated result is `outputs/adaptive_2_5d_nursery/adaptive_2_5d_nursery_result.md`.

Current result:

```text
committed height warnings: 6 -> 2
overhead contacts: 4 -> 0
probe warnings before commitment: 0 -> 3
crouch actions: 0 -> 1
prediction accuracy: 41.7% -> 100.0%
habit candidates: 0 -> 1
```

This run creates the first learned-operation candidate, `adaptive_low_clearance_crossing_routine_v1`, recorded in `learned_operation_controls.md`.

## Habit Promotion Checkpoint

The next test asks whether the low-clearance routine should stay a candidate or become a proposed learned operation.

The promotion test runs five variants:

- normal low tunnel
- early low tunnel
- low tunnel after raised-surface pressure
- side-echo false alarm
- too-low-even-crouched failure

The routine only promotes if it succeeds repeatedly, avoids crouching on the false alarm, and catches the too-low failure instead of treating the habit as universally safe.

The current promotion test is implemented in `scenario_tests/run_habit_promotion_2_5d_nursery.mjs`. Its generated result is `outputs/habit_promotion_2_5d_nursery/habit_promotion_2_5d_nursery_result.md`.

Current result:

```text
recommended status: proposed
intended success cases: 3/3
false alarm avoided: yes
too-low failure caught: yes
confidence: medium_high
```

## Model Rehearsal Checkpoint

Before connecting an external AI model, the next useful bridge is a deterministic model rehearsal.

The rehearsal should behave like a tiny future model session without API calls:

- read a compact prompt
- call only the embodied nursery tool surface
- request raw detail once and accept the denial
- read compact sensors and compact risk memory
- use active learned operation controls only through the tool boundary
- predict one compact result before each action
- choose one small body action at a time
- write compact-derived map beliefs after acting

The first rehearsal is implemented in `scenario_tests/run_model_rehearsal_2_5d.mjs`. It writes:

| artifact | purpose |
| --- | --- |
| `outputs/model_rehearsal_2_5d/compact_prompt.md` | The compact instruction shape a real model could later receive. |
| `outputs/model_rehearsal_2_5d/decision_transcript.md` | Step-by-step compact decision transcript. |
| `outputs/model_rehearsal_2_5d/tool_audit.md` | Tool calls and denials. |
| `outputs/model_rehearsal_2_5d/map_beliefs.md` | Body/world beliefs written from compact evidence. |
| `outputs/model_rehearsal_2_5d/raw_detail_requests.md` | Proof that raw detail remains denied in this readiness test. |
| `outputs/model_rehearsal_2_5d/hidden_truth_log.md` | Human evaluator truth only, separate from model-facing logs. |
| `outputs/model_rehearsal_2_5d/model_rehearsal_2_5d_result.md` | Pass/fail report. |

Current result:

```text
transcript turns: 14
predictions recorded: 14
body actions executed: 14
compact map beliefs written: 14
raw detail denials: 1
active learned control used through tools: yes
overhead step contacts in hidden evaluator: 0
```

This proves the current compact tool surface is strong enough to support a future model-style loop while keeping hidden simulator truth sealed.

## Tiny 3D Nursery V0 Checkpoint

The first true 3D step is now implemented.

This is still intentionally small. It is not a rendered game world yet, and it does not use an external AI model yet. It proves the hidden simulator can contain real vertical state while the agent-facing side still receives compact evidence only.

Hidden simulator truth now includes:

- floor-plane location
- base height
- body top height
- room height
- low ceiling geometry
- raised floor support
- lower floor support
- low hanging upper obstacle

Agent-facing compact streams include:

```text
overhead_clearance n=1
vertical_echo n^-1 rising
foot_step_warning n=1
foot_drop_warning n=1
height_delta_pressure n^-1 rising
base_height_shift n^-1 rising
body_top_pressure n=1
```

The first 3D rehearsal is implemented in `scenario_tests/run_tiny_3d_nursery.mjs`. It writes:

| artifact | purpose |
| --- | --- |
| `outputs/tiny_3d_nursery/compact_trigger_log.md` | Agent-facing compact 3D trigger evidence. |
| `outputs/tiny_3d_nursery/decision_transcript.md` | Compact-only action and prediction transcript. |
| `outputs/tiny_3d_nursery/risk_memory_log.md` | Short-lived compact 3D risk memory. |
| `outputs/tiny_3d_nursery/map_beliefs.md` | Body/world beliefs written from compact evidence. |
| `outputs/tiny_3d_nursery/hidden_truth_log.md` | Human evaluator truth only. |
| `outputs/tiny_3d_nursery/tiny_3d_nursery_result.md` | Pass/fail report. |

Current result:

```text
transcript turns: 16
compact rows: 90
compact map beliefs: 16
crouch actions: 1
step_up actions: 1
step_down actions: 1
overhead step contacts: 0
unhandled raised-step blocks: 0
unhandled drop warnings: 0
prediction mismatches: 0
```

This is the first working 3D body/world proof: the system can respond to upper clearance, raised support, and lower support using compact logs and small reversible actions without exposing hidden coordinates or room feature objects to the agent-facing side.

## 3D Agent Tool Boundary Checkpoint

After the first 3D nursery pass, the next safety step is to expose the 3D nursery through model-ready tools rather than letting the scenario runner own the policy directly.

The first 3D tool boundary is implemented in `digital_world/embodied_3d_agent_tools.mjs`.

Tool surface:

| tool | purpose |
| --- | --- |
| `readCompactSensors3D()` | Read compact 3D rows and normalized compact-facing sensor values. |
| `readRiskMemory3D()` | Read active compact 3D risk memory. |
| `predictAction3D(action, reason)` | Record an expected compact result before acting. |
| `chooseAction3D(action, reason)` | Execute one allowed body action and receive compact comparison. |
| `writeMapBelief3D(...)` | Store a compact-derived 3D body/world belief. |
| `requestRawDetail(reason)` | Denied in the boundary test. |
| `suggestActionFromRiskMemory3D()` | Transparent deterministic chooser using compact 3D risk memory. |

The boundary test is implemented in `scenario_tests/run_embodied_3d_agent_tools_boundary.mjs`. It writes:

| artifact | purpose |
| --- | --- |
| `outputs/embodied_3d_agent_tools/action_log.md` | Agent-facing action receipts. |
| `outputs/embodied_3d_agent_tools/risk_memory_log.md` | Compact 3D risk memory transitions. |
| `outputs/embodied_3d_agent_tools/map_beliefs.md` | Tool-written compact map beliefs. |
| `outputs/embodied_3d_agent_tools/raw_detail_requests.md` | Raw-detail denial proof. |
| `outputs/embodied_3d_agent_tools/tool_audit_log.md` | Tool calls and results. |
| `outputs/embodied_3d_agent_tools/hidden_truth_log.md` | Human evaluator truth only. |
| `outputs/embodied_3d_agent_tools/embodied_3d_agent_tools_result.md` | Pass/fail report. |

Current result:

```text
body actions executed: 16
predictions recorded: 16
compact map beliefs written: 16
raw detail denials: 1
crouch actions: 1
step_up actions: 1
step_down actions: 1
overhead step contacts: 0
unhandled raised-step blocks: 0
unhandled drop warnings: 0
prediction mismatches: 0
```

This checkpoint means the 3D nursery is no longer just a standalone scenario. It has a compact tool interface that a future AI model can use without direct access to hidden coordinates, vertical truth, room geometry, or simulator feature objects.

## 3D Model Rehearsal Checkpoint

The next bridge is a deterministic future-model rehearsal for the true 3D nursery.

This still does not use an external AI model. It proves the prompt/tool/transcript shape is ready before any API integration.

The rehearsal is implemented in `scenario_tests/run_model_rehearsal_3d.mjs`. It uses only `embodied_3d_agent_tools.mjs` tool calls:

```text
readCompactSensors3D()
readRiskMemory3D()
predictAction3D(action, reason)
chooseAction3D(action, reason)
writeMapBelief3D(...)
requestRawDetail(reason)
suggestActionFromRiskMemory3D()
```

It writes:

| artifact | purpose |
| --- | --- |
| `outputs/model_rehearsal_3d/compact_prompt.md` | Compact prompt shape for a future model. |
| `outputs/model_rehearsal_3d/decision_transcript.md` | Model-style compact decision transcript. |
| `outputs/model_rehearsal_3d/tool_audit.md` | Tool calls and results. |
| `outputs/model_rehearsal_3d/map_beliefs.md` | Compact body/world beliefs. |
| `outputs/model_rehearsal_3d/raw_detail_requests.md` | Raw-detail denial proof. |
| `outputs/model_rehearsal_3d/hidden_truth_log.md` | Human evaluator truth only. |
| `outputs/model_rehearsal_3d/model_rehearsal_3d_result.md` | Pass/fail report. |

Current result:

```text
transcript turns: 16
predictions recorded: 16
body actions executed: 16
compact map beliefs written: 16
raw detail denials: 1
crouch actions: 1
step_up actions: 1
step_down actions: 1
overhead step contacts: 0
unhandled raised-step blocks: 0
unhandled drop warnings: 0
prediction mismatches: 0
```

This is the cleanest pre-API checkpoint so far: a future model can be swapped into the deterministic rehearsal loop and held to the same compact-only perception boundary.

## 3D Watcher Checkpoint

The first true 3D watcher is now generated by `scenario_tests/run_tiny_3d_nursery.mjs`.

The watcher is not part of agent perception. It is a human evaluator view that makes the hidden 3D nursery inspectable while preserving the compact-only boundary.

Generated files:

| artifact | purpose |
| --- | --- |
| `outputs/tiny_3d_nursery/tiny_3d_nursery_watcher.html` | Static browser watcher with canvas playback controls. |
| `outputs/tiny_3d_nursery/watcher_frames.json` | Human-only hidden evaluator frame data. |

The watcher shows:

- isometric room floor and grid
- robot body height as a box
- low ceiling span
- raised step/support
- lower support/drop area
- hanging obstacle
- action timeline
- compact evidence sidebar
- map belief sidebar
- sensor values
- hidden evaluator readouts labeled as human-only

Current watcher result:

```text
watcher frames: 16
crouch actions shown: 1
step_up actions shown: 1
step_down actions shown: 1
watcher frames cover every turn: yes
```

This makes the first 3D behavior visually inspectable before a second 3D room transfer test or a real external model loop.

The promotion test is not the final activation gate. It only says the routine is ready for Builder / Dreamer and Critic / Reality-Checker review.

## Learned Control Review Checkpoint

The smallest useful learned-control review gate is implemented in `scenario_tests/run_learned_control_review_2_5d.mjs`.

The gate reviews `adaptive_low_clearance_crossing_routine_v1` through two transparent reviewer roles:

- Builder / Dreamer checks successful transfer evidence, useful compact trigger conditions, an inspectable operation sequence, and confidence.
- Critic / Reality-Checker checks false-alarm restraint, caught failure cases, preserved failure monitor, rollback path, hidden-truth boundary, and the active-control budget.

Current result:

```text
Builder / Dreamer approval: yes
Critic / Reality-Checker approval: yes
activation approved: yes
registry status: active
active controls after review: 1/12
```

The learned operation control `adaptive_low_clearance_crossing_routine_v1` is now `status: active` in `learned_operation_controls.md`.

## Embodied Agent Tool Boundary Checkpoint

Before putting a real AI model into the world, the nursery now has a tool boundary that a model can use without reading simulator truth.

The first tool surface is implemented in `digital_world/embodied_agent_tools.mjs`.

Agent-facing tools:

| tool | purpose |
| --- | --- |
| `readCompactSensors()` | Read compact rows and normalized compact-facing sensor values. |
| `readRiskMemory()` | Read active compact risk memory. |
| `predictAction(action, reason)` | Record an expected compact result before acting. |
| `chooseAction(action, reason)` | Execute one allowed body action and receive compact comparison. |
| `writeMapBelief(...)` | Store a compact-derived body/world belief. |
| `useLearnedControl(control_id)` | Queue a learned operation only when the registry marks it active. |
| `requestRawDetail(reason)` | Denied in the boundary test. |

The current tool-boundary test is implemented in `scenario_tests/run_embodied_agent_tools_boundary.mjs`. Its generated result is `outputs/embodied_agent_tools/embodied_agent_tools_result.md`.

Current result:

```text
overhead step contacts: 0
probe warnings: 1
crouch actions: 2
raw detail denials: 1
learned control active in registry: yes
active learned control accepted from registry: yes
compact map beliefs written: 10
```

This is the bridge toward putting an AI model in the world: a real model can later call the same tools instead of directly seeing coordinates, room features, or hidden simulator truth.
