# Learned Operation Controls

This file is the only v1 write target for habit/efficiency-created control proposals.

The habit builder and efficiency enhancer may add structured candidate or proposed controls here. They should not directly write executable tools, alter global routing presets, change mind-model state, or create unlimited buttons elsewhere.

Builder / Dreamer and Critic / Reality-Checker inspect this file as a routing surface. A control becomes active only after the two mind models accept it onto the limited control surface.

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

No active learned operation controls yet.

## Candidate And Proposed Controls

No candidate learned operation controls yet.

## Paused Or Archived Controls

No paused or archived learned operation controls yet.
