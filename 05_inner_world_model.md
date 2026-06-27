# Inner World Model

The inner world model receives compressed promoted information and maintains the system's usable model of reality.

## Dedicated Mind Storage

The mind should have its own storage budget separate from the five sensory storage pools.

Initial v1 allocation:

| storage area | starting storage | purpose |
| --- | --- | --- |
| sensory memory pools | 100 GB total | Store promoted sensory evidence by channel. |
| mind / inner world storage | 100 GB | Build and maintain the system's internal world model. |

The mind storage is not just another sensory archive. Its primary purpose is world-building: maintaining the system's internal model of reality, expectations, remembered places, imagined scenarios, possible futures, self-state, and meaning.

One possible form for this inner world is a visual simulation or video-game-like environment where the system can arrange memories, objects, locations, people, risks, goals, and imagined outcomes. Another possible form is generated video-like memory playback or thought rehearsal. The exact representation is not decided yet, but the purpose is clear: the mind uses this storage to build a usable internal world, not merely to save raw data.

## Inner / Outer Attention Split

A starting hypothesis is that the mind spends most of its time inside its own internal model, while still sampling the outside world.

Initial v1 startup mode:

| setting | starting value |
| --- | --- |
| global mode | `curious` |
| inner world building | 50% |
| curiosity / exploration | 30% |
| remaining allocation | 20% reserved for outside sampling, clarification, or later tuning |

Earlier 80% inner / 20% outside was a useful hypothesis, but the control-surface interview refined the first operational default to `50%` inner-world building and `30%` curiosity in curious startup mode. These are defaults, not permanent laws.

The model should still allow states where the mind is `100%` focused on inner-world building while deterministic efficiency routines keep behavior running. That is an available mode, not the constant startup condition.

Historical hypothesis:

| attention target | starting share |
| --- | --- |
| inner world model | 80% |
| outside sensory world | 20% |

This does not mean the system ignores reality. The outside world can interrupt the inner world through threshold monitors and the importance gate. Emergency signals, strong novelty, resource pressure, or survival-relevant events can force attention outward.

The 80/20 split is a baseline, not a permanent rule. It reflects the idea that a mind often lives mostly inside its model of the world, using incoming sensory data to correct, update, or interrupt that model.

This gives the inner world model a clear purpose: build a private mental world, spend most background effort maintaining it, and let the sensory/importance system decide when the outside world deserves more attention.

The inner world is not only an outer-world prediction engine. It can also support daydreaming, play, preferences, internally liked experiences, and imagined scenes. Outside evidence should correct the model when the mismatch is important, but harmless inner play should not be interrupted solely because it does not match the current sensory stream.

## Main Purpose

The inner world model is the system's private model of reality.

It should maintain:

- what the system believes is happening
- what it expects to happen next
- what places, objects, people, risks, and goals exist
- what recent events mean
- what imagined futures are possible
- what the system is trying to protect or pursue

The inner world model receives compressed promoted information. It should not stare directly at all raw sensory data unless the importance gate asks for more detail.

## Possible Representation

The inner world may eventually be represented as a visual simulation, like a private video game for imagination.

In that world:

- memories can become places, scenes, objects, or replayable clips
- goals can become destinations or active tasks
- risks can become marked zones or warnings
- expected events can be simulated before action
- possible futures can be rehearsed

Another possible representation is video-like memory playback or generated thought clips. The exact format can change. The important idea is that the mind has a manipulable world model, not just a pile of text or raw data.

## Forces That Tune Decisions

The inner world model should choose how to tune the available knobs using three major pressures:

| pressure | question |
| --- | --- |
| internal world view | What do I think is happening? |
| resource limits | How much attention, storage, and processing can I afford? |
| survival / self-preservation | Is this relevant to continued functioning? |

Self-preservation does not need to be mystical. In machine terms it means preserving operation, avoiding damage, avoiding irreversible data loss, and maintaining enough resources to keep functioning.

## Innate Drives And Selectable Tools

The mind model should not receive one fixed decision tree from the lower layers. It should receive a set of tools and knobs that it can notice and manipulate.

Starting innate drives:

| drive | starting meaning |
| --- | --- |
| self-preservation | Keep the system functioning and avoid damage or irreversible loss. |
| curiosity | Spend some attention on novelty, surprise, and model improvement. |
| stability | Avoid overreacting to every small signal. |
| efficiency | Prefer cheaper pathways when they are reliable enough. |
| coherence | Keep the internal world model consistent with outside evidence. |

The efficiency drive should run aggressively in the background almost all the time, because one of its jobs is to keep the system away from storage, RAM, and heat danger states. The mind model remains able to inspect and tune this pressure, but the default bias is to automate reliable repeated work as much as safely possible.

Starting selectable tools:

| tool | what the mind can adjust |
| --- | --- |
| gate thresholds | How sensitive the importance gate is to `n`, `n^-1`, and `n^-2`. |
| attention windows | How much recent evidence counts before action or attention. |
| route weights | Whether emergency, attention, novelty, or resource pressure matters most right now. |
| attention split | How much effort stays in the inner world vs. samples the outside world. |
| sensory storage allocation | How the 100 GB sensory storage budget is divided across senses. |
| mind storage pressure | How much inner-world detail should be kept, summarized, or compressed. |
| habit/efficiency pressure | How aggressively repeated pathways should become habits or shortcuts. |

The physical state of the system limits what choices are available. Innate drives give the mind model reasons to prefer some choices over others. The knobs are the practical handles it can move.

## Mind-Model Tool Interview

This section records user-selected tools, metrics, and knobs the mind model can monitor or manipulate.

### Q8. Should self-preservation be recorded as a monitored drive/metric, with adjustable response knobs around it?

Answer: Self-preservation should emerge from physical limits instead of existing as a separate standalone knob.

The mind model should monitor physical constraints such as storage use, RAM/working-memory pressure, and CPU heat or throttling. The starting constraint target is to stay under about 80% for storage, RAM, and heat-related compute pressure. The mind model balances its decisions against those limits. In this framing, self-preservation is an emergent property of respecting physical constraints while continuing to function, not a separate dial that directly overrides everything.

Tool/metric category: `physical_limit_self_preservation_constraints`.

### Q9. Should the mind model have separate monitored pressure meters for storage, RAM/working memory, and CPU heat/compute load, instead of one combined resource pressure number?

Answer: Yes, track storage, RAM/working memory, and CPU heat/compute separately, and design them so they can support a reward and discipline system.

The mind model should monitor storage pressure, RAM or working-memory pressure, and CPU heat/compute load as separate physical-limit meters. These meters can become part of a reward and discipline system: staying efficient, responsive, and below the roughly 80% constraint zone can be treated as healthy operation, while pushing resources too high creates discipline pressure that discourages expensive attention, memory, or compute choices.

Tool/metric category: `separate_resource_pressure_meters`.

### Q10. Should the mind model have a knob for how strongly resource discipline suppresses curiosity?

Answer: Yes, resource discipline can suppress curiosity with an adjustable strength.

Curiosity should get quieter when storage, working memory, or CPU heat/compute pressure rises, but it should not vanish completely by default. The mind model should have a control for how strongly physical-limit discipline turns down novelty seeking, exploration, and expensive inner-world simulation.

Tool/knob category: `resource_discipline_curiosity_suppression`.

### Q11. Should the mind model have a knob for how much attention stays inside the inner world versus sampling the outside sensory world?

Answer: Yes, the inner/outer attention split is adjustable, with a preference for building its own world model and spending most of its time there.

The starting 80% inner-world / 20% outside-world split should be a tunable attention allocation, not a fixed law. The mind model should prefer maintaining and improving its internal world model during normal operation, while still sampling the outside world enough for correction, novelty, and physical-limit awareness. Emergency signals, novelty mode, or resource pressure can temporarily pull more attention outward.

Tool/knob category: `inner_outer_attention_allocation`.

### Q20. Should the mind model have a knob for how much detail the inner world stores versus compresses into simplified objects/scenes/rules?

Answer: Yes, inner-world detail and compression level should be adjustable in design, but mostly automatic and use-based in operation.

Human memory does not usually require conscious decisions about which old memories compress. Frequently used pathways stay strong, detailed, and easy to reach. Low-use pathways weaken, compress, or become harder to access over time. The inner world model should mimic that homeostatic behavior: important, repeated, and recently used places, objects, scenes, and rules stay detailed, while low-use areas gradually compress into simpler representations under the 100 GB mind storage budget.

Tool/knob category: `use_based_inner_world_detail_compression`.

### Q21. Should the mind model have a knob for how strongly repeated use strengthens access to a memory, habit, or inner-world pathway?

Answer: Repeated use should strengthen access automatically, while disuse should weaken or compress access over time.

This should be a natural, background process rather than a conscious decision every time. Human brains run on a very small physical energy budget, so much of their intelligence depends on deterministic biological systems that strengthen useful pathways, weaken unused ones, and free the conscious mind for higher-level thought. The model should mimic that principle with a simple v1 `access_strength` metric: successful reuse raises access strength, disuse slowly lowers it, and low-strength pathways become candidates for compression or harder retrieval.

Tool/metric category: `automatic_use_strengthening_and_decay`.

### Q22. Should the model have a simple energy-cost score for actions, memories, thoughts, and routines, so the system can prefer cheaper pathways when they work?

Answer: Yes, track energy/resource cost for pathways and prefer cheaper reliable ones.

The model should treat resource cost as a core metric. Actions, memories, thoughts, routines, and inner-world simulations can carry a simple cost score based on attention, storage, working memory, compute, heat, or time. When two pathways work similarly well, the system should prefer the cheaper reliable one so higher-level reasoning stays available.

Tool/metric category: `pathway_energy_resource_cost_score`.

### Q24. Should the model have a knob for curiosity/exploration budget, meaning how much resource it can spend trying new paths instead of using known efficient routines?

Answer: Yes, curiosity/exploration budget should be adjustable.

The mind model should have a selectable exploration budget that controls how much attention, storage, working memory, compute, and heat it can spend trying new pathways instead of using known efficient routines. This budget lets the system keep learning while still respecting physical constraints. When resources are healthy, curiosity can receive more room. When resource pressure rises, exploration can shrink.

Tool/knob category: `curiosity_exploration_resource_budget`.

### Q25. Should the model have a knob for how much surprise updates the inner world model?

Answer: Yes, surprise/update strength should be adjustable.

The inner world model should track how surprising a promoted event is and use that surprise level to decide how strongly to update expectations, scenes, objects, risks, or rules. Small surprises can make light updates. Strong, repeated, or high-confidence surprises can change the inner world more deeply.

Tool/knob category: `surprise_weighted_inner_world_update`.

### Q26. Should the model have a knob for how strongly it trusts its inner world predictions versus incoming outside sensory evidence?

Answer: Yes, trust in inner predictions versus outside evidence should be adjustable.

The mind model should be able to tune how much it trusts its internal predictions compared with incoming sensory evidence. Higher inner-world trust lets stable expectations guide attention and interpretation. Lower inner-world trust lets outside evidence correct the model more aggressively, especially when surprise, novelty, or physical-limit pressure suggests that reality may not match prediction.

Tool/knob category: `inner_prediction_vs_sensory_evidence_trust`.

### Q27. Should the model have a knob for when to ask the outside world for more sensory evidence instead of relying on the current inner model?

Answer: Yes, evidence-seeking threshold should be adjustable.

The mind model should be able to decide when uncertainty, surprise, or weak prediction confidence is high enough to request more outside sensory evidence. This turns outside sensing into an active tool, not only a passive stream. Lower thresholds make the system check reality more often; higher thresholds let it rely longer on the current inner model.

Tool/knob category: `active_outside_evidence_seeking_threshold`.

### Q28. Should the model have a knob for social/teacher input trust, meaning how much it lets outside instruction or correction update its inner world?

Answer: Yes, social/teacher input trust should be adjustable and source-aware.

The mind model should treat outside instruction, correction, or teaching as a special update channel with its own trust setting. Trusted sources can update the inner world more strongly. Unknown, inconsistent, or low-trust sources may require confirmation from sensory evidence, repeated instruction, or existing world-model checks before changing core beliefs.

Tool/knob category: `source_aware_teacher_input_trust`.

### Q29. Should the model have a knob for how much it protects stable identity/core preferences from being changed by ordinary updates?

Answer: Yes, core identity/preferences need a stronger protection/stability setting.

The inner world model should distinguish ordinary beliefs from more stable identity, values, or core preference structures. Ordinary beliefs can update from surprise, evidence, or teaching more easily. Core identity and preferences should require stronger evidence, higher trust, repetition, or longer duration before changing, so the system does not rewrite its stable self-model from weak or temporary signals.

Tool/knob category: `core_identity_preference_stability`.

### Q30. Should the final tool/knob list include a global mode selector for broad states like calm, curious, focused, strained, danger, and recovery?

Answer: Yes, global modes should adjust groups of knobs together.

The mind model should have broad operating modes that can move related knobs as a group. Example modes include calm, curious, focused, strained, danger, and recovery. A mode can raise or lower attention split, novelty sensitivity, resource discipline, evidence seeking, habit reliance, compression pressure, and emergency sensitivity together. Individual knobs should still exist underneath, but global modes give the mind model a simple way to shift whole-body behavior without manually tuning every control one by one.

Tool/knob category: `global_operating_mode_selector`.

## Resource Body State

The mind should track its own constraints.

Starting body-state signals:

| signal | starting concern |
| --- | --- |
| storage | Avoid exceeding 80% if it causes slowdown. |
| working memory | Avoid exceeding 80% if it reduces responsiveness. |
| compute load | Avoid spending expensive thought on weak signals. |
| thermal / throttling state | Reduce expensive processing when physical limits are reached. |
| power / uptime | Preserve function when energy or availability is constrained. |

These signals help decide whether the system can afford curiosity, memory, or deep interpretation.

## Relationship To The Gate

The inner world model does not replace the importance gate.

Instead:

| layer | job |
| --- | --- |
| threshold monitors | Detect signal. |
| importance gate | Apply the current mind-selected thresholds and report what passes. |
| inner world model | Select and tune knobs, then interpret promoted information. |

The mind model can lower thresholds when the world seems dangerous, raise thresholds when resources are low, increase curiosity when safe, conserve attention when strained, and change storage allocation when some senses become more useful than others.

In danger mode, attention pulls outward until the danger clears. The inner world can continue in a reduced or background form, but the default priority is protective reality contact: gather outside evidence, support reflex action, and report compact summaries upward after automatic protection fires.

## Cooperative Mind Models

The eventual architecture may use two cooperating mind roles rather than one monolithic mind model.

Human inner experience often includes internal dialogue: talking through ideas, disagreeing with oneself, rehearsing perspectives, or letting one part of the mind question another. The cooperative design can model that as a pair:

| mind model | role |
| --- | --- |
| Builder / Dreamer | Builds and maintains the inner world, imagines scenes, simulates futures, generates candidate explanations, supports play/daydreaming/preferences, and proposes possible plans. |
| Critic / Reality-Checker | Questions the builder, compares inner predictions against outside evidence, checks danger/resource/contradiction risk, and decides when more sensory evidence or revision is needed. |

The Builder and Critic share the same resource body, sensory gate outputs, memory promotion stream, habit signals, and efficiency pressure. They are not separate agents with unrelated goals. They are cooperating roles inside one total mind system.

The habit builder is not a third voice in this conversation by default. It observes the Builder/Critic loop from underneath, records trigger-sequence-reward patterns, and reports upward only when a habit candidate, risky handoff, failure, surprise, or context mismatch needs review.

When the habit/efficiency pipeline succeeds, it can add a learned operation control to the Builder/Critic control surface. This lets the mind models press a deterministic button, turn a dial, or call a routine when a matching task appears, instead of reasoning through the whole repeated process again.

## Executive Tool Sufficiency

The future Builder / Dreamer and Critic / Reality-Checker split has enough planned tools; the first implementation should expose those tools to one executive mind model.

The current executive control surface includes:

- threshold sensitivity knobs
- importance gate preset recording dials
- attention windows
- emergency and ordinary attention sensitivity
- novelty sensitivity and fade-out
- resource body meters for storage, RAM/working memory, heat/compute, and power
- inner/outer attention allocation
- evidence-seeking threshold
- inner prediction versus sensory evidence trust
- social/teacher input trust
- core identity/preference stability
- global mode selector
- habit and efficiency pressure
- limited learned operation controls proposed through `learned_operation_controls.md`
- Scene Builder, Memory Mapper, and Future Simulator as Builder tools

This is sufficient for the first executive model baseline. The design should not add more executive knobs or tools before testing unless a real missing capability appears. More controls would make the mind surface harder to inspect and could weaken the clean separation between deterministic lower layers, executive interpretation, habit observation, and efficiency compression.

The next useful work is to test whether Builder / Dreamer and Critic / Reality-Checker can choose between the existing tools well enough, not to keep expanding the tool list.

Example dialogue shape:

| step | example |
| --- | --- |
| Builder | "This sound might mean someone is nearby." |
| Critic | "Confidence is low. Volume changed, but brightness, touch, smell, and taste did not. Ask for more outside evidence before promoting." |
| Builder | "Hold the possibility as a low-detail inner-world object." |
| Critic | "Keep it watched, not memorized as fact." |

This gives the system reflection and self-questioning without making the architecture too large too early.

## Implementation Order

The first working implementation should use one executive mind model, not two separate Builder / Dreamer and Critic / Reality-Checker models yet.

The single executive mind should prove that it can use the instruments:

- read threshold and `n^-2` outputs
- read importance gate routes
- choose global mode presets
- press the five raw sensor recording buttons
- inspect resource meters
- decide when to watch, promote, create an episode, or ask for more evidence
- write compact decision logs

The compact decision log is not a full transcript of everything the executive thinks, says, or does. The system can monitor compact threshold output, gate state, raw recording button state, and resource pressure continuously. The decision log should only capture meaningful executive choices: what signal arrived, what mode and resource state were active, what the executive decided, which buttons or memory route it chose, why it chose that path, and what result or cost followed.

## Perception Access Constraint

The executive model should be limited to logs as its way of seeing the outside world.

Normal perception should come from compact `n`, `n^-1`, and `n^-2` logs. The model can use those logs to decide what is changing, what deserves attention, and when to ask for more detail.

Raw world data should not be the executive model's default input. Raw data enters through the rolling buffer and per-sensor raw recording files, but reading or storing it should cost enough storage, RAM, processor time, heat, and power that the model cannot afford to live there continuously.

This physical limit is what should train the system into `n`-first perception:

- Compact logs are cheap enough for constant use.
- Raw logs are costly enough to use only some of the time.
- The executive model should learn that overload comes from trying to process too much raw detail.
- The inner-world model should mostly update itself from compact noticed events, then request raw detail only when the compact stream is ambiguous, surprising, dangerous, or important.

This keeps the model from cheating by reading the whole world stream directly. It makes compression, attention, selective recording, and habit formation necessary for continued operation.

The goal is not to starve the model of useful evidence. The goal is for compact logs to carry enough structure that raw detail often becomes optional. A compact event can include the source sense, current intensity, rate of change, rate-pattern shift, and scene context. For example, touch `n = 1`, a fast touch `n^-1` rise, a touch-rate `n^-2` shift, and kitchen/stove context may be enough to infer hot-stove contact without inspecting raw touch samples.

Raw logs should therefore be a selective clarification tool, not the default world model input. If compact evidence is strong enough, the executive can interpret and act from compact perception alone.

This gives later habit extraction enough evidence to find trigger-sequence-reward loops without requiring the architecture to store every passing thought.

Once a single executive mind can reliably use those instruments, the architecture can split that executive behavior into Builder / Dreamer and Critic / Reality-Checker roles.

This keeps early testing focused. First prove that one mind can operate the control surface. Then test whether splitting the mind into two cooperating roles improves imagination, checking, planning, and decision quality.

The habit-model logging section should wait until the single executive mind is producing useful compact decision logs. The `habit_model/` workspace can exist now, but serious trigger-sequence-reward extraction should come after the single executive path is working.

## Inner World Building Layers

The inner world itself can have multiple building layers without becoming three full mind models.

Starting inner-world tools/layers:

| layer | job |
| --- | --- |
| Scene Builder | Creates imagined places, events, objects, and replayable situations. |
| Memory Mapper | Places memories, risks, people, objects, habits, and sensory evidence into the inner world. |
| Future Simulator | Runs possible outcomes, plans, rehearsals, and "what if" branches. |

These are tools of the Builder / Dreamer model in v1. They do not need to be separate full mind models yet.

A possible later third model is a Narrator / Integrator. Its job would be to maintain the stable self-story, resolve disagreements between Builder and Critic, protect identity/preferences, and decide what the total system now believes. That should stay as a future option until the two-model design proves too limited.

## v1 Boundary

The inner world model does not need to be fully realistic in v1.

The first goal is to define its role:

- maintain an internal world
- spend most background attention there
- update itself from promoted events
- tune available knobs based on expectation, resources, survival pressure, and innate drives
- provide context for memory promotion and habit formation
- first run a single executive mind that uses the instruments
- later split that executive behavior into Builder / Dreamer plus Critic / Reality-Checker if the single-mind baseline works
- keep Scene Builder, Memory Mapper, and Future Simulator as inner-world tools rather than full separate mind models
