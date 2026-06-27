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
