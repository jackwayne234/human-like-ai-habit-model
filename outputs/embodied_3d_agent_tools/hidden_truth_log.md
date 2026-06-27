# Embodied 3D Agent Tool Boundary Hidden Truth Log

Human evaluation only. Agent-facing tools do not return this file's fields.

| tick | action | true x | true y | true base z | true top z | posture | movement result | blocker | terrain | overhead contact | step warning | drop warning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | step_forward | 4.90 | 1.59 | 0.00 | 1.60 | standing | succeeded | none | plain_floor | no | no | no |
| 2 | probe_forward | 4.90 | 1.59 | 0.00 | 1.60 | standing | probe_overhead_warning | low_ceiling | low_ceiling_span | yes | no | no |
| 3 | crouch_body | 4.90 | 1.59 | 0.00 | 1.00 | crouched | crouched | none | plain_floor | no | no | no |
| 4 | probe_forward | 4.90 | 1.59 | 0.00 | 1.00 | crouched | succeeded | none | low_ceiling_span | no | no | no |
| 5 | step_forward | 4.90 | 2.33 | 0.00 | 1.00 | crouched | succeeded | none | low_ceiling_span | no | no | no |
| 6 | step_forward | 4.90 | 3.07 | 0.00 | 1.00 | crouched | succeeded | none | plain_floor | no | no | no |
| 7 | probe_forward | 4.90 | 3.07 | 0.00 | 1.00 | crouched | probe_step_warning | step_block | raised_step_block | no | yes | no |
| 8 | step_up | 4.90 | 3.07 | 0.55 | 1.55 | crouched | stepped_up | none | plain_floor | no | no | no |
| 9 | step_forward | 4.90 | 3.81 | 0.55 | 1.55 | crouched | succeeded | none | raised_step_block | no | no | no |
| 10 | step_forward | 4.90 | 4.55 | 0.55 | 1.55 | crouched | succeeded | none | raised_step_block | no | no | no |
| 11 | step_forward | 4.90 | 5.29 | 0.00 | 1.00 | crouched | succeeded | none | plain_floor | no | no | no |
| 12 | probe_forward | 4.90 | 5.29 | 0.00 | 1.00 | crouched | probe_drop_warning | floor_drop | floor_drop_gap | no | no | yes |
| 13 | step_down | 4.90 | 5.29 | -0.45 | 0.55 | crouched | stepped_down | none | plain_floor | no | no | no |
| 14 | step_forward | 4.90 | 6.03 | -0.45 | 0.55 | crouched | succeeded | none | floor_drop_gap | no | no | yes |
| 15 | step_forward | 4.90 | 6.77 | -0.45 | 0.55 | crouched | succeeded | none | floor_drop_gap | no | no | yes |
| 16 | probe_forward | 4.90 | 6.77 | -0.45 | 0.55 | crouched | overhead_blocked | hanging_bar | hanging_bar, floor_drop_gap | yes | no | yes |
