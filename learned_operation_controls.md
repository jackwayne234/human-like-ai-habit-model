# Learned Operation Controls

This file is the only v1 write target for habit/efficiency-created control proposals.

The habit builder and efficiency enhancer may add structured candidate or proposed controls here. They should not directly write executable tools, alter global routing presets, change mind-model state, or create unlimited buttons elsewhere.

## v1 Status

A single executive mind model inspects this file as the routing surface for promoting candidate → proposed → active controls. The documented "Builder / Dreamer and Critic / Reality-Checker" two-mind review is the **target v2 architecture** and is not yet implemented; today the single executive performs both the proposer and reviewer roles.

A control becomes active only after the executive accepts it onto the limited control surface (see v1 Status above).

## V1 Limits

| limit | value |
| --- | --- |
| active learned operation controls | 12 |
| new proposals per review cycle | 3 |
| direct habit writes outside this file | 0 |
| risky/protected controls | require Critic / Reality-Checker approval |

## Status Values

| status | meaning |
| --- | --- |
| `candidate` | Habit builder detected a repeated useful loop. |
| `proposed` | Efficiency enhancer shaped the loop into a possible control. |
| `active` | Builder / Dreamer and Critic / Reality-Checker accepted it onto the limited control surface. |
| `paused` | The control failed, surprised the system, or needs review. |
| `archived` | The control is stale, low-use, or no longer worth active space. |

## Control Template

Copy this structure for each candidate or proposed learned operation control.

```text
control_id:
status:
name:
source_habit:
trigger_conditions:
required_context:
inputs:
operation:
expected_output:
reward:
confidence:
cost:
risk_level:
failure_monitor:
rollback_or_review:
audit_summary:
```

## Active Controls

### adaptive_low_clearance_crossing_routine_v1

```text
control_id: adaptive_low_clearance_crossing_routine_v1
status: active
name: Low Clearance Crossing Routine
source_habit: adaptive_2_5d_nursery low_clearance_crossing_routine
trigger_conditions: overheadAhead compact risk memory, probe_overhead_warning, or overhead_clearance plus vertical_echo compact agreement
required_context: body is stable enough to pause/probe; no active emergency collision; forward path risk is about upper-body clearance rather than wall impact
inputs: overhead_clearance, vertical_echo, movement_result, posture, active risk memory
operation: probe_forward -> crouch_body -> step_forward
expected_output: cross low-clearance area with no overhead contact
reward: crossed low-clearance area with no overhead contact in adaptive 2.5D nursery and habit promotion variants
confidence: medium_high
cost: one probe action and one posture-change action before forward movement
risk_level: low
failure_monitor: overhead contact after crouch, movement blocked after probe, repeated probe warnings without safe crossing, or mismatch_needs_map_update
rollback_or_review: pause the routine and return to explicit compact risk-memory decisions
audit_summary: Promoted to proposed by scenario_tests/run_habit_promotion_2_5d_nursery.mjs after 3/3 varied success cases, false-alarm restraint, and too-low failure detection. Activated by scenario_tests/run_learned_control_review_2_5d.mjs after the single executive review gate approved the compact evidence, failure monitor, rollback path, hidden-truth boundary, and active-control budget (v1: single executive performs both proposer and reviewer roles; the two-mind Builder / Dreamer and Critic / Reality-Checker split is deferred to v2).
```

## Candidate And Proposed Controls

No candidate or proposed learned operation controls yet.

## Paused Or Archived Controls

No paused or archived learned operation controls yet.
