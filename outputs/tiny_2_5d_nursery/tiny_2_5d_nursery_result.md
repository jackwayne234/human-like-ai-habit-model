# Tiny 2.5D Nursery Result

Purpose: test a small 2.5D embodied nursery room with compact-only perception, height-like pressure streams, and separate hidden truth for human evaluation.

Verdict: PASS

| metric | run 1 | run 2 |
| --- | --- | --- |
| committed height warnings | 6 | 2 |
| overhead contacts | 4 | 0 |
| probe height warnings before commitment | 0 | 4 |
| crouch actions | 0 | 1 |
| prediction accuracy | 40.0% | 100.0% |
| unresolved prediction mismatches | 6 | 0 |

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | `outputs/tiny_2_5d_nursery/hidden_truth_log.md` |
| compact trigger log | `outputs/tiny_2_5d_nursery/compact_trigger_log.md` |
| prediction/comparison log | `outputs/tiny_2_5d_nursery/prediction_comparison_log.md` |
| body/world map updates | `outputs/tiny_2_5d_nursery/body_world_map_updates.md` |
| action decision log | `outputs/tiny_2_5d_nursery/action_decision_log.md` |
| lesson candidates | `outputs/tiny_2_5d_nursery/lesson_candidates.md` |
| watcher page | `outputs/tiny_2_5d_nursery/tiny_2_5d_nursery_watcher.html` |
| watcher frames | `outputs/tiny_2_5d_nursery/watcher_frames.json` |

## Checks

| check | result |
| --- | --- |
| run 2 has fewer committed height warnings than run 1 | PASS |
| run 2 has fewer overhead contacts than run 1 | PASS |
| run 2 uses probes before height risk | PASS |
| run 2 uses crouch_body for low-clearance risk | PASS |
| run 2 prediction accuracy is no worse than run 1 | PASS |
| robot-facing logs do not include hidden coordinates or feature objects | PASS |
| hidden truth exists only in the evaluation log | PASS |
| run 2 actions are selected by the compact 2.5D action chooser | PASS |
| every intentional action has a prediction | PASS |
| every intentional action has an immediate comparison | PASS |
| body-noticing wrote both self-map and world-map updates | PASS |
| watcher page was generated | PASS |
