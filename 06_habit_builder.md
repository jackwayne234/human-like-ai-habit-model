# Habit Builder

The habit builder watches for repeated trigger-sequence-reward pathways that succeed often enough over time to become habits.

## Purpose

The habit builder turns repeated successful pathways into reusable behavior.

It watches what the system notices, what the mind decides, what action happens, and whether the result helped. If a pattern repeats often enough and works often enough, it can become a habit.

The habit builder should not create habits from raw sensory data alone. It should use promoted events, inner-world context, actions, outcomes, and resource cost.

## Inputs

The habit builder can read:

| input | source |
| --- | --- |
| promoted events | Memory promotion |
| episode summaries | Memory promotion |
| current world context | Inner world model |
| actions taken | Action system, when added |
| outcomes / reward | Result tracking, when added |
| resource cost | Resource monitor |

## Habit Shape

A habit can be stored as:

| part | meaning |
| --- | --- |
| trigger | What signal or context starts the habit. |
| sequence | The repeated event/action path that follows the trigger. |
| reward | The useful result that closes the loop. |
| state | What inner-world state must be true. |
| action | What the system tends to do, if an action layer exists. |
| expected result | What should happen if the habit works. |
| confidence | How reliable the habit has been. |
| cost | How expensive it is in attention, memory, or compute. |

Example:

| field | example |
| --- | --- |
| cue | touch `n` hits repeatedly |
| state | danger / damage possible |
| action | withdraw or reduce contact |
| expected result | touch signal drops |
| confidence | high after repeated success |
| cost | low |

The required v1 habit loop is `trigger + sequence + reward`. Repetition alone is not enough. The reward can be any useful result: resource savings, danger reduction, prediction improvement, task success, or a stable preferred inner-world state.

## Starting Promotion Rule

The first habit rule can be simple:

| condition | result |
| --- | --- |
| same cue-state-action-result pattern succeeds at least 5 times | mark as candidate habit |
| candidate habit succeeds at least 80% of the time over later uses | promote to habit |
| mature habit fails repeatedly | demote or send back to mind model |

These are starting parameters, not final values.

The habit layer decides when a repeated useful loop should be handed to the efficiency enhancer. It should count repetitions, track confidence, estimate cost, and mark whether the loop is ready for full automation or only partial automation. Partial automation is valid when only part of the sequence is safe to make deterministic.

## Relationship To The Inner World

The habit builder should not blindly automate everything.

The inner world model provides context. A habit that works in one situation may be dangerous in another. The habit builder should therefore store the context where a habit works, not only the action.

## Relationship To Efficiency

The habit builder creates reliable repeated pathways.

The efficiency enhancer later compresses mature habits into cheaper routines, shortcuts, tools, or deterministic processes.

The default stance is automation-maximizing once evidence is good enough. This does not mean unsafe blind automation; it means the habit system should lean toward freeing the mind model from repeated low-level work whenever trigger, sequence, reward, context, and confidence make that safe.

Repeated successful use strengthens habit access automatically. Disuse weakens access and can compress or lower the immediate availability of the habit over time.

## v1 Boundary

The habit builder does not:

- detect sensory thresholds
- decide importance directly
- manage raw memory allocation
- optimize habits into tools by itself

Its job is to notice repeated successful pathways and mark them as reusable.

## Mind-Model Tool Interview

This section records user-selected tools and knobs related to habit detection and habit promotion.

### Q16. Should the efficiency model be allowed to create new internal tools/routines automatically once a pattern is reliable enough?

Answer: Yes, after repeated success, but the habit model must first notice a repeated trigger, same sequence of events, and reward over a specific duration of time.

The habit builder is the trigger for efficiency work. It should watch for a cue or trigger, a repeated sequence of events/actions, and a reward or successful result at the end. Only after that pattern repeats across a meaningful duration should the system mark it as a candidate for efficiency compression.

Tool/knob category: `habit_trigger_sequence_reward_detector`.

### Q17. Should the habit model have adjustable knobs for how many repetitions and how long a duration are required before something counts as a habit candidate?

Answer: Yes, repetition count and duration should be adjustable, but the habit system should always lean toward the maximum safe amount of automation it can achieve.

The habit builder should have adjustable thresholds for repetition count, duration, and success reliability. However, its default pressure should be to automate as much as possible once patterns are reliable. This mirrors a basal-ganglia-like role: repeated cue-sequence-reward pathways should become automatic whenever they can be made safe and useful, freeing the mind model or prefrontal-style reasoning layer to focus on ideas, planning, and novel decisions instead of low-level repeated execution.

Tool/knob category: `automation_maximizing_habit_thresholds`.

### Q18. Should the habit system have a knob for how much confidence is required before a habit can run automatically without asking the mind model each time?

Answer: Yes, use a solid adjustable confidence threshold for now.

Gradual partial automation may be more human-like, because real habits become automated in pieces over time. For v1, that is hard to model clearly. The first version should use a single adjustable confidence threshold: once a habit is reliable enough, it can run automatically without asking the mind model each time. Later versions can replace this with staged or partial automation.

Tool/knob category: `automatic_habit_confidence_threshold`.

### Q19. Should the habit/efficiency system have a knob for when to stop trusting an automated habit and send it back to the mind model?

Answer: Yes, failed or surprising results should trigger a configurable demotion/review threshold.

Automated habits should not remain trusted forever. The habit system should track failures, surprising outcomes, changed context, and missed rewards. Once those signals pass a configurable threshold, the habit should be demoted, paused, or sent back to the mind model for review.

Tool/knob category: `habit_failure_review_threshold`.

### Q21. Should the mind model have a knob for how strongly repeated use strengthens access to a memory, habit, or inner-world pathway?

Answer: Repeated use should strengthen habit access automatically, while disuse should weaken it over time.

For habits, repeated successful use should make the pathway easier, cheaper, and more automatic. Disuse should let the pathway weaken or become less immediately available. This should happen mostly in the background, like a deterministic biological efficiency process, so higher reasoning does not have to manage every repeated action.

Tool/metric category: `automatic_habit_use_strengthening_and_decay`.

### Q23. Should the model have a knob for risk tolerance, meaning how willing it is to use a cheaper habit/routine when the situation is only approximately similar to past successful cases?

Answer: Yes, risk tolerance should be adjustable.

The habit system should not require exact context matches for every routine, because that would prevent useful generalization. It should expose a risk-tolerance setting that controls how similar the current context must be to past successful contexts before an automated habit can run. Lower tolerance means stricter matching; higher tolerance allows broader generalization.

Tool/knob category: `habit_context_risk_tolerance`.
