# Tiny 2.5D Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 4 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_1 | 4 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.95 | 0.87 | rising |
| run_1 | 4 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| run_1 | 4 | step_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.10 | -0.74 | falling |
| run_1 | 4 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| run_1 | 4 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.50 | falling |
| run_1 | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| run_1 | 4 | step_forward | n^-1 | movement_result_change | movement_result | 0.74 | 0.49 | rising |
| run_1 | 5 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.68 | 0.58 | rising |
| run_1 | 5 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| run_1 | 5 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_1 | 5 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| run_1 | 5 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.64 | 0.46 | rising |
| run_1 | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| run_1 | 5 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| run_1 | 5 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| run_1 | 6 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| run_1 | 6 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| run_1 | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| run_1 | 6 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.72 | falling |
| run_1 | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| run_1 | 6 | step_forward | n | threshold_hit | ultrasonic_echo | 0.95 | 0.00 | at_threshold |
| run_1 | 7 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| run_1 | 7 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.50 | falling |
| run_1 | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | 0.60 | rising |
| run_1 | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| run_1 | 7 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.95 | falling |
| run_1 | 7 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 1.09 | -1.09 | falling |
| run_1 | 8 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| run_1 | 8 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| run_1 | 8 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.95 | 0.95 | rising |
| run_1 | 9 | pause | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| run_1 | 9 | pause | n^-1 | movement_result_change | movement_result | 0.08 | -0.84 | falling |
| run_1 | 9 | pause | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| run_1 | 10 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| run_1 | 10 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| run_1 | 10 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| run_1 | 10 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| run_1 | 10 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| run_1 | 10 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| run_1 | 10 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| run_1 | 10 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| run_1 | 10 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| run_1 | 10 | step_forward | n^-1 | movement_result_change | movement_result | 0.92 | 0.84 | rising |
| run_1 | 10 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.68 | 1.68 | rising |
| run_2 | 4 | probe_forward | n^-1 | movement_result_change | movement_result | 0.70 | 0.45 | rising |
| run_2 | 5 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.45 | falling |
| run_2 | 5 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| run_2 | 6 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_2 | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.95 | 0.87 | rising |
| run_2 | 6 | probe_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| run_2 | 6 | probe_forward | n^-1 | movement_result_change | movement_result | 0.82 | 0.57 | rising |
| run_2 | 6 | probe_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.02 | 1.02 | rising |
| run_2 | 7 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_2 | 7 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| run_2 | 7 | step_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.10 | -0.74 | falling |
| run_2 | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| run_2 | 7 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.50 | falling |
| run_2 | 7 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| run_2 | 7 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.65 | -0.65 | falling |
| run_2 | 8 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_2 | 8 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| run_2 | 8 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| run_2 | 9 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.68 | 0.58 | rising |
| run_2 | 9 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| run_2 | 9 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_2 | 9 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.64 | 0.46 | rising |
| run_2 | 9 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| run_2 | 10 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| run_2 | 10 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_2 | 11 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| run_2 | 11 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| run_2 | 11 | crouch_body | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| run_2 | 11 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| run_2 | 11 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.78 | -0.78 | falling |
| run_2 | 12 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| run_2 | 12 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.87 | falling |
| run_2 | 12 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| run_2 | 12 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| run_2 | 12 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| run_2 | 12 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.72 | falling |
| run_2 | 12 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| run_2 | 12 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.81 | falling |
| run_2 | 12 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.81 | -0.81 | falling |
| run_2 | 12 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.77 | 0.77 | rising |
| run_2 | 12 | step_forward | n^-1 | cross_sensor_compact_agreement | foot_drop_warning, body_pitch_pressure | 2.00 | 0.00 | agreement |
