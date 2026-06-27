# Importance Gate

The importance gate decides whether a detected event should be ignored, watched, promoted, recorded as an episode, or escalated.

## Purpose

The importance gate is the first layer that decides what to do with threshold-monitor output.

The threshold monitors detect signal. The importance gate decides whether that signal deserves action, attention, memory promotion, or escalation to the mind model.

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

## Adjustable Knobs

The gate should not be hardcoded forever. It should expose a small number of knobs that the mind model can adjust.

Starting knobs:

| knob | default | meaning |
| --- | --- | --- |
| `n_duration` | 5 hits within 10 ticks | How much repeated direct threshold evidence is needed for emergency action. |
| `n_minus_1_duration` | 3 hits within 10 ticks | How much rate-change evidence is needed for attention. |
| `n_minus_2_duration` | 1 hit within 10 ticks | How much acceleration/change-pattern evidence is needed for attention. |

These are starting parameters, not permanent rules.

The mind model can later adjust them based on:

- internal world model expectations
- available storage
- available memory
- available compute
- thermal or physical limits
- survival pressure
- recent false positives or missed events
- current task demands

Example knob states:

| state | `n_duration` | `n^-1_duration` | `n^-2_duration` |
| --- | --- | --- | --- |
| calm / safe | 6 | 4 | 2 |
| normal | 5 | 3 | 1 |
| alert / risky | 3 | 2 | 1 |
| danger / pain context | 1 | 1 | 1 |

The gate is therefore simple but tunable. The intelligence does not need to live inside the gate itself. The gate applies the current settings; the mind model learns when to change those settings.

## Resource Pressure

The gate should ask:

`Is this event important enough given current resources?`

Starting resource rules:

| pressure | likely gate adjustment |
| --- | --- |
| storage above 80% | Raise memory-promotion thresholds. Store less. Compress more. |
| active memory above 80% | Raise attention thresholds. Shorten active buffers. |
| compute saturated | Reduce expensive interpretation. Favor simple reflex rules. |
| temperature high / throttling | Lower survival thresholds but raise curiosity thresholds. |
| power limited | Spend less attention on weak signals unless survival-relevant. |

Resource pressure should not block emergency survival reactions. It mainly controls how much curiosity, memory, and deliberation the system can afford.

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

It receives compact threshold signals, applies current gate settings, and decides what gets attention.
