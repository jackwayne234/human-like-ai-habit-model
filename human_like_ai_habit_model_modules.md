# Human-Like AI Habit Model: Buildable Module Breakdown

This document turns the current theory sketch into prototype modules. The first build target is deliberately low in the stack: sensory streams, local threshold monitors, cross-sense deltas, second-order salience, and the promotion gate.

## Prototype Goal

Build a small simulation that proves this loop:

```text
synthetic sensory stream samples
  -> per-sense feature summaries
  -> local threshold events
  -> cross-sense rate-of-change comparison
  -> second-order salience spike detection
  -> promoted memory candidate
```

The first prototype does not need real camera, microphone, or robot input. It should use synthetic streams that behave like sight, hearing, taste, touch, and smell so the monitor logic can be tested before adding real sensors.

## Layer 0: Sensory Stream Interface

Purpose: provide a consistent wrapper around continuous input without treating the raw flow as memory.

Prototype streams:

- `sight` / blue: brightness, motion, object_count, spatial_change.
- `hearing` / green: volume, pitch_change, speech_like, impact_like.
- `taste` / orange: sweetness, bitterness, salt, chemical_novelty.
- `touch` / red: pressure, heat, vibration, pain.
- `smell` / purple: intensity, chemical_signature_shift, pleasantness, danger_hint.

Optional later grounding streams:

- `body`: energy, balance, damage, hunger, pose.
- `action`: current_action, effort, expected_result, tool_state.

Minimal sample shape:

```json
{
  "t": 1024,
  "sense": "touch",
  "features": {
    "pressure": 0.71,
    "heat": 0.18,
    "vibration": 0.04,
    "pain": 0.0
  },
  "raw_ref": null
}
```

Rules:

- Keep raw data transient.
- Store only a rolling window for calculations.
- Normalize all feature values to a comparable range, probably `0.0` to `1.0`.
- Attach `raw_ref` only when a spike has already been detected and a short episode needs temporary review.

First implementation:

- A `SensoryStream` class or plain module.
- A synthetic generator for each sense.
- A shared `tick()` that returns one sample per sense.
- A ring buffer of recent samples per sense.

Small tests:

- Stable streams produce no promoted event.
- A single local spike in one sense creates a local `n` event.
- Continuous high-but-stable input does not keep firing forever.

## Layer 1: Per-Sense Threshold Monitors (`n`)

Purpose: watch local changes inside each sense.

This layer answers:

```text
Did this one sensory stream cross a meaningful local threshold?
```

Inputs:

- Current normalized feature sample for one sense.
- Previous samples from the same sense.
- Per-feature threshold config.
- Optional baseline estimate for that sense.

Outputs:

```json
{
  "t": 1024,
  "sense": "touch",
  "type": "local_threshold",
  "score": 0.82,
  "features": {
    "pressure": 0.71,
    "pressure_delta": 0.49
  },
  "reason": "pressure rose faster than local baseline"
}
```

Useful internal values:

- `level`: current feature magnitude.
- `baseline`: recent rolling average.
- `delta`: current value minus previous value.
- `z_score` or normalized deviation from baseline.
- `cooldown`: prevents repeated alerts for one sustained condition.

Suggested data structure:

```json
{
  "sense": "touch",
  "feature_thresholds": {
    "pressure": { "level": 0.8, "delta": 0.25 },
    "heat": { "level": 0.75, "delta": 0.2 },
    "pain": { "level": 0.2, "delta": 0.05 }
  },
  "baseline_window": 20,
  "cooldown_ticks": 5
}
```

Important behavior:

- A sudden change matters more than a stable high value.
- Some features should have lower thresholds than others, especially pain or danger hints.
- Local `n` events are not memory yet. They are candidates for cross-sense interpretation.

Small tests:

- Touch pressure jump fires one event.
- Touch pressure stays high and does not spam events.
- Smell intensity slowly increases and may not fire unless it crosses a danger threshold.
- Pain fires quickly even at a lower absolute level.

## Layer 2: Cross-Sense Delta Monitor (`n-1`)

Purpose: compare rates of change between senses.

This layer answers:

```text
Are multiple senses changing together, diverging, or contradicting each other?
```

Inputs:

- Per-sense delta summaries from Layer 1.
- Recent local threshold events.
- A rolling cross-sense history.

Per-tick summary shape:

```json
{
  "t": 1024,
  "deltas": {
    "sight": 0.12,
    "hearing": 0.08,
    "taste": 0.0,
    "touch": 0.49,
    "smell": 0.02
  }
}
```

Outputs:

```json
{
  "t": 1024,
  "type": "cross_sense_delta",
  "score": 0.64,
  "pattern": "touch changed faster than other senses",
  "dominant_senses": ["touch"],
  "supporting_senses": ["hearing"]
}
```

Prototype scoring ideas:

- `total_change`: sum of all sense delta magnitudes.
- `dominant_change`: largest sense delta.
- `spread`: difference between largest and smallest active deltas.
- `coherence`: whether multiple senses rise together.
- `contradiction`: one sense reports a strong change while expected supporting senses stay flat.

Examples:

- Door slam: hearing spike plus sight motion plus vibration.
- Burn risk: visual glow plus touch heat or pain.
- Social shift: hearing tone change with little visual change.
- False alarm candidate: one isolated sense spikes without supporting senses.

Small tests:

- Hearing-only impact creates a weaker event than hearing plus touch vibration.
- Sight motion plus hearing rhythm creates coherent cross-sense motion.
- Touch pain with no sight change still remains important because danger-weighted local signals can override coherence.

## Layer 3: Second-Order Salience Monitor (`n-2`)

Purpose: detect when the rate of cross-sense change itself changes.

This layer answers:

```text
Did the pattern of change suddenly accelerate, break, or become important enough to compress and promote?
```

Inputs:

- Current `n-1` score.
- Previous `n-1` scores.
- Recent local `n` events.
- Context hints such as current habit step or expected outcome.

Internal values:

- `velocity`: change in `n-1` score from previous tick.
- `acceleration`: change in velocity.
- `prediction_error`: actual pattern minus expected pattern, if an expectation exists.
- `consequence_weight`: danger, reward, pain, social importance, or task failure.

Output:

```json
{
  "t": 1024,
  "type": "salience_spike",
  "score": 0.88,
  "trigger": "cross-sense acceleration",
  "dominant_senses": ["touch", "hearing"],
  "episode_mode": "begin",
  "summary": "sudden touch pressure with supporting impact sound"
}
```

Prototype salience formula:

```text
salience =
  abs(cross_sense_acceleration) * acceleration_weight
  + local_danger_score * danger_weight
  + coherence_score * coherence_weight
  + prediction_error * surprise_weight
```

Keep this formula simple at first. The goal is not perfect neuroscience. The goal is a working gate that ignores boring flow and catches meaningful breaks.

Small tests:

- Stable background produces salience near zero.
- Slow predictable ramp produces low or medium salience.
- Sudden multi-sense impact produces high salience.
- Repeated expected impact becomes less salient after baseline adaptation.
- Unexpected failure during a habit step produces high salience even if raw sensory magnitude is low.

## Layer 4: Threshold / Importance Gate

Purpose: decide whether a salience spike becomes a promoted memory candidate.

This layer answers:

```text
Should the upper model receive this compressed event?
```

Inputs:

- `n-2` salience event.
- Recent `n` and `n-1` events.
- Current context, if available.
- Memory promotion thresholds.

Outputs:

```json
{
  "t_start": 1020,
  "t_peak": 1024,
  "t_end": null,
  "type": "memory_candidate",
  "priority": "high",
  "compressed_event": {
    "what_changed": "touch pressure spiked with impact sound",
    "senses": ["touch", "hearing"],
    "scores": {
      "local": 0.82,
      "cross_sense": 0.64,
      "salience": 0.88
    },
    "possible_meaning": "collision or contact event"
  },
  "raw_window_ref": "temporary_episode_buffer:1020-1028"
}
```

Promotion categories:

- `ignore`: ordinary flow.
- `watch`: keep a short temporary buffer but do not write memory yet.
- `promote`: send compressed event upward.
- `episode`: begin temporary recording around the spike.
- `emergency`: wake higher reasoning immediately.

Small tests:

- Low salience is ignored.
- Medium salience enters watch mode.
- High salience begins an episode buffer.
- Danger-weighted local events can promote even without full cross-sense support.

## Minimal Prototype Sequence

1. Build synthetic five-sense stream generators.
2. Build ring buffers and normalized feature samples.
3. Implement per-sense `n` monitors.
4. Convert each sense into a single delta score per tick.
5. Implement `n-1` cross-sense comparison.
6. Implement `n-2` salience acceleration scoring.
7. Implement the importance gate and memory candidate object.
8. Add a console or simple browser visualization.
9. Run scripted scenarios and print promoted events.
10. Only after this works, connect real input or the habit builder.

## Starter Simulation Scenarios

Scenario 1: stable room

```text
sight low motion, hearing low volume, touch stable, taste stable, smell stable
expected result: no memory candidates
```

Scenario 2: cup bump

```text
touch pressure spike + hearing clink + slight sight motion
expected result: one promoted contact event
```

Scenario 3: stove warning

```text
sight glow stable, touch heat ramps, pain small spike
expected result: danger-weighted promoted event
```

Scenario 4: background music

```text
hearing rhythm changes repeatedly but predictably
expected result: adaptation lowers salience over time
```

Scenario 5: habit failure

```text
expected action result fails, sensory changes are small
expected result: prediction-error salience promotes the event
```

## What Moves Upward Later

After the lower stack works, promoted events can feed these higher modules:

- Episodic memory writer: stores short event windows and extracts meaning.
- Compressed inner-world model: updates beliefs, predictions, and exceptions.
- Habit builder: notices repeated successful pathways.
- Habit strength tracker: rewards stable routines and decays weak ones.
- Routine compiler: turns strong habits into cheap executable routines.
- Safety monitor: interrupts compiled routines on anomaly, danger, or permission boundary.
- Conscious/reflection layer: receives compressed events and asks what changed.

The key boundary stays the same: upper layers receive promoted summaries and temporary episode windows, not the full raw sensory river.
