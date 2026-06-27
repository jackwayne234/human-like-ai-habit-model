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

## Relationship To Builder / Critic Conversation

The habit model should not act as a third conversational mind model by default.

The Builder / Dreamer and Critic / Reality-Checker have the reflective conversation. The habit builder observes the results of that conversation and the resulting behavior from underneath. Its default job is quiet deterministic tracking:

1. Notice the trigger.
2. Track the repeated sequence of steps.
3. Detect the reward or useful result.
4. Count repetitions and confidence.
5. Promote the loop when the pattern is reliable enough.
6. Hand mature loops to the efficiency enhancer for compression or automation.

The habit builder should not ask the mind models for permission before every candidate promotion. That would make the mind manage the repeated low-level behavior that habits are supposed to remove from conscious attention.

The habit builder should report upward, or request review, when:

- it promotes a new habit candidate
- it is ready to hand a mature loop to the efficiency enhancer
- a habit fails, becomes surprising, or misses its expected reward
- the current context no longer matches the stored habit context
- the habit touches danger, identity, important memory, high resource cost, or other protected areas

The Critic / Reality-Checker can review or veto risky handoffs. The Builder / Dreamer can supply context indirectly through the inner-world state. Neither should need to converse with the habit builder continuously during ordinary habit formation.

## Write Boundary And Button Limits

The habit builder should have very limited ability to change the system.

In v1, the habit builder cannot write broadly across memory, tools, code, routing rules, or mind-model state. Its write permission is limited to proposing structured records in the learned operation control registry:

`learned_operation_controls.md`

Its working files live in:

`habit_model/`

The habit model may read compact Builder / Dreamer and Critic / Reality-Checker logs from `habit_model/mind_model_logs/`, extract trigger-sequence-reward rows into `habit_model/trigger_sequence_reward_logs/`, and collect reviewed candidates in `habit_model/candidate_habits/`.

Implementation order note: the first working system should produce logs from a single executive mind model. The Builder / Dreamer and Critic / Reality-Checker split comes later. Habit extraction from those logs should wait until the single executive can reliably use the instruments and write useful compact decisions.

That file is the routing surface the two mind models inspect. The habit builder may add or update candidate records there, but it should not directly install executable buttons, alter global gate presets, change memory stores, or rewrite the Builder / Dreamer or Critic / Reality-Checker state.

Starting limits:

| limit | starting value |
| --- | --- |
| active learned operation controls visible to the minds | 12 |
| new habit proposals per review cycle | 3 |
| protected/risky controls requiring Critic approval | all |
| direct habit writes outside the registry file | 0 |

The active-control limit keeps the mind control surface small enough to inspect. If more useful habits exist than active slots, lower-confidence, low-use, or stale controls should remain as proposals, archived controls, or compressed summaries until Builder / Dreamer and Critic / Reality-Checker choose to promote them.

The habit builder's proposal process should be the same every time:

1. Detect a repeated `trigger + sequence + reward` loop.
2. Verify enough repetitions, duration, confidence, and context match.
3. Estimate cost savings and risk.
4. Write one structured candidate record to `learned_operation_controls.md`.
5. Wait for Builder / Dreamer and Critic / Reality-Checker review before the candidate becomes an active button, dial, tool, or routine.
6. Continue monitoring failures, surprises, missed rewards, and disuse after activation.

This keeps habit formation useful without giving the habit model open-ended authority. The habit system can notice and propose. The two mind models decide which limited controls become usable.

## Relationship To Efficiency

The habit builder creates reliable repeated pathways.

The efficiency enhancer later compresses mature habits into cheaper routines, shortcuts, tools, or deterministic processes.

The desired downstream result is a learned operation control on the mind model's control surface. Once the habit builder marks a loop as mature enough, the efficiency enhancer can turn that loop into a deterministic button, dial, tool, or routine that Builder / Dreamer and Critic / Reality-Checker can use later without thinking through the whole sequence again.

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
