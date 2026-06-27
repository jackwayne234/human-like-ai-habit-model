# Tiny 2.5D Nursery Hidden Truth Log

Debug/evaluation truth for the human watcher and pass/fail checks. The robot-facing logs do not read this file.

| run | tick | action | true x | true y | true facing | true posture | true movement result | true blocker | true terrain | foot drop | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | step_forward | 2.15 | 1.78 | south | standing | succeeded | none | ramp_load_shift | no | no |
| run_1 | 2 | step_forward | 2.15 | 2.56 | south | standing | succeeded | none | ramp_load_shift | no | no |
| run_1 | 3 | step_forward | 2.15 | 3.34 | south | standing | succeeded | none | ramp_load_shift | no | no |
| run_1 | 4 | step_forward | 2.15 | 4.12 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| run_1 | 5 | step_forward | 2.15 | 4.90 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| run_1 | 6 | step_forward | 2.15 | 5.23 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| run_1 | 7 | step_forward | 2.15 | 5.55 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| run_1 | 8 | step_forward | 2.15 | 5.88 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| run_1 | 9 | pause | 2.15 | 5.88 | south | standing | paused | low_clearance | low_clearance_tunnel | no | yes |
| run_1 | 10 | step_forward | 2.15 | 6.21 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel, raised_pressure_surface | no | yes |
| run_2 | 1 | step_forward | 2.15 | 1.78 | south | standing | succeeded | none | ramp_load_shift | no | no |
| run_2 | 2 | recenter_body | 2.15 | 1.78 | south | standing | recentered | none | ramp_load_shift | no | no |
| run_2 | 3 | step_forward | 2.15 | 2.56 | south | standing | succeeded | none | ramp_load_shift | no | no |
| run_2 | 4 | probe_forward | 2.15 | 2.56 | south | standing | probe_height_warning | none | ramp_load_shift | no | no |
| run_2 | 5 | step_forward | 2.15 | 3.34 | south | standing | succeeded | none | ramp_load_shift | no | no |
| run_2 | 6 | probe_forward | 2.15 | 3.34 | south | standing | probe_drop_warning | ledge_drop | ledge_drop_warning, ramp_load_shift | yes | no |
| run_2 | 7 | step_forward | 2.15 | 4.12 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| run_2 | 8 | probe_forward | 2.15 | 4.12 | south | standing | probe_drop_warning | ledge_drop | ledge_drop_warning | yes | no |
| run_2 | 9 | step_forward | 2.15 | 4.90 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| run_2 | 10 | probe_forward | 2.15 | 4.90 | south | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel, ledge_drop_warning | yes | yes |
| run_2 | 11 | crouch_body | 2.15 | 4.90 | south | crouched | crouched | none | ledge_drop_warning | yes | no |
| run_2 | 12 | step_forward | 2.15 | 5.68 | south | crouched | succeeded | none | low_clearance_tunnel | no | no |
