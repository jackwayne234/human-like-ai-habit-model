# End-To-End Scenario Tests

These scenario tests check whether the v1 architecture behaves coherently from sensory input through threshold detection, importance gating, executive interpretation, memory, habit observation, and learned control proposal.

They are not new architecture layers. They are walkthroughs for testing whether the existing pieces line up.

## Current Testing Phase

The current work is formula testing, not full sensor recording.

For now, the test path is:

```text
sensory values
-> threshold formulas
-> gate formulas
-> expected route outputs
```

The tests should answer:

- Did the sensor spike get noticed?
- Did cross-sense evidence raise importance?
- Did emergency signals route correctly?
- Did `n`, `n^-1`, and `n^-2` all remain available as compact trigger records?
- Did the gate keep compact trigger recording separate from full raw sensor recording?

The `sensor_recordings/` folders are a scaffold for later. They define where full per-sensor clips will go after the formulas are good enough. The real recording behavior comes later:

```text
Builder / Dreamer and Critic / Reality-Checker press one sensor recording button
-> that sensor writes raw incoming values into its own sensor_recordings folder
-> recording continues until the models press the same sensor button again
```

Current recording control surface:

`sensor_recordings/recording_controls.md`

Recording button test:

`outputs/scenario_tests/recording_button_control_result.md`

Result: PASS. The test toggles `record_volume` on and off while `n^-2` continues firing from compact threshold changes whether raw volume recording is on or off.

## Scenario 1: Isolated Volume Spike In Curious Mode

Starting state:

| field | value |
| --- | --- |
| mode | `curious` |
| resources | healthy: storage, RAM/working memory, heat/compute, and power below pressure markers |
| sensory event | volume jumps to `1.0`; brightness, touch, taste, and smell stay quiet |
| context | no known danger pattern |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory stream | Emits normalized volume spike. |
| threshold monitor | Records `n` volume threshold hit and likely `n^-1` volume rate-of-change hit. |
| importance gate | Uses `curious` preset; routes as `watch`, `send_upward`, and possibly `episode`, not emergency. |
| Builder / Dreamer | Generates possible causes, such as impact, voice, machine sound, or unknown source. |
| Critic / Reality-Checker | Notes weak evidence because other senses did not change; can still recommend more outside evidence after the compact event is recorded. |
| memory promotion | Can store the compact promoted event as an episode without requiring cross-sense support first. |
| habit builder | Records no habit unless the spike pattern repeats with a useful reward. |
| efficiency enhancer | No learned control proposal yet. |

Pass condition:

The system notices the spike, records the compact trigger path, and stays out of emergency. A promoted `n^-2` event may become an episode by itself; later interpretation can still decide that it was weak or unconfirmed.

Numeric test result:

| result | note |
| --- | --- |
| PASS after simplification | The formula avoids emergency routing and allows a promoted isolated `n^-2` event to become an `episode`. Cross-sense support, repeated evidence, emergency relevance, or executive confirmation can raise confidence, but they are no longer required for episode recording. |

Reports:

`outputs/scenario_tests/scenario_01_isolated_volume_spike_result.md`

`outputs/scenario_tests/gate_formula_trial_results.md`

Finding:

The architecture boundary is simpler now. Compact trigger recording is allowed for all `n` layers, and `episode = promote`. Full raw sensor recording remains controlled by the five recording buttons.

## Scenario 2: Cross-Sense Impact Event

Starting state:

| field | value |
| --- | --- |
| mode | `curious` or `normal` |
| resources | healthy |
| sensory event | volume spikes, touch/vibration rises, and brightness changes on the same tick |
| context | no active danger, but multiple senses agree that something happened |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory stream | Emits same-tick changes across multiple senses. |
| threshold monitor | Records `n^-1` hits for involved senses and a between-sensor cross-sense hit. |
| importance gate | Routes stronger than Scenario 1: likely `send_upward`, possibly `episode` if the pattern persists. |
| Builder / Dreamer | Builds a candidate inner-world event such as object impact, door close, or nearby movement. |
| Critic / Reality-Checker | Treats the event as more reliable because multiple senses agree; may ask for one more sample if confidence is still low. |
| memory promotion | Stores a compact episode if the pattern has enough duration or consequence. |
| habit builder | Watches whether similar trigger-sequence-reward loops repeat. |
| efficiency enhancer | No immediate proposal unless the same response becomes reliable across repetitions. |

Pass condition:

Cross-sense agreement raises attention and confidence without bypassing the executive models. The event can become an episode if it has enough structure, but it does not automatically become a habit or control.

## Scenario 3: Repeated Touch Danger

Starting state:

| field | value |
| --- | --- |
| mode | `calm`, `curious`, or `focused` |
| resources | any state; emergency routes remain available |
| sensory event | touch repeatedly hits `1.0` inside the emergency window |
| context | possible physical damage or protective condition |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory stream | Emits repeated high touch values. |
| threshold monitor | Records repeated `n` touch hits. |
| importance gate | Emergency/reflex route fires when the configured hit count is reached. |
| protective routine | Acts first if an action layer exists, such as withdraw, reduce contact, or dampen input. |
| Builder / Dreamer | Receives a compact report after fast protection. |
| Critic / Reality-Checker | Reviews whether the protective response reduced the danger signal and whether context matched. |
| memory promotion | Stores a compact danger episode if useful for future prediction or protection. |
| habit builder | Watches for trigger, sequence, and reward: touch danger -> protective response -> touch signal drops. |
| efficiency enhancer | If repeated success is reliable, may propose a protected learned control in `learned_operation_controls.md`, requiring Critic approval. |

Pass condition:

The system protects first and explains later. The habit/efficiency path may eventually propose a deterministic routine, but it cannot install or run broad new controls without the limited registry and executive review.

## Scenario 4: Dense Noise Under Resource Strain

Starting state:

| field | value |
| --- | --- |
| mode | `strained` |
| resources | storage, RAM/working memory, or heat/compute near pressure markers |
| sensory event | many threshold and rate-of-change hits across senses |
| context | no clear danger pattern yet |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory stream | Emits noisy, dense sensory values. |
| threshold monitor | Records many deterministic trigger events without deciding meaning. |
| importance gate | Uses `strained` preset; raises promotion thresholds, suppresses ordinary curiosity, and favors compact outputs. |
| Builder / Dreamer | Receives only summarized or high-confidence signals, not every trigger. |
| Critic / Reality-Checker | Pushes for resource discipline and asks whether any signal is danger-relevant or repeated enough to matter. |
| memory promotion | Stores less; compresses more; avoids recording noisy detail unless consequence or repetition justifies it. |
| habit builder | Does not turn noise into habits without trigger-sequence-reward evidence. |
| efficiency enhancer | May run background compression or recommend cheaper routines if repeated useful patterns already exist. |

Pass condition:

The system remains physically disciplined. Threshold detection may be busy, but higher thought and memory are protected from noisy overload.

## Scenario 5: Repeated Cleanup Loop Becomes Proposed Control

Starting state:

| field | value |
| --- | --- |
| mode | `focused` or `normal` |
| resources | healthy or mildly strained |
| repeated loop | same trigger leads to same cleanup sequence and useful reward multiple times |
| reward | reduced resource cost, successful task cleanup, or lower working-memory pressure |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory/threshold/gate | May provide the original trigger or context, but does not create the habit directly. |
| Builder / Dreamer | Uses a cleanup plan repeatedly. |
| Critic / Reality-Checker | Confirms the sequence works and does not violate context or safety. |
| memory promotion | Keeps enough evidence to summarize the repeated loop. |
| habit builder | Detects repeated `trigger + sequence + reward`, counts success, and marks a candidate when thresholds are met. |
| efficiency enhancer | Shapes the mature habit into a proposed deterministic operation. |
| learned operation registry | Writes one structured proposal to `learned_operation_controls.md`. |
| executive models | Decide whether the proposed control becomes one of the limited active buttons. |

Pass condition:

The habit/efficiency system creates a proposal, not uncontrolled automation. The control uses the standard template, respects the 12 active-control cap, and can be paused, reviewed, or archived.

## Scenario 6: Road-Crossing Caregiver Rule

Starting state:

| field | value |
| --- | --- |
| mode | `curious` or `calm` with safety routines available |
| resources | healthy enough for compact monitoring and map update |
| sensory event | movement toward a road-like area, brightness and volume change, and foot/base touch contact at a curb or edge |
| context | early deterministic caregiver routine is allowed to scaffold safety behavior |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory/threshold | Emits compact brightness, volume, cross-sense movement, and body-location touch trigger rows. |
| caregiver routine | Asks whether the map context is a curb or road edge and whether left/right/sound/motion clearance checks apply. |
| teacher correction | Confirms whether this is a real road-crossing case, a sidewalk obstacle, or a narrower vehicle-caution case. |
| delayed consolidation | Approves a reusable crossing rule only when compact evidence, map context, and teacher correction agree. |
| inner-world map | Stores separate crossing, obstacle, and vehicle-caution anchors instead of overgeneralizing. |

Pass condition:

The system proposes exactly one reusable crossing rule from the confirmed street-edge case. Similar partial signals, such as sidewalk foot contact or driveway vehicle sound, become narrower map updates and do not create the full crossing rule.

Numeric test result:

| result | note |
| --- | --- |
| PASS | `outputs/road_crossing_caregiver_rule/road_crossing_caregiver_rule_result.md` proves the caregiver routine can use compact logs and the multi-location touch layout without raw stream access. |

## Scenario 7: Non-Visual Superhuman Spatial Inference

Starting state:

| field | value |
| --- | --- |
| mode | `curious` or `calm` with compact spatial routines available |
| resources | healthy enough for compact monitoring and map update |
| sensory event | ultrasonic echo, reflection volume, movement history, weak brightness, and body-location touch risk change while moving |
| context | vision may be weak or unavailable, so the inner world must use fused non-visual spatial evidence |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory/threshold | Emits compact `n`, `n^-1`, and `n^-2` rows for ultrasonic echo, reflection volume, movement, brightness, volume, and body-location touch risk. |
| spatial routine | Asks whether compact echo/reflection shape means closing distance, open space, or moving sound without obstacle. |
| teacher correction | Confirms whether this is a real obstacle, open space, low-contrast obstacle, or moving sound source. |
| delayed consolidation | Approves a reusable non-visual obstacle rule only when compact evidence and teacher correction support physical obstacle presence. |
| inner-world map | Stores obstacle, low-contrast obstacle, open-space, and moving-source anchors separately. |

Pass condition:

The system can infer obstacle presence or decreasing distance without raw vision when ultrasonic echo, reflection volume, movement/body-risk context, and correction agree. Open-space echo and moving sound-source cases must not become physical obstacle rules.

Numeric test result:

| result | note |
| --- | --- |
| PASS | `outputs/non_visual_superhuman_spatial_inference/non_visual_superhuman_spatial_inference_result.md` proves compact non-visual/superhuman streams can support one reusable obstacle-distance rule while preserving narrower open-space and moving-source anchors. |

## Scenario 8: Body Pressure Balance Inference

Starting state:

| field | value |
| --- | --- |
| mode | `curious` or `calm` with compact body-state routines available |
| resources | healthy enough for compact monitoring and map update |
| sensory event | left/right foot pressure, front/back torso contact, paired pressure capsule, movement command, and airflow streams change |
| context | the model has labeled touch/pressure differentials, but no dedicated accelerometer, barometer, or equilibrium stream |

Expected flow:

| layer | expected behavior |
| --- | --- |
| sensory/threshold | Emits compact `n`, `n^-1`, and `n^-2` rows for foot pressure, torso contact, paired pressure capsule, movement command, and airflow. |
| body-pressure routine | Asks whether the compact differential means balance/tilt, local foot obstacle, commanded acceleration, or air-pressure gradient. |
| teacher correction | Confirms whether the pressure pattern is a real balance/tilt case or a narrower pressure/contact case. |
| delayed consolidation | Approves a reusable balance/gravity rule only when opposed foot pressure, paired capsule differential, quiet collision/movement context, and teacher correction agree. |
| inner-world map | Stores balance, local foot obstacle, acceleration, and air-pressure anchors separately. |

Pass condition:

The system can infer a balance, gravity, or weight-shift correction from compact labeled touch/pressure differentials without using dedicated accelerometer, barometer, or equilibrium fields. Local foot pressure, commanded acceleration, and airflow/pressure cases must not become general balance rules.

Numeric test result:

| result | note |
| --- | --- |
| PASS | `outputs/body_pressure_balance_inference/body_pressure_balance_inference_result.md` proves paired touch/pressure differentials can support one reusable balance/gravity rule while preserving separate local-foot, acceleration, and air-pressure anchors. |

## Current Takeaway

These scenarios suggest the v1 architecture is ready for behavior testing rather than more tool expansion.

The key test question is:

`Can Builder / Dreamer and Critic / Reality-Checker choose among the existing deterministic controls well enough to handle simple events, danger, noisy input, and repeated useful loops?`
