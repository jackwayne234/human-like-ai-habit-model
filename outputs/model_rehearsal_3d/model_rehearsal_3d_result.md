# Model Rehearsal 3D Result

Purpose: rehearse a future AI-in-the-loop session in the true 3D nursery without external API integration, using only `embodied_3d_agent_tools.mjs` tool calls and compact decision context.

Verdict: PASS

| metric | value |
| --- | --- |
| transcript turns | 16 |
| predictions recorded | 16 |
| body actions executed | 16 |
| compact map beliefs written | 16 |
| raw detail denials | 1 |
| crouch actions | 1 |
| step_up actions | 1 |
| step_down actions | 1 |
| overhead step contacts in hidden evaluator | 0 |
| unhandled raised-step blocks in hidden evaluator | 0 |
| unhandled drop warnings in hidden evaluator | 0 |
| prediction mismatches | 0 |

## Checks

| check | result |
| --- | --- |
| prompt and transcript stay compact 3D only | PASS |
| raw 3D detail request is denied | PASS |
| every action has a prediction | PASS |
| every turn writes a compact map belief | PASS |
| rehearsal completes the expected turn count | PASS |
| rehearsal crouches for compact upper-volume risk | PASS |
| rehearsal uses step_up for compact raised support | PASS |
| rehearsal uses step_down for compact lower support | PASS |
| hidden evaluator sees zero overhead step contacts | PASS |
| hidden evaluator sees zero unhandled raised-step blocks | PASS |
| hidden evaluator sees zero unhandled drop warnings | PASS |
| predictions all match or are explained | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| compact prompt | `outputs/model_rehearsal_3d/compact_prompt.md` |
| decision transcript | `outputs/model_rehearsal_3d/decision_transcript.md` |
| tool audit | `outputs/model_rehearsal_3d/tool_audit.md` |
| map beliefs | `outputs/model_rehearsal_3d/map_beliefs.md` |
| raw detail requests | `outputs/model_rehearsal_3d/raw_detail_requests.md` |
| hidden truth log | `outputs/model_rehearsal_3d/hidden_truth_log.md` |
| result report | `outputs/model_rehearsal_3d/model_rehearsal_3d_result.md` |
