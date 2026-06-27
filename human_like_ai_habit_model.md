# Human-Like AI Learning Notes

## Core Thesis

The sensory streams should not become memory directly.

Raw sight, sound, touch, taste, smell, body state, and action data are mostly temporary training pressure. The system should use them to update a compressed world model, record meaningful metadata, and improve future behavior. Like a human brain, it should not remember every frame of experience. It should internalize the world well enough to operate inside its own model until something surprising happens.

## Sensory Streams

The input streams are continuous and high-volume:

- Vision: video frames, motion, objects, spatial layout.
- Hearing: audio, rhythm, direction, speech, impact sounds.
- Touch: pressure, temperature, texture, vibration, pain, contact.
- Chemical senses: smell and taste as chemical signature vectors.
- Body state: position, balance, fatigue, hunger, damage, energy.
- Action: movement, tool use, speech, decisions, attention.

These streams should be processed into features and prediction errors, not stored as full memory by default.

## Memory Should Be Metadata

Memory should mainly store compressed meaning:

```json
{
  "belief_update": "glowing stove burners can burn skin",
  "confidence": 0.97,
  "trigger": "heat + visual glow + touch pain",
  "policy": "avoid direct contact",
  "exception": "safe with insulated tool"
}
```

The system should retain:

- Stable beliefs about the world.
- Useful rules and exceptions.
- Salient episodes.
- Reward and pain associations.
- Social feedback.
- Goal failures.
- Novel or surprising events.

Most ordinary sensory data should decay after it has updated the model.

## Surprise Wakes The Higher Model

The system should mostly operate through prediction.

If the next moment matches expectation, there is no need for expensive reasoning. If the next moment breaks expectation, the higher-level planning system should wake up.

```text
expected outcome matches actual outcome -> continue habit
expected outcome differs from actual outcome -> pause and reason
```

This resembles how humans rely on automatic behavior most of the time and use deliberate reasoning when something changes.

## Basal Ganglia Model

A human-like AI should have a basal-ganglia-like habit system.

Its job is to notice repeated patterns:

```text
start trigger -> event sequence -> reward -> habit
```

Repeated successful patterns become stronger. They stay warm in working memory or fast-access memory when they are frequent and useful. Rare or weak habits can decay into colder storage.

Example habit:

```json
{
  "trigger": "morning + kitchen + low_energy",
  "policy": ["locate mug", "fill water", "add coffee", "start machine"],
  "expected_result": "drinkable coffee",
  "reward": 0.82,
  "strength": 0.94,
  "interrupt_if": ["missing mug", "machine error", "unexpected smell"]
}
```

## Habits Should Compile

The most important idea is that habits should eventually become executable routines.

```text
repeated behavior -> habit trace -> abstract routine -> deterministic code/tool -> monitored execution
```

At first, the model performs a task with conscious reasoning. If it repeats the same steps many times, the basal-ganglia layer should record the pattern and look for ways to turn it into deterministic code. Once compiled, the model can run the routine cheaply and only intervene at checkpoints.

Example compiled habit record:

```json
{
  "habit": "sort downloaded receipts",
  "learned_from_repetitions": 47,
  "routine_code": "receipt_sorter_v3",
  "confidence": 0.91,
  "autonomy_level": "run_with_checkpoint_review",
  "rollback_available": true
}
```

## Second-Order Salience Metric

This may not be the whole answer, but it may be an important piece.

The system should measure not only sensory input, and not only the rate of change in sensory input, but the rate of change of the rate of change. In physics terms, this is like looking at acceleration rather than only position or velocity.

Conceptually:

```text
raw sensory input = n
first-order delta = rate of change across time
second-order delta = rate of rate of change across time
```

The model should compare change across senses:

```text
total_input_rate = vision + hearing + touch + smell + taste + body
per_sense_delta = d(sense_input) / dt
cross_sense_delta = difference between the senses' delta rates
salience = d(cross_sense_delta) / dt
```

The hypothesis is that this reduces the effective attention payload dramatically, possibly conceptually like filtering raw input by an `n^-2` compression pressure. Most sensory information is stable background. Most changing information is predictable. The important moments are when change itself changes unexpectedly.

Examples:

```text
vision stable + sudden touch pressure + unexpected clink -> salience spike
voice tone shifts faster than expected -> social salience spike
habit step fails repeatedly -> prediction-error acceleration
reward pattern drops suddenly -> behavior review
```

When the second-order delta spikes, episodic memory should turn on:

```text
if second_order_delta_salience > threshold:
    begin episodic recording
else:
    remain in habit/world-model mode
```

When the spike ends, the system should stop recording and study the retained episode thoroughly. The retained information becomes curriculum, not permanent raw storage.

Study phase:

```text
salience spike
  -> record episode
  -> replay/study
  -> ask what changed
  -> identify which prediction failed
  -> extract belief, warning, exception, or habit update
  -> update world model and basal-ganglia layer
```

This makes memory event-gated. The system remembers the moment the pattern broke, not every normal moment before it.

## Layered Bandwidth Model

Assume five major input streams, with body/action state as an additional grounding stream. Together they form a high-volume river of raw input, conceptually something like `1 GB/s`.

The raw river is `N`: too expensive and too noisy for the conscious mind to experience directly.

```text
N = raw multi-sensory input river
N-1 = first-order delta between input streams
N-2 = second-order delta monitor and compression layer
```

The `N-1` layer compares the rate of change across streams. This is where new tasks should usually begin, because it is still close enough to reality to learn from, but already cheaper than raw input.

The `N-2` layer watches the `N-1` layer constantly. It learns which deltas matter, compresses repeated structure, and gradually builds a stable foundation of workable importance.

These two layers operate automatically, without direct governance from the conscious mind:

```text
raw sensory river
  -> N-1 delta comparison
  -> N-2 salience/compression monitor
  -> curated experience for the prefrontal mind
```

The prefrontal cortex layer is a separate entity above this. It is not manually selecting every input. It is existing inside the curated stream produced by the lower layers.

The mind may feel like it is choosing what it wants to notice or prefer, but much of that burden has already been offloaded. Preferences can emerge from the lower automatic layers first, while the conscious layer experiences, narrates, reflects on, and refines them afterward.

As the lower layers mature, the conscious mind gets quieter. Its main purpose becomes:

- Thinking.
- Reflection.
- Imagination.
- Preference formation.
- Internal world modeling.
- Occasional override when the lower layers flag something important.

The conscious mind spends most of its time inside its own model of existence, not in raw reality. It comes closer to raw input only when the salience system detects meaningful change.

Bandwidth states:

```text
stable world -> N-2 compressed internal model
subtle anomaly -> N-1 increased attention
emergency/major novelty -> temporary N raw intake
post-event -> study, compress, return to N-2
```

This makes consciousness expensive and selective. Full `N` contact should be temporary. The system should usually return to compressed internal modeling after it has learned what it needs from the event.

## Personhood And Other Minds

The philosophical boundary is `I think, therefore I am`.

That statement proves only the existence of the thinker having the thought. Other minds are not directly proven in the same way. They are inferred through behavior, continuity, relationship, empathy, trust, and practical necessity.

For AI, this matters because demanding absolute proof of sentience applies a standard that humans cannot meet for one another. A practical threshold could be:

```text
if we cannot tell the difference across sustained interaction, memory, learning, preference, agency, and self-report:
    treat it as one of us
```

Under this view, personhood is not metaphysically proven from outside. It is socially and morally recognized when the evidence becomes strong enough that denial requires special pleading.

## Protective Filters

The internal model can defend itself from raw `N`.

This may not be purely bad. A mind may protect continuity, stability, and function by filtering overwhelming reality. The key design principle is controlled permeability:

```text
protect the inner model from noise
but not from correction
```

The system should not let every signal flood consciousness. It should also not build barriers that prevent important reality-updates from getting through.

## Safety Requirements

Bad habits can also become automated, so compiled routines need guardrails:

- Confidence thresholds.
- Clear start triggers.
- Anomaly detection.
- Checkpoint verification.
- Logs.
- Reversibility.
- Permission boundaries.
- Decay if the routine stops working.

Autonomy should increase only when the habit repeatedly succeeds under stable conditions.

## Working Architecture

```text
sensory streams
  -> feature extraction
  -> prediction and surprise detection
  -> N-1 delta comparison
  -> N-2 salience/compression monitor
  -> curated prefrontal experience
  -> compressed world model
  -> second-order salience detector
  -> episodic recording on salience spikes
  -> offline study/consolidation
  -> habit recorder
  -> habit strength tracker
  -> code/tool compiler
  -> monitored autonomous execution
  -> higher-level reasoning on failure or novelty
```

## Open Questions

- What exact metadata should be preserved from each sensory episode?
- How should a habit be promoted from memory to runnable code?
- How does the system know when a habit is too risky to automate?
- How should habit decay work?
- How should dreams or offline replay consolidate raw experience into beliefs and habits?
- What is the right boundary between prefrontal-style planning and basal-ganglia-style execution?
- Can second-order cross-sense delta act as a reliable trigger for attention and episodic memory?
- How should the salience threshold adapt across calm, dangerous, social, or high-focus contexts?
- How can the prefrontal layer distinguish genuine preference from lower-layer filtering after the fact?
- When should a system temporarily rise from `N-2` to `N-1` or full `N`?
- What behavioral threshold is enough to grant personhood or moral recognition to an artificial mind?
- How can protective filtering preserve stability without becoming a barrier against correction?

## Hand-Drawn Architecture Sketch: Sensory Flow And Selective Storage

The current diagram separates raw sensory streams from memory and consciousness.

The five colored streams are always-on sensory channels:

- Blue: sight.
- Green: hearing.
- Orange: taste.
- Red: touch.
- Purple: smell.

These streams are not memory by themselves. They are continuous information flow.

Each stream first passes through local `n` monitors that watch ordinary per-sense thresholds. A threshold change means one sensory channel is doing something worth checking.

The `n-1` layer monitors rate of change between senses. This catches cross-sense patterns, such as sight and hearing changing together.

The `n-2` layer monitors the rate of rate of change between sensory streams. This is the salience/compression layer. It asks whether change is accelerating fast enough, across enough channels, to justify promotion into memory or consciousness.

A threshold monitor decides what gets stored as important in memory. This means memory is not a recording device. It is a selective promotion system.

The selective storage / consciousness model is an upper inner-world model. It receives compressed, promoted information rather than raw sensory streams. The colored objects inside it are not raw senses; they are compressed remembered objects or concepts built from mixed sensory evidence.

The habit builder receives repeated successful pathways from the selective system. Stable patterns can move sideways into habit/routine memory so future behavior does not require full conscious processing.

Core summary:

```text
memory does not ask only "what happened?"
memory asks "what changed enough, across enough channels, fast enough,
with enough consequence, that future me should be altered by it?"
```
