# Memory Promotion

Memory promotion turns selected sensory events into compressed metadata, belief updates, exceptions, and episode summaries.

## Sensor Storage Pools

The colored areas in the original brain drawing can represent designated memory storage for each sensory channel.

Initial v1 allocation:

| sensor | color | starting storage |
| --- | --- | --- |
| brightness / sight | blue | 20 GB |
| volume / hearing | green | 20 GB |
| touch | red | 20 GB |
| taste | orange | 20 GB |
| smell | purple | 20 GB |

The first total storage budget is 100 GB across the five sensory pools.

At startup, each sensor receives an equal 20 GB allocation. Later, the mind model can reallocate that fixed 100 GB total based on observed use, survival relevance, and task demand. A sensory pool that is used often, carries more important promoted events, or is currently more relevant to survival can temporarily receive more storage. A sensory pool that is rarely used or mostly produces low-importance data can shrink.

This makes storage adaptive without letting total memory grow without limit. The system can learn which senses deserve more memory in a given environment, while still obeying a fixed resource budget.

Example:

| sensor | starting storage | possible adapted storage |
| --- | --- | --- |
| brightness / sight | 20 GB | 35 GB |
| volume / hearing | 20 GB | 25 GB |
| touch | 20 GB | 25 GB |
| taste | 20 GB | 5 GB |
| smell | 20 GB | 10 GB |

The exact reallocation rules are not decided yet. For now, the important design choice is that memory is divided by sensory channel first, starts equal, and can later be redistributed by the mind model.

## Full Sensor Recording Policy

Threshold triggers and full sensor recordings are different things.

The threshold monitor can record compact trigger facts cheaply, such as a sense name, tick, value, and threshold. Full sensor recordings are raw clips of actual incoming sensor values. They should only start when the two executive mind models choose to press a deterministic recording button.

In v1, each sensor has its own recording space inside the sensory storage budget:

| sensor | default storage pool | recording target |
| --- | --- | --- |
| brightness / sight | 20 GB | `sensor_recordings/brightness/` |
| volume / hearing | 20 GB | `sensor_recordings/volume/` |
| touch | 20 GB | `sensor_recordings/touch/` |
| taste | 20 GB | `sensor_recordings/taste/` |
| smell | 20 GB | `sensor_recordings/smell/` |

The v1 raw recording surface gives the executive models exactly five buttons, one per sensor:

| button | behavior |
| --- | --- |
| `record_brightness` | Toggle raw brightness / sight recording on or off. |
| `record_volume` | Toggle raw volume / hearing recording on or off. |
| `record_touch` | Toggle raw touch recording on or off. |
| `record_taste` | Toggle raw taste recording on or off. |
| `record_smell` | Toggle raw smell recording on or off. |

These buttons do not calculate storage budget, price the recording, decide duration, or decide how much storage each sense is allowed to use. They only start or stop raw recording for their own sensor. The existing per-sensor storage pools receive the incoming values in their own folders while recording is active.

The two mind models decide when to press each sensor recording button:

| controller | effect |
| --- | --- |
| Builder / Dreamer | May request raw recording for a specific sensor because of curiosity, imagination repair, scene building, or uncertainty. |
| Critic / Reality-Checker | May agree, deny, or press the same sensor button again to stop recording based on evidence quality, risk, and physical resources. |
| importance gate preset | Provides the current situation context, such as `curious`, `focused`, `strained`, `danger`, or `recovery`. |
| emergency context | May justify pressing the relevant sensor recording button for protective review. |

The recording decision should include:

| field | meaning |
| --- | --- |
| button | One of the five sensor recording buttons. |
| trigger | Which threshold/gate event caused the recording request, if any. |
| mode | Current global preset dial. |
| reason | Curiosity, emergency, uncertainty, repeated evidence, or executive request. |
| sensor | Which single sensor starts or stops recording. |
| state change | Recording turns on if that sensor was off, or turns off if that sensor was already recording. |
| review route | Whether Builder, Critic, or both need to inspect it. |

This means the gate does not blindly record all raw input. Raw recording happens only for the specific sensor button the executive models press. Recording keeps going until the models press that sensor's button again to stop it.

This policy only controls full raw sensor recordings. It does not stop compact threshold monitoring. The `n`, `n-1`, and `n-2` monitors are always on as compact trigger recorders, whether or not any raw sensor button is active.

## Purpose

Memory promotion receives events that passed the importance gate and decides how they should be stored.

It should not save every raw sensory value. Its job is to turn selected signal into useful memory forms:

- compact metadata
- sensory evidence snippets
- episode summaries
- exceptions and surprises
- belief updates
- links into the inner world model

## Promotion Inputs

Memory promotion can receive:

| input | source |
| --- | --- |
| promoted threshold pattern | Importance gate |
| emergency event | Importance gate |
| recent rolling buffer | Sensory stream layer, if requested |
| current resource state | Mind/body resource monitor |
| current world-model context | Inner world model |

The sensory stream layer should only provide the temporary recent buffer. It should not decide which parts are memorable.

## Memory Forms

The first memory system can store information in layers of detail.

| memory form | purpose |
| --- | --- |
| metadata row | Cheap record of what happened and why it passed the gate. |
| sensory snippet | Small window of raw values around the event. |
| episode summary | Human-readable or model-readable summary of a meaningful event span. |
| belief update | A change to the inner world model's expectations. |
| exception | Something surprising or rule-breaking. |

Most events should become metadata only. Fewer events should receive sensory snippets. Even fewer should become full episodes or belief updates.

## Storage Pressure

Storage is a body-state constraint.

Starting storage rule:

| condition | behavior |
| --- | --- |
| storage below 80% | Promote normally. |
| storage at or above 80% | Become stricter. Prefer summaries over raw snippets. |
| storage near full | Only store survival-relevant, highly novel, or strongly repeated events. |

The memory system should preserve operation rather than fill itself until it slows down.

The v1 goal is homeostasis: prevent storage pressure from becoming a resource-danger state. Compression should start before danger, not only after the system is already overloaded. Repeated low-value detail should become summaries, and repeated useful loops should be offered to the habit/efficiency system as process candidates.

## Reallocation Signals

The mind model may later reallocate the 100 GB sensory memory budget based on:

- number of promoted events per sense
- survival relevance per sense
- recent task demand
- how often stored memories from that sense are reused
- whether a sense is producing mostly low-value noise

Example:

If touch is repeatedly involved in emergency events, touch storage may grow. If taste rarely produces useful memory, taste storage may shrink.

## v1 Boundary

Memory promotion does not:

- detect thresholds
- decide immediate emergency action
- build the full inner world by itself
- create habits
- optimize routines

It stores the right amount of selected information in the right place, under a fixed resource budget.

## Mind-Model Tool Interview

This section records user-selected tools and knobs the mind model can use when deciding how much selected information should become memory.

### Q12. Should the mind model be able to adjust how much sensory history it asks for when something passes the gate?

Answer: Yes, recent sensory history request size should be selectable from simple options per sensor.

Instead of one analog history-size slider, the mind model should have clear request options such as tiny snippets, medium windows, and larger context pulls. These options should be selectable per sensor, so the mind can ask for more touch context without automatically pulling more brightness, volume, taste, or smell context.

Tool/knob category: `per_sensor_history_request_size`.

### Q13. Should the mind model choose between different memory detail levels when promoting something?

Answer: Yes, memory detail level should be a selectable option.

The mind model should be able to choose how much detail a promoted event deserves. Starting options can include metadata only, sensory snippet, episode summary, belief update, and exception record. Most events should stay cheap, while unusual, repeated, surprising, or physically important events can receive richer storage.

Tool/knob category: `selectable_memory_detail_level`.

### Q14. Should the mind model be able to adjust the 100 GB sensory storage allocation across senses over time?

Answer: Yes, keep 100 GB total, default toward 20 GB per sense, and allow deterministic use-based reallocation that drifts back toward equal allocation when demand fades.

The five sensory pools should remain physically bounded by the 100 GB total. The default home position is 20 GB each for brightness, volume, touch, taste, and smell. The allocator can automatically lean away from that default when one sense is repeatedly useful, frequently promoted, survival-relevant, or heavily reused. When that special demand fades, the system should gradually drift back toward the balanced 20 GB per-sense default.

This can be deterministic rather than a constant conscious choice by the mind model. The mind model needs visibility into the allocation and may be able to influence it, but the day-to-day resizing can behave like a homeostatic storage tool: repeated use grows a pool; disuse lets it normalize.

Tool/knob category: `homeostatic_sensory_storage_reallocation`.

### Q15. Should the mind model have a knob for when to compress old sensory memories into summaries?

Answer: Yes, compression pressure should be adjustable, and repeated memory should also feed the habit/efficiency system so it can become deterministic runnable process when possible.

Memory compression should not only mean turning bulky sensory history into text-like summaries. When repeated memories describe a stable successful pattern, the basal-ganglia-like habit builder and efficiency enhancer should try to optimize that pattern into a much smaller deterministic routine, tool, or runnable code path that does the same useful work with a fraction of the storage and compute.

The memory system can expose compression pressure as a selectable tool, especially when storage approaches the 80% constraint zone. The efficiency system can then look for repeated memory clusters that are good candidates for process compression instead of preserving every episode.

Tool/knob category: `memory_compression_to_runnable_process`.

## Control-Surface Defaults From Interview 08

These defaults are starting settings, not permanent laws.

| default | value |
| --- | --- |
| disuse behavior | Lower access strength and compress detail over time. |
| sensory reallocation | Drift slowly in normal conditions, but shift faster during high demand or protective contexts. |
| compression target | Prefer compact summaries or runnable deterministic process when repeated memory describes the same useful loop. |
| audit style | Keep compact records for automatic routines rather than full detailed logs. |

Memory promotion should pass repeated trigger-sequence-reward clusters to the habit builder. The handoff should include enough compact evidence for inspection: trigger, sequence shape, reward/result, confidence, resource cost, and whether the loop is a full or partial automation candidate.
