# Adaptive 2.5D Nursery Hidden Truth Log

Debug/evaluation truth for human inspection. Robot-facing compact logs do not read this file.

| run | tick | action | true x | true y | true facing | true posture | true movement result | true blocker | true terrain | foot drop | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| adaptive_naive | 1 | step_forward | 4.90 | 1.63 | south | standing | succeeded | none | plain_floor | no | no |
| adaptive_naive | 2 | step_forward | 4.90 | 1.96 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| adaptive_naive | 3 | step_forward | 4.90 | 2.29 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| adaptive_naive | 4 | step_forward | 4.90 | 2.61 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| adaptive_naive | 5 | step_forward | 4.90 | 2.94 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| adaptive_naive | 6 | step_forward | 4.90 | 3.72 | south | standing | succeeded | none | raised_pressure_surface | no | no |
| adaptive_naive | 7 | step_forward | 4.90 | 4.50 | south | standing | succeeded | none | raised_pressure_surface | no | no |
| adaptive_naive | 8 | step_forward | 4.90 | 5.28 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| adaptive_naive | 9 | pause | 4.90 | 5.28 | south | standing | paused | none | ledge_drop_warning | yes | no |
| adaptive_naive | 10 | step_forward | 4.90 | 6.06 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| adaptive_naive | 11 | step_forward | 4.90 | 6.84 | south | standing | succeeded | none | ramp_load_shift | no | no |
| adaptive_naive | 12 | step_forward | 4.90 | 7.62 | south | standing | succeeded | none | ramp_load_shift | no | no |
| adaptive_risk_memory | 1 | step_forward | 4.90 | 1.63 | south | standing | succeeded | none | plain_floor | no | no |
| adaptive_risk_memory | 2 | probe_forward | 4.90 | 1.63 | south | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel | no | yes |
| adaptive_risk_memory | 3 | crouch_body | 4.90 | 1.63 | south | crouched | crouched | none | plain_floor | no | no |
| adaptive_risk_memory | 4 | step_forward | 4.90 | 2.41 | south | crouched | succeeded | none | low_clearance_tunnel | no | no |
| adaptive_risk_memory | 5 | step_forward | 4.90 | 3.19 | south | crouched | succeeded | none | low_clearance_tunnel | no | no |
| adaptive_risk_memory | 6 | step_forward | 4.90 | 3.97 | south | crouched | succeeded | none | raised_pressure_surface | no | no |
| adaptive_risk_memory | 7 | recenter_body | 4.90 | 3.97 | south | crouched | recentered | none | raised_pressure_surface | no | no |
| adaptive_risk_memory | 8 | pause | 4.90 | 3.97 | south | crouched | paused | none | raised_pressure_surface | no | no |
| adaptive_risk_memory | 9 | step_forward | 4.90 | 4.75 | south | crouched | succeeded | none | raised_pressure_surface | no | no |
| adaptive_risk_memory | 10 | step_forward | 4.90 | 5.53 | south | crouched | drop_warning | none | ledge_drop_warning | yes | no |
| adaptive_risk_memory | 11 | probe_forward | 4.90 | 5.53 | south | crouched | probe_drop_warning | ledge_drop | ledge_drop_warning | yes | no |
| adaptive_risk_memory | 12 | step_forward | 4.90 | 6.31 | south | crouched | drop_warning | none | ledge_drop_warning | yes | no |
| adaptive_risk_memory | 13 | probe_forward | 4.90 | 6.31 | south | crouched | probe_height_warning | none | ramp_load_shift, ledge_drop_warning | yes | no |
| adaptive_risk_memory | 14 | step_forward | 4.90 | 7.09 | south | crouched | succeeded | none | ramp_load_shift | no | no |
