# Embodied Agent Tool Boundary Result

Purpose: expose the 2.5D embodied nursery through model-ready tools before putting a real AI model in the world.

Verdict: PASS

| metric | value |
| --- | --- |
| overhead step contacts | 0 |
| probe warnings | 1 |
| crouch actions | 2 |
| raw detail denials | 1 |
| learned control active in registry | yes |
| active learned control accepted from registry | yes |
| compact map beliefs written | 10 |

## Tool Surface

| tool | purpose |
| --- | --- |
| `readCompactSensors()` | Read compact rows and normalized compact-facing sensor values. |
| `readRiskMemory()` | Read active compact risk memory. |
| `predictAction(action, reason)` | Record an expected compact result before acting. |
| `chooseAction(action, reason)` | Execute one allowed body action and receive compact comparison. |
| `writeMapBelief(...)` | Store a compact-derived body/world belief. |
| `useLearnedControl(control_id)` | Queue a learned operation only when the registry marks it active. |
| `requestRawDetail(reason)` | Denied in this boundary test. |

## Checks

| check | result |
| --- | --- |
| agent-facing logs do not include hidden coordinates or feature objects | PASS |
| raw detail request is denied | PASS |
| learned control is active in the registry | PASS |
| active learned control queues its operation through the tool boundary | PASS |
| tool-mediated run uses a probe before low-clearance commitment | PASS |
| tool-mediated run crouches for low-clearance risk | PASS |
| tool-mediated run has zero overhead step contacts | PASS |
| tool-mediated run writes compact map beliefs | PASS |

## Artifacts

| artifact | path |
| --- | --- |
| action log | `outputs/embodied_agent_tools/action_log.md` |
| risk memory log | `outputs/embodied_agent_tools/risk_memory_log.md` |
| map beliefs | `outputs/embodied_agent_tools/map_beliefs.md` |
| raw detail requests | `outputs/embodied_agent_tools/raw_detail_requests.md` |
| tool audit log | `outputs/embodied_agent_tools/tool_audit_log.md` |
| hidden truth log | `outputs/embodied_agent_tools/hidden_truth_log.md` |
