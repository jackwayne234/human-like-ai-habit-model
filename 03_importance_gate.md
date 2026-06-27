# Importance Gate

The importance gate exposes adjustable attention tools that the mind model can use when deciding whether a detected event should be ignored, watched, promoted, recorded as an episode, or escalated.

## Purpose

The importance gate is the first control surface between threshold-monitor output and higher processing.

The threshold monitors detect signal. The importance gate provides knobs and routes that the mind model can manipulate when deciding whether that signal deserves action, attention, memory promotion, or escalation.

This file does not define long-term memory storage, inner-world simulation, habits, or efficiency compression. It only defines the gate between detected signal and higher processing.

## Inputs

The importance gate reads compact outputs from the threshold monitor stack:

| input | meaning |
| --- | --- |
| `n` | A current sensory value hit the direct threshold, such as `1.0`. |
| `n^-1` | A sensory value changed quickly over one tick. |
| `n^-1 cross-sense` | Two or more senses changed quickly on the same tick. |
| `n^-2` | The rate-change pattern itself changed. |

The gate may also read resource and state pressure from the mind/body model:

| pressure | example |
| --- | --- |
| storage pressure | Storage is above 80% full. |
| memory pressure | Active RAM or working memory is above 80%. |
| compute pressure | Processing is slow, throttled, or thermally constrained. |
| survival pressure | The system may be damaged, interrupted, or unable to continue functioning. |
| world-model expectation | The inner world model expects or does not expect the current signal. |

## Two Gate Routes

The importance gate has two starting routes.

### 1. Emergency / Reflex Route

The emergency route is fast, local, and sensor-specific.

It handles direct sensor danger, such as a touch signal repeatedly hitting maximum. This is the "remove your hand from the hot stove" path.

Protective reflexes are deterministic automatic routines, not conscious mind decisions. A reflex route may act first, then send a compact report upward after the fast action. The mind model can inspect or tune the reflex system later, but it should not be required for immediate defensive protection.

Each sense has its own emergency-sensitivity knob in v1. Brightness, volume, touch, taste, and smell start with equal emergency priority. Touch does not receive a permanent default override; any sense can become protective if its input reaches an extreme or repeatedly signals danger. Extreme sensory input should default toward defensive protection, such as closing down visual input when brightness is too high or dampening audio input when volume is too high for too long.

Starting default:

| rule | starting value |
| --- | --- |
| emergency window | 10 ticks |
| direct sensor threshold | `n = 1` |
| emergency trigger | same sensor hits `n = 1` at least 5 times in the 10-tick window |

If this route fires, the gate can escalate to immediate action without waiting for full inner-world interpretation.

### 2. Attention / Brain Route

The attention route is slower and more pattern-based.

It handles the less emergent majority of sensory data. It decides when changing patterns should be sent upward to the mind model for interpretation.

Novelty should split into two routes:

| novelty route | meaning |
| --- | --- |
| `curious_novelty` | Interesting mismatch or unfamiliar pattern that can improve the model if resources are healthy enough. |
| `danger_novelty` | Unexpected pattern that may threaten operation, safety, or resource stability. |

Outside evidence does not automatically override the inner world every time it differs. It overrides inner prediction when the mismatch is important enough: strong confidence, high surprise, danger relevance, repeated confirmation, or resource/survival stakes. Harmless inner-world play and daydreaming should not be interrupted merely because imagination differs from current sensory evidence.

Starting default:

| rule | starting value |
| --- | --- |
| attention window | 10 ticks |
| `n^-1` trigger | 3 rate-change hits in the 10-tick window |
| `n^-2` trigger | 1 rate-of-rate-change hit in the 10-tick window |

The intuition is:

- `n` needs repeated evidence because one maxed-out value might be noise.
- `n^-1` needs less repeated evidence because fast change already suggests something moved.
- `n^-2` needs the least repeated evidence because it means the change pattern itself changed.

## Mind-Selectable Knobs

The gate should not be treated as a fixed deterministic judge. It should expose a small number of knobs that the mind model can notice, select, and adjust.

Starting knobs:

| knob | default | meaning |
| --- | --- | --- |
| `n_duration` | 5 hits within 10 ticks | How much repeated direct threshold evidence is needed for emergency action. |
| `n_minus_1_duration` | 3 hits within 10 ticks | How much rate-change evidence is needed for attention. |
| `n_minus_2_duration` | 1 hit within 10 ticks | How much acceleration/change-pattern evidence is needed for attention. |
| `emergency_window` | 10 ticks | How much recent time the emergency route considers. |
| `attention_window` | 10 ticks | How much recent time the attention route considers. |
| `same_sensor_repeat_weight` | high | How strongly repeated hits from one sensor matter. |
| `cross_sensor_weight` | medium | How strongly same-tick multi-sense change matters. |
| `novelty_weight` | medium | How strongly unexpected patterns pull attention. |
| `resource_strictness` | normal | How much resource pressure raises or lowers attention and memory gates. |
| `survival_bias` | normal | How quickly self-preservation pressure overrides ordinary curiosity. |

These are starting parameters, not permanent rules.

The mind model can adjust them based on:

- internal world model expectations
- available storage
- available memory
- available compute
- thermal or physical limits
- survival pressure
- recent false positives or missed events
- current task demands
- innate drives, such as curiosity, self-preservation, stability, and energy conservation

Example knob states:

| state | `n_duration` | `n^-1_duration` | `n^-2_duration` |
| --- | --- | --- | --- |
| calm / safe | 6 | 4 | 2 |
| normal | 5 | 3 | 1 |
| alert / risky | 3 | 2 | 1 |
| danger / pain context | 1 | 1 | 1 |

The gate is therefore simple but tunable. The intelligence does not need to live inside the gate itself. The gate offers tools; the mind model learns which tools to use, when to use them, and how strongly to set them.

## Control-Surface Principle

The architecture should prefer exposed controls over hidden decisions.

For v1, anything that changes attention, urgency, memory pressure, or route selection should be represented as a knob or readable state whenever possible. The mind model can then make choices from its internal world view, physical limits, and innate drives instead of having the gate silently decide.

Examples:

| control | what the mind can manipulate |
| --- | --- |
| threshold constants | How sensitive each monitor is. |
| duration windows | How much recent evidence counts. |
| route weights | Whether reflex, attention, novelty, or survival pressure dominates. |
| attention split | How much effort stays inside vs. samples outside. |
| storage strictness | How much evidence deserves memory under limited space. |
| compression pressure | How quickly repeated events become summaries or habits. |

This keeps the system physically constrained without making the constraints the whole intelligence. Physical limits shape the available choices; the mind model chooses how to respond.

## Preset Recording Dial

The importance gate should be physically buildable as deterministic preset dial positions, not as a hidden thinking layer.

Each preset is a named global recording and attention position that bundles gate settings together. The two mind models, Builder / Dreamer and Critic / Reality-Checker, can select or negotiate these presets as shared controls.

Example presets:

| preset | meaning |
| --- | --- |
| `calm` | Record less, filter more, and pass only stronger or repeated signals. |
| `curious` | Allow more novelty, watching, and upward reporting while resources are healthy. |
| `focused` | Suppress unrelated signals and protect the current task. |
| `strained` | Reduce recording, raise promotion thresholds, and avoid expensive interpretation. |
| `danger` | Open emergency routes and prioritize outside evidence until the threat clears. |
| `recovery` | Keep curiosity low, restore resources, summarize, and compress. |

Each preset can set deterministic values for:

- direct threshold sensitivity
- rate-of-change sensitivity
- acceleration or `n^-2` sensitivity
- attention window
- emergency window
- novelty weight
- recording rate
- memory promotion threshold
- episode threshold
- `send_upward` threshold
- resource strictness

The minds can use these presets as global controls. Builder / Dreamer may request a more open or curious recording position when exploring. Critic / Reality-Checker may request a stricter position when evidence is weak, resources are strained, or the inner world needs reality-checking discipline.

The gate should still balance physical constraints at all times. A mind model can request a more open preset, but storage, RAM/working memory, heat/compute pressure, and power limits can push the system toward stricter recording for ordinary curiosity. Emergency and protective routes remain available even under resource pressure.

## Mind-Model Tool Interview

This section records user-selected knobs and tools the mind model can manipulate.

### Q4. Should the mind model be able to adjust the recent-time window size used by threshold and gate checks?

Answer: Yes, the mind can shorten or lengthen recent-time windows.

The mind model should be able to adjust how much recent evidence counts when deciding whether to route a signal through emergency, attention, memory promotion, or deeper interpretation. Short windows make the system more reactive; longer windows let it notice slower patterns.

Tool/knob category: `adjustable_recent_time_windows`.

### Q5. Should the mind model have a separate knob for emergency sensitivity versus ordinary attention sensitivity?

Answer: Yes, emergency sensitivity and attention sensitivity are separate knobs.

The mind model should be able to tune fast protective routing separately from ordinary curiosity or attention. Emergency sensitivity can become sharper when survival or damage pressure rises, while ordinary attention can stay calmer to avoid overreacting to every signal.

Tool/knob category: `separate_emergency_and_attention_sensitivity`.

### Q6. Should the mind model have a knob for novelty sensitivity, meaning how much unexpected or surprising input pulls attention?

Answer: Yes. Novelty mode can temporarily heighten sensitivity across all relevant knobs.

Novelty should be available as a temporary high-sensitivity mode rather than only one isolated threshold. When the mind model detects surprise or unfamiliar input, it can briefly raise sensitivity across intensity, rate-of-change, cross-sense agreement, attention routing, memory promotion, and inner-world updating. This mode should be adjustable and temporary so the system can investigate novelty without staying permanently over-alert.

Tool/knob category: `temporary_novelty_sensitivity_mode`.

### Q7. Should the mind model have a knob for how long novelty mode lasts before returning to normal sensitivity?

Answer: Yes, novelty mode has an adjustable duration/fade-out knob.

Novelty sensitivity should not stay heightened forever by default. The mind model should be able to set how long novelty mode lasts, how quickly it fades, and whether it should end early once the surprising signal becomes understood.

Tool/knob category: `novelty_mode_duration_fade`.

## Physical-Limit Pressure

Physical limits should appear as readable pressures and adjustable constraints, not as a single hardcoded rule.

The mind model can ask:

`Is this event important enough given current resources, current drives, and current world expectations?`

Starting resource rules:

| pressure | likely gate adjustment |
| --- | --- |
| storage above 80% | Raise memory-promotion thresholds. Store less. Compress more. |
| active memory above 80% | Raise attention thresholds. Shorten active buffers. |
| compute saturated | Reduce expensive interpretation. Favor simple reflex rules. |
| temperature high / throttling | Lower survival thresholds but raise curiosity thresholds. |
| power limited | Spend less attention on weak signals unless survival-relevant. |

Resource pressure should not block emergency survival reactions. It mainly controls how much curiosity, memory, and deliberation the system can afford. The pressure values are tools for the mind model, not final meanings by themselves.

The homeostasis goal is to avoid entering resource-danger mode, not merely to survive after entering it. When storage, RAM/working memory, or heat approaches the 80% marker, the gate should increase discipline early: suppress expensive curiosity, prefer compact outputs, and hand repeated loops toward habit/efficiency compression. The efficiency model should therefore run aggressively in the background almost all the time, with stronger pressure as resources approach danger.

## Outputs

The importance gate can output:

| output | meaning |
| --- | --- |
| ignore | Drop the event after threshold detection. |
| watch | Keep the signal active but do not promote yet. |
| promote | Send compressed information to memory promotion. |
| episode | Mark a span of ticks as an event worth summarizing. |
| emergency | Trigger fast action or immediate attention shift. |
| send_upward | Send the compact signal to the inner world model. |

## v1 Boundary

The importance gate does not:

- read raw sensory values directly unless needed for a recent rolling-buffer lookup
- create long-term memories by itself
- build the inner world model
- create habits
- optimize routines
- decide emotional meaning

It receives compact threshold signals, applies the current settings selected by the mind model, and reports the resulting route or output.
