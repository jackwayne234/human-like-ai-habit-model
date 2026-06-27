# Tiny Physics Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature labels.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | step_forward | n | threshold_hit | touch_torso_front | 1.00 | 0.00 | at_threshold |
| run_1 | 1 | step_forward | n | threshold_hit | ultrasonic_echo | 0.98 | 0.00 | at_threshold |
| run_1 | 1 | step_forward | n | threshold_hit | reflection_volume | 0.98 | 0.00 | at_threshold |
| run_1 | 1 | step_forward | n | movement_blocked_threshold | movement_result | 1.00 | 0.00 | at_threshold |
| run_1 | 1 | step_forward | n^-1 | cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume | 2.00 | 0.00 | agreement |
| run_1 | 2 | turn_right | n^-1 | rate_of_change_within_sensor | touch_torso_front | 0.04 | -0.96 | falling |
| run_1 | 2 | turn_right | n^-1 | rate_of_change_within_sensor | pressure_capsule_front | 0.18 | -0.54 | falling |
| run_1 | 2 | turn_right | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.31 | -0.67 | falling |
| run_1 | 2 | turn_right | n^-1 | rate_of_change_within_sensor | reflection_volume | 0.25 | -0.73 | falling |
| run_1 | 2 | turn_right | n^-1 | movement_result_change | movement_result | 0.12 | -0.88 | falling |
| run_1 | 2 | turn_right | n^-1 | cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume | 2.00 | 0.00 | agreement |
| run_1 | 3 | step_forward | n^-2 | compact_pattern_shift | compact trigger stream | 0.96 | 0.96 | rising |
| run_1 | 3 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.54 | 0.54 | rising |
| run_1 | 3 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 1.06 | 1.06 | rising |
| run_1 | 3 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 1.05 | 1.05 | rising |
| run_1 | 3 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.01 | 1.01 | rising |
| run_1 | 4 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.76 | 0.70 | rising |
| run_1 | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.70 | 0.70 | rising |
| run_1 | 4 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_front | 0.72 | 0.54 | rising |
| run_1 | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.54 | 0.54 | rising |
| run_1 | 4 | step_forward | n^-1 | movement_result_change | movement_result | 0.78 | 0.53 | rising |
| run_1 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.70 | falling |
| run_1 | 5 | turn_right | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.40 | -1.40 | falling |
| run_1 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | pressure_capsule_front | 0.18 | -0.54 | falling |
| run_1 | 5 | turn_right | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.08 | -1.08 | falling |
| run_1 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.84 | falling |
| run_1 | 5 | turn_right | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.98 | -0.98 | falling |
| run_1 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | reflection_volume | 0.00 | -0.69 | falling |
| run_1 | 5 | turn_right | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.81 | -0.81 | falling |
| run_1 | 5 | turn_right | n^-1 | movement_result_change | movement_result | 0.12 | -0.66 | falling |
| run_1 | 5 | turn_right | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.19 | -1.19 | falling |
| run_1 | 5 | turn_right | n^-1 | cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume | 2.00 | 0.00 | agreement |
| run_1 | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.70 | 0.70 | rising |
| run_1 | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.54 | 0.54 | rising |
| run_1 | 6 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.84 | 0.84 | rising |
| run_1 | 6 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.69 | 0.69 | rising |
| run_1 | 6 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.79 | 0.79 | rising |
| run_1 | 7 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.84 | 0.62 | rising |
| run_1 | 7 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.62 | 0.62 | rising |
| run_1 | 8 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.62 | -0.62 | falling |
| run_1 | 9 | step_forward | n^-1 | rate_of_change_within_sensor | airflow | 0.82 | 0.70 | rising |
| run_1 | 9 | step_forward | n^-2 | external_pressure_pattern_shift | compact trigger stream | 0.70 | 0.70 | rising |
| run_1 | 10 | step_forward | n^-2 | external_pressure_pattern_shift | compact trigger stream | 0.70 | -0.70 | falling |
| run_1 | 11 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.88 | 0.72 | rising |
| run_1 | 11 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| run_2 | 2 | turn_right | n^-1 | rate_of_change_within_sensor | touch_torso_front | 0.04 | -0.50 | falling |
| run_2 | 2 | turn_right | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.31 | -0.51 | falling |
| run_2 | 2 | turn_right | n^-1 | movement_result_change | movement_result | 0.12 | -0.74 | falling |
| run_2 | 3 | step_forward | n^-2 | compact_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| run_2 | 3 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.90 | 0.90 | rising |
| run_2 | 3 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| run_2 | 3 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| run_2 | 4 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.76 | 0.70 | rising |
| run_2 | 4 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.70 | 0.70 | rising |
| run_2 | 4 | probe_forward | n^-1 | movement_result_change | movement_result | 0.72 | 0.47 | rising |
| run_2 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.70 | falling |
| run_2 | 5 | turn_right | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.40 | -1.40 | falling |
| run_2 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.70 | falling |
| run_2 | 5 | turn_right | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.70 | -0.70 | falling |
| run_2 | 5 | turn_right | n^-1 | rate_of_change_within_sensor | reflection_volume | 0.00 | -0.57 | falling |
| run_2 | 5 | turn_right | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.57 | -0.57 | falling |
| run_2 | 5 | turn_right | n^-1 | movement_result_change | movement_result | 0.12 | -0.60 | falling |
| run_2 | 5 | turn_right | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.07 | -1.07 | falling |
| run_2 | 5 | turn_right | n^-1 | cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume | 2.00 | 0.00 | agreement |
| run_2 | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.80 | 0.80 | rising |
| run_2 | 6 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.84 | 0.62 | rising |
| run_2 | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.62 | 0.62 | rising |
| run_2 | 6 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.70 | 0.70 | rising |
| run_2 | 6 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.57 | 0.57 | rising |
| run_2 | 6 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.73 | 0.73 | rising |
| run_2 | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.62 | -0.62 | falling |
| run_2 | 8 | step_forward | n^-1 | rate_of_change_within_sensor | airflow | 0.82 | 0.70 | rising |
| run_2 | 8 | step_forward | n^-2 | external_pressure_pattern_shift | compact trigger stream | 0.70 | 0.70 | rising |
| run_2 | 9 | pause | n^-2 | external_pressure_pattern_shift | compact trigger stream | 0.70 | -0.70 | falling |
| run_2 | 12 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.76 | 0.60 | rising |
| run_2 | 12 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.60 | 0.60 | rising |
| run_2 | 12 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.68 | 0.64 | rising |
| run_2 | 12 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.64 | 0.64 | rising |
| run_2 | 12 | probe_forward | n^-1 | movement_result_change | movement_result | 0.72 | 0.47 | rising |
