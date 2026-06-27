# Layered 2.5D Nursery Result

Purpose: test whether compact height lessons learned in one 2.5D room transfer to a second layered room with different feature placement, before moving to full 3D.

Verdict: PASS

| metric | layered naive | layered transfer |
| --- | --- | --- |
| committed height warnings | 5 | 1 |
| overhead contacts | 4 | 0 |
| probe height warnings before commitment | 0 | 4 |
| crouch actions | 0 | 1 |
| prediction accuracy | 41.7% | 100.0% |
| unresolved prediction mismatches | 7 | 0 |

## Training Source

The transfer run starts from compact-derived training-room updates and lesson candidates, not hidden simulator coordinates.

| training artifact | count |
| --- | --- |
| compact rows | 45 |
| map updates | 17 |
| lesson hypotheses | 1 |
| reusable rule candidates | 1 |

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | `outputs/layered_2_5d_nursery/hidden_truth_log.md` |
| compact trigger log | `outputs/layered_2_5d_nursery/compact_trigger_log.md` |
| prediction/comparison log | `outputs/layered_2_5d_nursery/prediction_comparison_log.md` |
| body/world map updates | `outputs/layered_2_5d_nursery/body_world_map_updates.md` |
| action decision log | `outputs/layered_2_5d_nursery/action_decision_log.md` |
| lesson candidates | `outputs/layered_2_5d_nursery/lesson_candidates.md` |
| watcher page | `outputs/layered_2_5d_nursery/layered_2_5d_nursery_watcher.html` |
| watcher frames | `outputs/layered_2_5d_nursery/watcher_frames.json` |

## Checks

| check | result |
| --- | --- |
| transfer run has fewer committed height warnings than naive layered run | PASS |
| transfer run has fewer overhead contacts than naive layered run | PASS |
| transfer run uses probes before height risk | PASS |
| transfer run uses crouch_body for low-clearance risk | PASS |
| transfer prediction accuracy is better than naive layered run | PASS |
| robot-facing logs do not include hidden coordinates or feature objects | PASS |
| hidden truth exists only in the evaluation log | PASS |
| transfer actions are selected by the compact transfer chooser | PASS |
| watcher page was generated | PASS |
