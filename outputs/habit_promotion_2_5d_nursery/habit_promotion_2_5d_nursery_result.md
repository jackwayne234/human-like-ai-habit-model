# Habit Promotion 2.5D Nursery Result

Purpose: test whether `adaptive_low_clearance_crossing_routine_v1` should remain a candidate or be promoted after repeated success, false-alarm restraint, and failure monitoring.

Verdict: PASS

Recommended control status: `proposed`

| metric | value |
| --- | --- |
| intended success cases passed | 3/3 |
| false alarm avoided | yes |
| too-low failure caught | yes |
| confidence | medium_high |

## Checks

| check | result |
| --- | --- |
| routine succeeds in all intended low-clearance success cases | PASS |
| routine avoids crouch on side false alarm | PASS |
| routine catches too-low failure instead of promoting blind success | PASS |
| promotion review recommends proposed status | PASS |
| robot-facing logs do not include hidden coordinates or feature objects | PASS |
| hidden truth exists only in the evaluation log | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| compact trigger log | `outputs/habit_promotion_2_5d_nursery/compact_trigger_log.md` |
| action decision log | `outputs/habit_promotion_2_5d_nursery/action_decision_log.md` |
| risk memory log | `outputs/habit_promotion_2_5d_nursery/risk_memory_log.md` |
| promotion review | `outputs/habit_promotion_2_5d_nursery/promotion_review.md` |
| hidden truth log | `outputs/habit_promotion_2_5d_nursery/hidden_truth_log.md` |
