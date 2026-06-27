# Tiny Physics Nursery Hidden Truth Log

Debug/evaluation truth for the human watcher and pass/fail checks. The robot-facing logs do not read this file.

| run | tick | action | true x | true y | true facing | true movement result | true blocker | true terrain | torso contact | base contact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | step_forward | 2.00 | 0.34 | north | blocked | room_boundary | plain_floor | yes | no |
| run_1 | 2 | turn_right | 2.00 | 0.34 | east | turned | none | plain_floor | no | no |
| run_1 | 3 | step_forward | 2.82 | 0.34 | east | succeeded | none | plain_floor | no | no |
| run_1 | 4 | step_forward | 3.11 | 0.34 | east | partial | low_obstacle | plain_floor | no | yes |
| run_1 | 5 | turn_right | 3.11 | 0.34 | south | turned | none | plain_floor | no | no |
| run_1 | 6 | step_forward | 3.11 | 1.16 | south | succeeded | none | plain_floor | no | no |
| run_1 | 7 | step_forward | 3.11 | 1.98 | south | succeeded | none | uneven_pressure_patch | no | no |
| run_1 | 8 | pause | 3.11 | 1.98 | south | paused | none | uneven_pressure_patch | no | no |
| run_1 | 9 | step_forward | 3.11 | 2.80 | south | succeeded | none | uneven_pressure_patch, airflow_zone | no | no |
| run_1 | 10 | step_forward | 3.11 | 3.62 | south | succeeded | none | uneven_pressure_patch, airflow_zone | no | no |
| run_1 | 11 | step_forward | 3.11 | 4.44 | south | warning | none | airflow_zone, curb_warning_zone | no | yes |
| run_2 | 1 | probe_forward | 2.00 | 0.72 | north | probe_blocked | room_boundary | plain_floor | no | no |
| run_2 | 2 | turn_right | 2.00 | 0.72 | east | turned | none | plain_floor | no | no |
| run_2 | 3 | step_forward | 2.82 | 0.72 | east | succeeded | none | plain_floor | no | no |
| run_2 | 4 | probe_forward | 2.82 | 0.72 | east | probe_warning | low_obstacle | plain_floor | no | yes |
| run_2 | 5 | turn_right | 2.82 | 0.72 | south | turned | none | plain_floor | no | no |
| run_2 | 6 | step_forward | 2.82 | 1.54 | south | succeeded | none | uneven_pressure_patch | no | no |
| run_2 | 7 | recenter_body | 2.82 | 1.54 | south | recentered | none | uneven_pressure_patch | no | no |
| run_2 | 8 | step_forward | 2.82 | 2.36 | south | succeeded | none | uneven_pressure_patch, airflow_zone | no | no |
| run_2 | 9 | pause | 2.82 | 2.36 | south | paused | none | uneven_pressure_patch, airflow_zone | no | no |
| run_2 | 10 | probe_forward | 2.82 | 2.36 | south | succeeded | none | uneven_pressure_patch, airflow_zone | no | no |
| run_2 | 11 | step_forward | 2.82 | 3.18 | south | succeeded | none | uneven_pressure_patch, airflow_zone | no | no |
| run_2 | 12 | probe_forward | 2.82 | 3.18 | south | probe_warning | curb_warning | uneven_pressure_patch, airflow_zone | no | yes |
