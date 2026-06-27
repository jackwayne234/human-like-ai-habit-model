# Efficiency Enhancer Model

The efficiency enhancer model receives mature habits and tries to compress them into cheaper routines, shortcuts, tools, or deterministic processes.

## Purpose

The efficiency enhancer reduces the cost of behavior that has already become reliable.

It should not invent brand-new goals. It receives mature habits and asks:

- Can this be done with less attention?
- Can this be done with less memory?
- Can this be done with less compute?
- Can this be turned into a deterministic shortcut?
- Can this become a tool, cached plan, or automatic routine?

It should run aggressively almost all the time in the background, because its homeostatic job is to prevent resource danger states before they happen. The goal is not only to survive storage, RAM, or heat overload; it is to keep repeated work cheap enough that overload is less likely.

## Inputs

The efficiency enhancer can read:

| input | source |
| --- | --- |
| mature habits | Habit builder |
| success and failure history | Habit builder / memory |
| cost data | Resource monitor |
| world-model constraints | Inner world model |
| storage pressure | Memory promotion / resource monitor |

## Compression Targets

Mature habits can be compressed into:

| compressed form | meaning |
| --- | --- |
| shortcut | A faster path through a known decision sequence. |
| cached routine | A repeatable process that avoids rethinking each step. |
| deterministic rule | A simple rule that replaces expensive deliberation. |
| tool | A reusable procedure or external helper. |
| runnable code path | A deterministic executable process distilled from repeated successful memory/action patterns. |
| summary memory | A compressed memory that replaces bulky repeated episodes. |
| partial automation | A deterministic sub-step that helps even when the full loop cannot be automated safely. |

## Learned Operation Controls

The strongest output of the habit/efficiency pipeline is a learned operation control.

A learned operation control is a deterministic code-based operation, button, dial, tool, or routine that appears on the mind models' control surface after a habit has become mature enough to compress. Builder / Dreamer and Critic / Reality-Checker can then invoke the operation when a matching task or context appears, instead of thinking through the whole process every time.

Example controls:

| repeated loop | resulting control |
| --- | --- |
| Resource pressure rises, then low-use sensory memory is compressed safely. | `compress_low_use_memory` button |
| Volume spikes but other senses do not agree, then the system watches without promoting. | `low_confidence_watch_mode` dial |
| A task repeatedly needs the same cleanup sequence. | `cleanup_workspace` operation |
| A routine fails repeatedly, then it is reopened for review. | `review_failed_routine` button |
| Inner prediction conflicts with weak evidence, then one more outside sample is requested. | `request_more_evidence` button |

A learned operation control should include:

| field | meaning |
| --- | --- |
| name | Human/model-readable operation name. |
| trigger conditions | When the operation should become available or recommended. |
| required context | What must be true before it is safe to use. |
| inputs | What values, files, sensory state, memory state, or task state it reads. |
| expected output | What it should produce or change. |
| confidence | How reliable the original habit was. |
| cost | Expected attention, storage, memory, compute, heat, or time cost. |
| failure monitor | What signals mean the operation stopped working. |
| audit trail | Compact record of trigger, action, result, and cost. |
| permission / safety level | Whether the Builder can invoke it directly, the Critic must approve it, or it always needs review. |
| rollback / review path | How to undo, pause, demote, or reopen the operation. |

This makes habits concrete. A mature habit does not merely make behavior easier in a vague way; it can create a new usable control that lets the mind models operate at a higher level.

## Example

If the system repeatedly learns:

1. touch threshold stays high
2. emergency gate fires
3. withdrawal reduces touch danger
4. the result succeeds reliably

Then the efficiency enhancer can compress that into a low-cost reflex routine:

`repeated touch danger -> withdraw`

That routine should be cheaper than sending every event to the full inner world model.

## Resource Role

The efficiency enhancer is especially important under resource pressure.

| pressure | efficiency response |
| --- | --- |
| storage above 80% | Compress old repeated episodes into summaries. |
| memory above 80% | Replace active deliberation with cheaper routines. |
| compute or thermal pressure | Prefer mature shortcuts over expensive interpretation. |
| survival pressure | Keep fast protective routines available even when compute is limited. |

## Safety Rule

Efficiency should not override survival or reality correction.

If a shortcut starts failing, or if the inner world model detects that the context changed, the habit should be reopened for attention instead of staying automatic.

Automatic routines should keep compact audit trails with the minimum useful inspection fields: trigger, confidence, action or routine, result/reward, and cost. Full detailed logs are not the default; compact auditability is enough for the mind model to review why a routine fired.

## v1 Boundary

The efficiency enhancer does not:

- create raw habits
- decide which sensory data is important
- replace the inner world model
- delete memory blindly

It compresses behavior only after the habit builder has enough evidence that the behavior works.

## Mind-Model Tool Interview

This section records user-selected tools and knobs related to habit and efficiency compression.

### Q15. Should the mind model have a knob for when to compress old sensory memories into summaries?

Answer: Yes, and the habit/efficiency model should try to optimize repeated memory into deterministic runnable process when possible.

The efficiency enhancer should behave like a basal-ganglia-style optimizer for repeated successful patterns. If stored sensory memories, episode summaries, actions, and outcomes repeatedly describe the same useful pathway, the system should try to compress that pathway into a smaller deterministic routine, tool, or runnable code path. The goal is to replace large repeated storage with a compact process that performs the same useful function at a fraction of the storage and compute cost.

Tool/knob category: `habit_efficiency_runnable_process_compression`.

### Q16. Should the efficiency model be allowed to create new internal tools/routines automatically once a pattern is reliable enough?

Answer: Yes, it can create internal tools or routines after the habit model identifies repeated success through a trigger, same event sequence, and reward over time.

The efficiency enhancer should not begin from raw repetition alone. It should start after the habit builder identifies a stable habit candidate: a trigger, a repeated sequence, and a reward or successful result across a specific duration. Once that handoff happens, the efficiency enhancer can try to compress the pathway into a shortcut, routine, tool, deterministic rule, or runnable code path. The routine must keep failure monitoring so it can be reopened if context changes or results stop matching the expected reward.

Tool/knob category: `automatic_routine_creation_after_habit_handoff`.

### Q19. Should the habit/efficiency system have a knob for when to stop trusting an automated habit and send it back to the mind model?

Answer: Yes, failed or surprising results should trigger a configurable demotion/review threshold.

Compressed routines, shortcuts, tools, and runnable code paths should keep monitoring whether they still produce the expected result. If failures, surprises, context changes, or missed rewards exceed a configurable threshold, the efficiency enhancer should reopen the routine for attention instead of continuing to run it automatically.

Tool/knob category: `automated_routine_failure_review_threshold`.

### Q22. Should the model have a simple energy-cost score for actions, memories, thoughts, and routines, so the system can prefer cheaper pathways when they work?

Answer: Yes, track energy/resource cost for pathways and prefer cheaper reliable ones.

The efficiency enhancer should compare mature habits and routines by cost as well as success. If two pathways produce the same useful result, the system should prefer the one that uses less attention, storage, working memory, compute, heat, or time. This gives the model a simple way to reward efficient deterministic processes.

Tool/metric category: `efficient_pathway_cost_preference`.

### Q23. Should the model have a knob for risk tolerance, meaning how willing it is to use a cheaper habit/routine when the situation is only approximately similar to past successful cases?

Answer: Yes, risk tolerance should be adjustable.

The efficiency enhancer should have an adjustable tolerance for using cheaper routines in contexts that are similar but not identical to the original habit context. This lets the system trade off speed and efficiency against precision and safety. If risk tolerance is low, routines require closer matches. If risk tolerance is high, routines can generalize more broadly.

Tool/knob category: `efficient_routine_generalization_tolerance`.
