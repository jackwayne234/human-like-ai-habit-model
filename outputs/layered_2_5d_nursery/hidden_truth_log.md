# Layered 2.5D Nursery Hidden Truth Log

Debug/evaluation truth for human inspection. Robot-facing compact logs do not read this file.

| run | tick | action | true x | true y | true facing | true posture | true movement result | true blocker | true terrain | foot drop | overhead contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| training_room | 1 | step_forward | 2.15 | 1.78 | south | standing | succeeded | none | ramp_load_shift | no | no |
| training_room | 2 | step_forward | 2.15 | 2.56 | south | standing | succeeded | none | ramp_load_shift | no | no |
| training_room | 3 | step_forward | 2.15 | 3.34 | south | standing | succeeded | none | ramp_load_shift | no | no |
| training_room | 4 | step_forward | 2.15 | 4.12 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| training_room | 5 | step_forward | 2.15 | 4.90 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| training_room | 6 | step_forward | 2.15 | 5.23 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| training_room | 7 | step_forward | 2.15 | 5.55 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| training_room | 8 | step_forward | 2.15 | 5.88 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| training_room | 9 | pause | 2.15 | 5.88 | south | standing | paused | low_clearance | low_clearance_tunnel | no | yes |
| training_room | 10 | step_forward | 2.15 | 6.21 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel, raised_pressure_surface | no | yes |
| layered_naive | 1 | step_forward | 7.20 | 1.78 | south | standing | succeeded | none | ramp_load_shift | no | no |
| layered_naive | 2 | step_forward | 7.20 | 2.56 | south | standing | succeeded | none | ramp_load_shift | no | no |
| layered_naive | 3 | step_forward | 7.20 | 3.34 | south | standing | succeeded | none | plain_floor | no | no |
| layered_naive | 4 | step_forward | 7.20 | 4.12 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| layered_naive | 5 | step_forward | 7.20 | 4.90 | south | standing | succeeded | none | plain_floor | no | no |
| layered_naive | 6 | step_forward | 7.20 | 5.23 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| layered_naive | 7 | step_forward | 7.20 | 5.55 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| layered_naive | 8 | step_forward | 7.20 | 5.88 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| layered_naive | 9 | pause | 7.20 | 5.88 | south | standing | paused | low_clearance | low_clearance_tunnel | no | yes |
| layered_naive | 10 | step_forward | 7.20 | 6.21 | south | standing | overhead_blocked | low_clearance | low_clearance_tunnel | no | yes |
| layered_naive | 11 | step_forward | 7.20 | 6.99 | south | standing | succeeded | none | plain_floor | no | no |
| layered_naive | 12 | step_forward | 7.20 | 7.77 | south | standing | succeeded | none | raised_pressure_surface | no | no |
| layered_transfer | 1 | step_forward | 7.20 | 1.78 | south | standing | succeeded | none | ramp_load_shift | no | no |
| layered_transfer | 2 | recenter_body | 7.20 | 1.78 | south | standing | recentered | none | ramp_load_shift | no | no |
| layered_transfer | 3 | step_forward | 7.20 | 2.56 | south | standing | succeeded | none | ramp_load_shift | no | no |
| layered_transfer | 4 | probe_forward | 7.20 | 2.56 | south | standing | probe_height_warning | none | ledge_drop_warning, ramp_load_shift | yes | no |
| layered_transfer | 5 | step_forward | 7.20 | 3.34 | south | standing | succeeded | none | plain_floor | no | no |
| layered_transfer | 6 | probe_forward | 7.20 | 3.34 | south | standing | probe_drop_warning | ledge_drop | ledge_drop_warning | yes | no |
| layered_transfer | 7 | step_forward | 7.20 | 4.12 | south | standing | drop_warning | none | ledge_drop_warning | yes | no |
| layered_transfer | 8 | probe_forward | 7.20 | 4.12 | south | standing | probe_drop_warning | ledge_drop | ledge_drop_warning | yes | no |
| layered_transfer | 9 | step_forward | 7.20 | 4.90 | south | standing | succeeded | none | plain_floor | no | no |
| layered_transfer | 10 | probe_forward | 7.20 | 4.90 | south | standing | probe_overhead_warning | low_clearance | low_clearance_tunnel | no | yes |
| layered_transfer | 11 | crouch_body | 7.20 | 4.90 | south | crouched | crouched | none | plain_floor | no | no |
| layered_transfer | 12 | step_forward | 7.20 | 5.68 | south | crouched | succeeded | none | low_clearance_tunnel | no | no |
