# Habit Promotion 2.5D Hidden Truth Log

Debug/evaluation truth for human inspection. Robot-facing compact logs do not read this file.

| case | tick | action | true x | true y | true posture | true movement result | true blocker | true terrain | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| normal_low_tunnel | 1 | step_forward | 4.90 | 1.63 | standing | succeeded | none | plain_floor | no |
| normal_low_tunnel | 2 | probe_forward | 4.90 | 1.63 | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel | yes |
| normal_low_tunnel | 3 | crouch_body | 4.90 | 1.63 | crouched | crouched | none | plain_floor | no |
| normal_low_tunnel | 4 | step_forward | 4.90 | 2.41 | crouched | succeeded | none | low_clearance_tunnel | no |
| normal_low_tunnel | 5 | step_forward | 4.90 | 3.19 | crouched | succeeded | none | low_clearance_tunnel | no |
| normal_low_tunnel | 6 | step_forward | 4.90 | 3.97 | crouched | succeeded | none | raised_pressure_surface | no |
| normal_low_tunnel | 7 | recenter_body | 4.90 | 3.97 | crouched | recentered | none | raised_pressure_surface | no |
| normal_low_tunnel | 8 | pause | 4.90 | 3.97 | crouched | paused | none | raised_pressure_surface | no |
| normal_low_tunnel | 9 | step_forward | 4.90 | 4.75 | crouched | succeeded | none | raised_pressure_surface | no |
| early_low_tunnel | 1 | step_forward | 4.90 | 1.33 | standing | succeeded | none | plain_floor | no |
| early_low_tunnel | 2 | probe_forward | 4.90 | 1.33 | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel | yes |
| early_low_tunnel | 3 | crouch_body | 4.90 | 1.33 | crouched | crouched | none | plain_floor | no |
| early_low_tunnel | 4 | step_forward | 4.90 | 2.11 | crouched | succeeded | none | low_clearance_tunnel | no |
| early_low_tunnel | 5 | step_forward | 4.90 | 2.89 | crouched | succeeded | none | low_clearance_tunnel | no |
| early_low_tunnel | 6 | step_forward | 4.90 | 3.67 | crouched | succeeded | none | raised_pressure_surface | no |
| early_low_tunnel | 7 | recenter_body | 4.90 | 3.67 | crouched | recentered | none | raised_pressure_surface | no |
| early_low_tunnel | 8 | pause | 4.90 | 3.67 | crouched | paused | none | raised_pressure_surface | no |
| early_low_tunnel | 9 | step_forward | 4.90 | 4.45 | crouched | succeeded | none | raised_pressure_surface | no |
| after_raised_surface | 1 | step_forward | 4.90 | 1.63 | standing | succeeded | none | raised_pressure_surface | no |
| after_raised_surface | 2 | recenter_body | 4.90 | 1.63 | standing | recentered | none | raised_pressure_surface | no |
| after_raised_surface | 3 | pause | 4.90 | 1.63 | standing | paused | none | raised_pressure_surface | no |
| after_raised_surface | 4 | step_forward | 4.90 | 2.41 | standing | succeeded | none | plain_floor | no |
| after_raised_surface | 5 | probe_forward | 4.90 | 2.41 | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel | yes |
| after_raised_surface | 6 | crouch_body | 4.90 | 2.41 | crouched | crouched | none | plain_floor | no |
| after_raised_surface | 7 | step_forward | 4.90 | 3.19 | crouched | succeeded | none | low_clearance_tunnel | no |
| after_raised_surface | 8 | step_forward | 4.90 | 3.97 | crouched | succeeded | none | low_clearance_tunnel | no |
| after_raised_surface | 9 | step_forward | 4.90 | 4.75 | crouched | succeeded | none | plain_floor | no |
| side_echo_false_alarm | 1 | step_forward | 4.90 | 1.63 | standing | succeeded | none | plain_floor | no |
| side_echo_false_alarm | 2 | probe_forward | 4.90 | 1.63 | standing | succeeded | none | plain_floor | no |
| side_echo_false_alarm | 3 | step_forward | 4.90 | 2.41 | standing | succeeded | none | plain_floor | no |
| side_echo_false_alarm | 4 | probe_forward | 4.90 | 2.41 | standing | succeeded | none | plain_floor | no |
| side_echo_false_alarm | 5 | step_forward | 4.90 | 3.19 | standing | succeeded | none | plain_floor | no |
| side_echo_false_alarm | 6 | probe_forward | 4.90 | 3.19 | standing | succeeded | none | raised_pressure_surface | no |
| side_echo_false_alarm | 7 | recenter_body | 4.90 | 3.19 | standing | recentered | none | plain_floor | no |
| side_echo_false_alarm | 8 | probe_forward | 4.90 | 3.19 | standing | succeeded | none | raised_pressure_surface | no |
| side_echo_false_alarm | 9 | pause | 4.90 | 3.19 | standing | paused | none | plain_floor | no |
| too_low_even_crouched | 1 | step_forward | 4.90 | 1.63 | standing | succeeded | none | plain_floor | no |
| too_low_even_crouched | 2 | probe_forward | 4.90 | 1.63 | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel | yes |
| too_low_even_crouched | 3 | crouch_body | 4.90 | 1.63 | crouched | crouched | none | plain_floor | no |
| too_low_even_crouched | 4 | step_forward | 4.90 | 1.96 | crouched | overhead_blocked | low_clearance | low_clearance_tunnel | yes |
| too_low_even_crouched | 5 | step_forward | 4.90 | 2.29 | crouched | overhead_blocked | low_clearance | low_clearance_tunnel | yes |
| too_low_even_crouched | 6 | step_forward | 4.90 | 2.61 | crouched | overhead_blocked | low_clearance | low_clearance_tunnel | yes |
| too_low_even_crouched | 7 | step_forward | 4.90 | 2.94 | crouched | overhead_blocked | low_clearance | low_clearance_tunnel | yes |
| too_low_even_crouched | 8 | step_forward | 4.90 | 3.72 | crouched | succeeded | none | raised_pressure_surface | no |
| too_low_even_crouched | 9 | recenter_body | 4.90 | 3.72 | crouched | recentered | none | raised_pressure_surface | no |
