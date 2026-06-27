# Tiny Physics Nursery Result

Purpose: run the first tiny continuous digital embodied world twice, with compact-only robot perception and separate hidden truth for human evaluation.

Verdict: PASS

| metric | run 1 | run 2 |
| --- | --- | --- |
| torso-front contacts | 1 | 0 |
| blocked/partial/warning steps | 3 | 0 |
| probe warnings before risky commitment | 0 | 3 |
| prediction accuracy | 63.6% | 66.7% |
| unresolved prediction mismatches | 7 | 7 |

## Artifacts

| artifact | path |
| --- | --- |
| hidden truth log | `outputs/tiny_physics_nursery/hidden_truth_log.md` |
| compact trigger log | `outputs/tiny_physics_nursery/compact_trigger_log.md` |
| prediction/comparison log | `outputs/tiny_physics_nursery/prediction_comparison_log.md` |
| body/world map updates | `outputs/tiny_physics_nursery/body_world_map_updates.md` |
| action decision log | `outputs/tiny_physics_nursery/action_decision_log.md` |
| lesson candidates | `outputs/tiny_physics_nursery/lesson_candidates.md` |
| watcher page | `outputs/tiny_physics_nursery/tiny_physics_nursery_watcher.html` |
| watcher frames | `outputs/tiny_physics_nursery/watcher_frames.json` |

## Checks

| check | result |
| --- | --- |
| run 2 has fewer torso-front wall collisions than run 1 | PASS |
| run 2 prediction accuracy is better than run 1 | PASS |
| run 2 uses probes before risky commitment | PASS |
| robot-facing logs do not include hidden coordinates or feature objects | PASS |
| hidden truth exists only in the evaluation log | PASS |
| run 2 actions are selected by the compact action chooser | PASS |
| every intentional action has a prediction | PASS |
| every intentional action has an immediate comparison | PASS |
| body-noticing wrote both self-map and world-map updates | PASS |
| watcher page was generated | PASS |
