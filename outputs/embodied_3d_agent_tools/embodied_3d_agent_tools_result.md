# Embodied 3D Agent Tool Boundary Result

Purpose: expose the first true 3D embodied nursery through model-ready tools while preserving compact-only perception.

Verdict: PASS

| metric | value |
| --- | --- |
| body actions executed | 16 |
| predictions recorded | 16 |
| compact map beliefs written | 16 |
| raw detail denials | 1 |
| crouch actions | 1 |
| step_up actions | 1 |
| step_down actions | 1 |
| overhead step contacts in hidden evaluator | 0 |
| unhandled raised-step blocks in hidden evaluator | 0 |
| unhandled drop warnings in hidden evaluator | 0 |
| prediction mismatches | 0 |

## Tool Surface

| tool | purpose |
| --- | --- |
| `readCompactSensors3D()` | Read compact 3D rows and normalized compact-facing sensor values. |
| `readRiskMemory3D()` | Read active compact 3D risk memory. |
| `predictAction3D(action, reason)` | Record an expected compact result before acting. |
| `chooseAction3D(action, reason)` | Execute one allowed body action and receive compact comparison. |
| `writeMapBelief3D(...)` | Store a compact-derived 3D body/world belief. |
| `requestRawDetail(reason)` | Denied in this boundary test. |
| `suggestActionFromRiskMemory3D()` | Transparent deterministic chooser using compact 3D risk memory. |

## Checks

| check | result |
| --- | --- |
| agent-facing logs do not include hidden coordinates, vertical truth, or feature objects | PASS |
| raw 3D detail request is denied | PASS |
| every body action has a prediction | PASS |
| every turn writes a compact map belief | PASS |
| tool-mediated run crouches for compact upper-volume risk | PASS |
| tool-mediated run uses step_up for raised support | PASS |
| tool-mediated run uses step_down for lower support | PASS |
| hidden evaluator sees zero overhead step contacts | PASS |
| hidden evaluator sees zero unhandled raised-step blocks | PASS |
| hidden evaluator sees zero unhandled drop warnings | PASS |
| predictions all match or are explained | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| action log | `outputs/embodied_3d_agent_tools/action_log.md` |
| risk memory log | `outputs/embodied_3d_agent_tools/risk_memory_log.md` |
| map beliefs | `outputs/embodied_3d_agent_tools/map_beliefs.md` |
| raw detail requests | `outputs/embodied_3d_agent_tools/raw_detail_requests.md` |
| tool audit log | `outputs/embodied_3d_agent_tools/tool_audit_log.md` |
| hidden truth log | `outputs/embodied_3d_agent_tools/hidden_truth_log.md` |
