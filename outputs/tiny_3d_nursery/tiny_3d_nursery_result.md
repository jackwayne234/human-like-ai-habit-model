# Tiny 3D Nursery Result

Purpose: create the first hidden 3D embodied nursery while preserving compact-only perception.

Verdict: PASS

| metric | value |
| --- | --- |
| transcript turns | 16 |
| compact rows | 90 |
| compact map beliefs | 16 |
| crouch actions | 1 |
| step_up actions | 1 |
| step_down actions | 1 |
| watcher frames | 16 |
| overhead step contacts in hidden evaluator | 0 |
| unhandled raised-step blocks in hidden evaluator | 0 |
| unhandled drop warnings in hidden evaluator | 0 |
| prediction mismatches | 0 |

## Checks

| check | result |
| --- | --- |
| agent-facing logs do not include hidden coordinates or feature objects | PASS |
| 3D run produces compact trigger evidence | PASS |
| policy crouches for upper-volume risk | PASS |
| policy uses step_up for raised floor support | PASS |
| policy uses step_down for lower floor support | PASS |
| hidden evaluator sees zero overhead step contacts | PASS |
| hidden evaluator sees zero unhandled step blocks | PASS |
| hidden evaluator sees zero unhandled drop warnings | PASS |
| every turn writes a compact map belief | PASS |
| predictions all match or are explained | PASS |
| watcher frames cover every turn | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| compact trigger log | `outputs/tiny_3d_nursery/compact_trigger_log.md` |
| decision transcript | `outputs/tiny_3d_nursery/decision_transcript.md` |
| risk memory log | `outputs/tiny_3d_nursery/risk_memory_log.md` |
| map beliefs | `outputs/tiny_3d_nursery/map_beliefs.md` |
| hidden truth log | `outputs/tiny_3d_nursery/hidden_truth_log.md` |
| watcher page | `outputs/tiny_3d_nursery/tiny_3d_nursery_watcher.html` |
| watcher frames | `outputs/tiny_3d_nursery/watcher_frames.json` |
| result report | `outputs/tiny_3d_nursery/tiny_3d_nursery_result.md` |
