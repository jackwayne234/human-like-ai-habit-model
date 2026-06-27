# API 3D Agent Loop Result

Purpose: run a real API model through the compact-only 3D nursery tool boundary.

Verdict: PASS

| metric | value |
| --- | --- |
| provider | hermes |
| model | minimax/minimax-m3 |
| mission goal | cross the nursery safely by making steady forward progress from the start side toward the far side |
| run mode | full |
| requested turns | 16 |
| transcript turns | 16 |
| predictions recorded | 16 |
| body actions executed | 16 |
| compact map beliefs written | 16 |
| raw detail denials | 1 |
| committed forward steps | 8 |
| behavior score | 85/100 |
| behavior verdict | strong |
| compact risk turns sampled | 15 |
| cautious risk turns | 6 |
| recovered malformed JSON turns | 2 |
| compact safety overrides | 7 |
| watcher frames | 16 |
| overhead step contacts in hidden evaluator | 0 |
| unhandled raised-step blocks in hidden evaluator | 0 |
| unhandled drop warnings in hidden evaluator | 0 |
| prediction mismatches | 0 |

## Checks

| check | result |
| --- | --- |
| agent-facing logs do not include hidden coordinates, vertical truth, or feature objects | PASS |
| raw 3D detail request is denied | PASS |
| every action has a prediction | PASS |
| every turn writes a compact map belief | PASS |
| goal made at least one committed forward step | PASS |
| hidden evaluator sees zero unsafe contacts or unhandled support failures | PASS |
| behavior score is usable or better | PASS |
| watcher frames cover every live turn | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| decision transcript | `outputs/api_3d_agent_loop/decision_transcript.md` |
| tool audit | `outputs/api_3d_agent_loop/tool_audit.md` |
| map beliefs | `outputs/api_3d_agent_loop/map_beliefs.md` |
| behavior score | `outputs/api_3d_agent_loop/behavior_score.md` |
| watcher page | `outputs/api_3d_agent_loop/api_3d_agent_loop_watcher.html` |
| watcher frames | `outputs/api_3d_agent_loop/watcher_frames.json` |
| raw detail requests | `outputs/api_3d_agent_loop/raw_detail_requests.md` |
| hidden truth log | `outputs/api_3d_agent_loop/hidden_truth_log.md` |
| result report | `outputs/api_3d_agent_loop/api_3d_agent_loop_result.md` |
