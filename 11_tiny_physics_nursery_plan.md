# Tiny Physics Nursery Implementation Plan

This plan turns the digital embodied world interview into the first concrete implementation target.

The first world should be a tiny continuous 2D physics nursery. It should be small enough to inspect, but physical enough that the robot can learn from movement, pressure, contact, airflow, and prediction errors.

## Design Summary

| choice | decision |
| --- | --- |
| world type | Tiny 2D physics nursery. |
| physics style | Simple custom felt physics, not a full physics engine yet. |
| room scale | Continuous 10 x 10 unit room. |
| body | Small box-body with front/back/left/right orientation, base/foot sensors, torso-front contact, and pressure capsules. |
| movement | Discrete intention, continuous consequence. |
| perception | Compact `n`, `n^-1`, and `n^-2` logs only; no direct coordinates or simulator truth. |
| hidden truth | Separate debug/evaluation log for simulator state. |
| first success measure | Better predictions and safer movement on run 2. |

## Hidden Simulator

The simulator may know the full world state:

- robot position, facing, last command, velocity-like movement consequence, and true contact state
- wall boundaries
- one low obstacle
- one slope or uneven pressure patch
- one fan or airflow source
- one edge or curb warning zone
- true body state such as balanced, leaning, blocked, pushed, probing, or partially moved

The robot must not read that state directly. Hidden truth exists only for debugging, evaluation, and pass/fail measurement.

## First Room

The first room should be one small 10 x 10 continuous space.

Required physical features:

| feature | purpose | intended compact lesson |
| --- | --- | --- |
| wall boundary | First physical contact lesson. | Intended forward movement can fail because the world pushes back. |
| low obstacle | Body-location distinction. | Foot/base contact and partial movement can happen without torso-front collision. |
| slope or uneven floor | Balance and terrain. | Pressure differential can come from floor shape without hard collision. |
| fan or airflow source | Outside pressure. | Airflow/capsule pressure can change while foot/base load stays stable. |
| edge or curb | Safe caution and probing. | Foot/base warning can happen before danger, so probing is useful. |

The first feature the robot should encounter is the wall boundary.

## Robot Body

Use a simple box-body for v1.

Minimum hidden body state:

- `x`
- `y`
- `facing`
- `last_action`
- `movement_result`
- `body_balance`
- `contact_front`
- `contact_left_base`
- `contact_right_base`
- `air_pressure_direction`

Minimum compact-facing body streams:

- `touch_torso_front`
- `touch_left_base`
- `touch_right_base`
- `pressure_capsule_left`
- `pressure_capsule_right`
- `pressure_capsule_front`
- `pressure_capsule_back`
- `airflow`
- `ultrasonic_echo`
- `reflection_volume`
- `movement_result`

## Action Set

The initial action set should stay small:

```text
turn_left
turn_right
step_forward
pause
recenter_body
probe_forward
```

The robot chooses discrete actions. The simulator resolves each action into continuous consequences such as successful movement, partial movement, sliding, blocked movement, pressure shift, airflow change, or contact.

## Compact Logs

The robot receives only compact logs.

Example wall contact:

```text
movement_command step_forward
movement_result blocked
touch_torso_front n=1
ultrasonic_echo n^-1 rising
reflection_volume n^-1 rising
n^-2 closing_distance_pattern_shift
```

Example low obstacle:

```text
movement_command step_forward
movement_result partial
touch_left_base n^-1 rising
touch_right_base quiet
touch_torso_front quiet
n^-2 low_obstacle_contact_shift
```

Example slope:

```text
movement_command step_forward
movement_result succeeded
pressure_capsule_left n^-1 rising
pressure_capsule_right n^-1 falling
touch_torso_front quiet
n^-2 balance_pattern_shift
```

Example fan:

```text
movement_command pause
airflow n^-1 rising
pressure_capsule_front n^-1 rising
touch_left_base quiet
touch_right_base quiet
n^-2 external_pressure_pattern_shift
```

## Cron Loop

The first nursery should use caregiver-style deterministic routines as scaffolding.

### Prediction-Before-Action Cron

Every intentional action gets one tiny prediction before it runs.

Example:

```text
action: probe_forward
prediction: front space may be open
expected_compact_result: weak echo change, no torso contact, no base warning
```

### Comparison-After-Action Cron

Run immediately after every intentional action, then again after 1-2 ticks if slow settling may matter.

It should ask:

- What did I predict?
- What compact evidence arrived?
- Did movement happen, partially happen, or fail?
- Did body pressure, contact, airflow, or echo change?
- Should this update self-map, world-map, or both?

### Body-Noticing Cron

Run every 3 ticks, plus after surprise or collision.

It should write both self-map and world-map updates.

Example:

```text
self_map_update:
  body_state: leaning_left
  confidence: medium
  evidence: pressure_capsule_left rose, pressure_capsule_right fell
  next_prediction: recenter_body should reduce pressure difference
```

```text
world_map_update:
  local_floor: possible_slope_or_uneven_patch
  confidence: medium
  evidence: pressure changed during movement without torso collision
  next_prediction: crossing same patch should repeat left/right pressure shift
```

### Compact-Surprise Cron

Add a separate sudden compact-surprise cron for spikes and pattern shifts in `n`, `n^-1`, and `n^-2`.

It should fire on:

- sudden `n` threshold hit
- sharp `n^-1` rate jump
- `n^-2` pattern shift
- cross-sensor compact agreement

Its first job is to route into the prediction/comparison/body-map loop, not to immediately request raw data.

### Movement-Urge Cron

Movement urge should speak only when the robot is stuck, looping, under-exploring, or has processed a sudden compact surprise and still needs evidence.

It should yield to:

- active collision
- unstable balance
- strong uncertainty
- trusted teacher correction
- resource pressure
- unresolved prediction mismatch

Preferred urges:

- `probe_forward` when uncertain but stable
- `recenter_body` when pressure suggests leaning
- `turn_left` or `turn_right` after blocked forward movement
- `pause` after airflow or pressure surprise

## General Lesson Rules

The lesson loop should be:

```text
prediction before action
-> action
-> compact evidence
-> comparison after action
-> body/world map update
-> possible general lesson
```

One event can create a hypothesis. A reusable rule should require repeated evidence, trusted teacher confirmation, or strong cross-sensor agreement.

Example hypothesis:

```text
if movement_forward blocked + touch_torso_front n=1 + echo/reflection rising,
then a solid obstacle may be ahead
```

Example reusable rule candidate:

```text
when forward movement is blocked and torso-front contact rises with echo/reflection,
mark ahead as likely wall or tall obstacle before attempting another forward step
```

## File And Module Plan

First implementation should add:

| path | purpose |
| --- | --- |
| `digital_world/physics_nursery_world.mjs` | Hidden room definition and custom felt-physics update. |
| `digital_world/physics_nursery_sensors.mjs` | Converts hidden state into normalized compact-facing sensor values. |
| `digital_world/physics_nursery_crons.mjs` | Prediction, comparison, body-noticing, compact-surprise, and movement-urge routines. |
| `scenario_tests/run_tiny_physics_nursery.mjs` | Runs two passes through the same nursery and compares improvement. |
| `outputs/tiny_physics_nursery/hidden_truth_log.md` | Debug/evaluation truth; never read by robot perception. |
| `outputs/tiny_physics_nursery/compact_trigger_log.md` | Robot-facing `n`, `n^-1`, and `n^-2` compact perception. |
| `outputs/tiny_physics_nursery/prediction_comparison_log.md` | Prediction-before-action and comparison-after-action records. |
| `outputs/tiny_physics_nursery/body_world_map_updates.md` | Self-map and world-map updates from cron routines. |
| `outputs/tiny_physics_nursery/lesson_candidates.md` | Hypotheses and reusable rule candidates. |
| `outputs/tiny_physics_nursery/tiny_physics_nursery_result.md` | Pass/fail report comparing run 1 and run 2. |

## Pass Conditions

The first test should pass when run 2 improves over run 1.

Improvement can include:

- fewer torso-front wall collisions
- better `probe_forward` use before edge or low obstacle commitment
- better prediction accuracy before actions
- fewer unresolved prediction mismatches
- better distinction between wall, low obstacle, slope, fan, and edge
- more accurate self-map states such as balanced, leaning, blocked, or externally pushed
- no direct position/map coordinates in the robot-facing logs
- hidden truth present only in the evaluation log

## First Implementation Step

Start with a deterministic scripted action sequence for run 1 so the world can be tested without building a full executive mind yet.

Then run the same room again with the learned map updates from run 1 loaded as prior beliefs. The second run should use those beliefs to choose safer probes, turns, pauses, or recentering actions.

Only after that deterministic two-run loop works should the single executive mind model begin choosing actions dynamically.

## 2.5D Extension

The next extension keeps the first room inspectable and avoids full 3D. The robot still navigates a continuous 2D plane, but the body receives height-like compact pressure streams.

New hidden physical features:

| feature | purpose | compact lesson |
| --- | --- | --- |
| ramp-like region | Introduces pitch and load shift without collision. | Recenter when height pressure suggests body pitch. |
| ledge/drop warning | Teaches probing before foot/base commitment. | Foot warning can arrive before a full-body mistake. |
| low overhead clearance | Teaches body posture as an action. | Duck/crouch can reduce upper-body contact risk. |
| raised pressure surface | Separates stable height load from collision. | Pause or settle can clarify raised load. |

New compact-facing streams:

| stream | role |
| --- | --- |
| `height_pressure` | General height/load pressure. |
| `foot_drop_warning` | Foot/base warning before a drop or ledge. |
| `overhead_clearance` | Low-clearance pressure on upper body. |
| `vertical_echo` | Non-contact vertical clearance clue. |
| `body_pitch_pressure` | Nose-up or nose-down body load clue. |
| `ramp_load_shift` | Specific compact load shift from ramp-like floor. |

New actions:

| action | purpose |
| --- | --- |
| `crouch_body` | Lower body height before low-clearance movement. |
| `stand_body` | Return to normal posture after low-clearance risk. |

The first 2.5D implementation is:

| path | purpose |
| --- | --- |
| `digital_world/physics_2_5d_nursery_world.mjs` | Hidden 2.5D room and felt-physics consequences. |
| `digital_world/physics_2_5d_nursery_sensors.mjs` | Compact stream conversion for height-like body evidence. |
| `digital_world/physics_2_5d_action_chooser.mjs` | Transparent compact-belief chooser for probing, crouching, recentering, pausing, and stepping. |
| `scenario_tests/run_tiny_2_5d_nursery.mjs` | Two-pass comparison test for naive movement vs compact-guided 2.5D action. |
| `outputs/tiny_2_5d_nursery/` | Generated result logs and watcher artifacts. |

Current pass result:

| metric | run 1 | run 2 |
| --- | --- | --- |
| committed height warnings | 6 | 2 |
| overhead contacts | 4 | 0 |
| probe height warnings before commitment | 0 | 3 |
| crouch actions | 0 | 1 |
| prediction accuracy | 40.0% | 100.0% |

## Layered 2.5D Transfer Test

The next scale-up should keep the compact-only boundary while testing transfer to a second room. This is still not full 3D. It is a wider 2.5D proving ground where the robot must reuse compact height lessons in a new layout.

Implementation:

| path | purpose |
| --- | --- |
| `LAYERED_ROOM_2_5D` in `digital_world/physics_2_5d_nursery_world.mjs` | Second hidden room layout with different feature placement. |
| configurable `createPhysics25DNurseryWorld(...)` | Allows the same world logic to run the original room or the layered transfer room. |
| `scenario_tests/run_layered_2_5d_nursery.mjs` | Trains on compact lessons from the first room, then compares naive and compact-transfer runs in the layered room. |
| `outputs/layered_2_5d_nursery/` | Generated transfer result logs and watcher artifacts. |

Current layered transfer result:

| metric | layered naive | layered transfer |
| --- | --- | --- |
| committed height warnings | 5 | 1 |
| overhead contacts | 4 | 0 |
| probe height warnings before commitment | 0 | 4 |
| crouch actions | 0 | 1 |
| prediction accuracy | 41.7% | 100.0% |

This is the preferred bridge before full 3D: prove compact rules can transfer across layered 2.5D rooms before adding full 3D collision, camera, pitch/yaw, occlusion, and body-volume complexity.
