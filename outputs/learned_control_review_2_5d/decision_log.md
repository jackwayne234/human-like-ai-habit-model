# Learned Control Review 2.5D Decision Log

Control under review: `adaptive_low_clearance_crossing_routine_v1`

| reviewer | decision | reason |
| --- | --- | --- |
| Builder / Dreamer | approve | enough compact transfer evidence and a clear trigger-operation shape |
| Critic / Reality-Checker | approve | false alarms, failures, rollback, budget, and hidden-truth boundary are covered |
| Registry | active | review passed; learned_operation_controls.md status is active |

## Builder / Dreamer Checks

| check | result | evidence |
| --- | --- | --- |
| promotion evidence recommends a proposal | PASS | habit promotion result recommends proposed status before final review |
| successful transfer evidence is sufficient | PASS | promotion variants report 3/3 intended success cases |
| compact trigger conditions are useful | PASS | overheadAhead compact risk memory, probe_overhead_warning, or overhead_clearance plus vertical_echo compact agreement |
| operation is compact and inspectable | PASS | probe_forward -> crouch_body -> step_forward |
| confidence is strong enough for active review | PASS | medium_high |

## Critic / Reality-Checker Checks

| check | result | evidence |
| --- | --- | --- |
| false alarm restraint is proven | PASS | side-echo case avoids unnecessary crouch |
| failure case is caught | PASS | too-low-even-crouched case is detected instead of treated as safe |
| failure monitor is preserved | PASS | overhead contact after crouch, movement blocked after probe, repeated probe warnings without safe crossing, or mismatch_needs_map_update |
| rollback path is preserved | PASS | pause the routine and return to explicit compact risk-memory decisions |
| hidden truth boundary remains intact | PASS | promotion output keeps hidden truth in evaluation-only artifacts |
| active control budget has room | PASS | 1/12 active controls after registry update |
