# Adaptive 2.5D Nursery Result

Purpose: replace fixed route timing with compact risk memory and propose the first learned-operation habit candidate from a successful low-clearance crossing sequence.

Verdict: PASS

| metric | naive | adaptive risk memory |
| --- | --- | --- |
| committed height warnings | 6 | 2 |
| overhead contacts | 4 | 0 |
| probe warnings before commitment | 0 | 3 |
| crouch actions | 0 | 1 |
| raised-surface pauses | 1 | 1 |
| prediction accuracy | 41.7% | 100.0% |
| unresolved prediction mismatches | 7 | 0 |
| habit candidates | 0 | 1 |

## Habit Candidate

- low_clearance_crossing_routine: trigger `overheadAhead compact risk memory or probe_overhead_warning`, sequence `probe_forward -> crouch_body -> step_forward`, reward `crossed low-clearance area with no overhead contact`.

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | `outputs/adaptive_2_5d_nursery/hidden_truth_log.md` |
| compact trigger log | `outputs/adaptive_2_5d_nursery/compact_trigger_log.md` |
| prediction/comparison log | `outputs/adaptive_2_5d_nursery/prediction_comparison_log.md` |
| risk memory log | `outputs/adaptive_2_5d_nursery/risk_memory_log.md` |
| body/world map updates | `outputs/adaptive_2_5d_nursery/body_world_map_updates.md` |
| action decision log | `outputs/adaptive_2_5d_nursery/action_decision_log.md` |
| habit candidates | `outputs/adaptive_2_5d_nursery/habit_candidates.md` |
| watcher page | `outputs/adaptive_2_5d_nursery/adaptive_2_5d_nursery_watcher.html` |
| watcher frames | `outputs/adaptive_2_5d_nursery/watcher_frames.json` |

## Checks

| check | result |
| --- | --- |
| adaptive run has fewer committed height warnings than naive run | PASS |
| adaptive run has fewer overhead contacts than naive run | PASS |
| adaptive run uses probes from compact risk memory | PASS |
| adaptive run uses crouch_body for low-clearance risk | PASS |
| adaptive run creates a low-clearance habit candidate | PASS |
| adaptive prediction accuracy is better than naive run | PASS |
| robot-facing logs do not include hidden coordinates or feature objects | PASS |
| hidden truth exists only in the evaluation log | PASS |
| adaptive actions are selected by compact risk memory | PASS |
