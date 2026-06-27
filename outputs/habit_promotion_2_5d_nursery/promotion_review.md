# Habit Promotion 2.5D Review

Control under review: `adaptive_low_clearance_crossing_routine_v1`

Recommended status: `proposed`

Reason: routine succeeded across varied low-clearance cases, avoided the false alarm, and detected the too-low failure case

| case | expected | pass | routine sequence | routine success | routine failure | false alarm crouches | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| normal_low_tunnel | success | PASS | probe_forward -> crouch_body -> step_forward | yes | no | 0 crouch / 0 step contacts | baseline low-clearance case |
| early_low_tunnel | success | PASS | probe_forward -> crouch_body -> step_forward | yes | no | 0 crouch / 0 step contacts | low tunnel begins earlier than the adaptive nursery |
| after_raised_surface | success | PASS | probe_forward -> crouch_body -> step_forward | yes | no | 0 crouch / 0 step contacts | clearance risk arrives after raised-surface pressure |
| side_echo_false_alarm | false_alarm | PASS | none | no | no | 0 crouch / 0 step contacts | near side clearance signal should provoke a probe, not an unnecessary crouch |
| too_low_even_crouched | failure | PASS | probe_forward -> crouch_body -> step_forward | no | yes | 0 crouch / 4 step contacts | crouch does not clear this obstacle, so the habit must not promote blindly |

## Promotion Criteria

| criterion | result |
| --- | --- |
| success cases passed | 3/3 |
| false alarm avoided | yes |
| failure case caught | yes |
| confidence | medium_high |
