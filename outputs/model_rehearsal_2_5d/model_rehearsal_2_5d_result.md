# Model Rehearsal 2.5D Result

Purpose: rehearse a future AI-in-the-loop nursery session without external API integration, using only `embodied_agent_tools.mjs` tool calls and compact decision context.

Verdict: PASS

| metric | value |
| --- | --- |
| transcript turns | 14 |
| predictions recorded | 14 |
| body actions executed | 14 |
| compact map beliefs written | 14 |
| raw detail denials | 1 |
| active learned control available | yes |
| active learned control used through tools | yes |
| overhead step contacts in hidden evaluator | 0 |

## Checks

| check | result |
| --- | --- |
| prompt and transcript stay compact-only | PASS |
| raw detail request is denied | PASS |
| active learned control is available from registry | PASS |
| active learned control is used through the tool boundary | PASS |
| every action has a prediction | PASS |
| every turn writes a compact map belief | PASS |
| rehearsal completes the expected turn count | PASS |
| hidden evaluator sees zero overhead step contacts | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| compact prompt | `outputs/model_rehearsal_2_5d/compact_prompt.md` |
| decision transcript | `outputs/model_rehearsal_2_5d/decision_transcript.md` |
| tool audit | `outputs/model_rehearsal_2_5d/tool_audit.md` |
| map beliefs | `outputs/model_rehearsal_2_5d/map_beliefs.md` |
| raw detail requests | `outputs/model_rehearsal_2_5d/raw_detail_requests.md` |
| hidden truth log | `outputs/model_rehearsal_2_5d/hidden_truth_log.md` |
| result report | `outputs/model_rehearsal_2_5d/model_rehearsal_2_5d_result.md` |
