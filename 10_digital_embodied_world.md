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
