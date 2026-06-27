# Layered 2.5D Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| training_room | 4 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| training_room | 4 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.95 | 0.87 | rising |
| training_room | 4 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| training_room | 4 | step_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.10 | -0.74 | falling |
| training_room | 4 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| training_room | 4 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.50 | falling |
| training_room | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| training_room | 4 | step_forward | n^-1 | movement_result_change | movement_result | 0.74 | 0.49 | rising |
| training_room | 5 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.68 | 0.58 | rising |
| training_room | 5 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| training_room | 5 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| training_room | 5 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| training_room | 5 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.64 | 0.46 | rising |
| training_room | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| training_room | 5 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| training_room | 5 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| training_room | 6 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| training_room | 6 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| training_room | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| training_room | 6 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.72 | falling |
| training_room | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| training_room | 6 | step_forward | n | threshold_hit | ultrasonic_echo | 0.95 | 0.00 | at_threshold |
| training_room | 7 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| training_room | 7 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.50 | falling |
| training_room | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | 0.60 | rising |
| training_room | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| training_room | 7 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.95 | falling |
| training_room | 7 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 1.09 | -1.09 | falling |
| training_room | 8 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| training_room | 8 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| training_room | 8 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.95 | 0.95 | rising |
| training_room | 9 | pause | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| training_room | 9 | pause | n^-1 | movement_result_change | movement_result | 0.08 | -0.84 | falling |
| training_room | 9 | pause | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| training_room | 10 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| training_room | 10 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| training_room | 10 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| training_room | 10 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| training_room | 10 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| training_room | 10 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| training_room | 10 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| training_room | 10 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| training_room | 10 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| training_room | 10 | step_forward | n^-1 | movement_result_change | movement_result | 0.92 | 0.84 | rising |
| training_room | 10 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.68 | 1.68 | rising |
| layered_naive | 3 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.58 | 0.50 | rising |
| layered_naive | 3 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| layered_naive | 3 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| layered_naive | 3 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| layered_naive | 3 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.58 | falling |
| layered_naive | 3 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| layered_naive | 3 | step_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.10 | -0.74 | falling |
| layered_naive | 3 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| layered_naive | 3 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.50 | falling |
| layered_naive | 3 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| layered_naive | 3 | step_forward | n^-1 | cross_sensor_compact_agreement | foot_drop_warning, body_pitch_pressure | 2.00 | 0.00 | agreement |
| layered_naive | 4 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| layered_naive | 4 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.74 | 0.60 | rising |
| layered_naive | 4 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.20 | 1.20 | rising |
| layered_naive | 4 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.86 | 0.72 | rising |
| layered_naive | 4 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.30 | 1.30 | rising |
| layered_naive | 4 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| layered_naive | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| layered_naive | 4 | step_forward | n^-1 | movement_result_change | movement_result | 0.74 | 0.49 | rising |
| layered_naive | 4 | step_forward | n^-1 | cross_sensor_compact_agreement | foot_drop_warning, body_pitch_pressure | 2.00 | 0.00 | agreement |
| layered_naive | 5 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.68 | 0.58 | rising |
| layered_naive | 5 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| layered_naive | 5 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| layered_naive | 5 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| layered_naive | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.20 | -1.20 | falling |
| layered_naive | 5 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.64 | 0.46 | rising |
| layered_naive | 5 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.72 | falling |
| layered_naive | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.44 | -1.44 | falling |
| layered_naive | 5 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.49 | falling |
| layered_naive | 5 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.98 | -0.98 | falling |
| layered_naive | 5 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| layered_naive | 6 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| layered_naive | 6 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.50 | falling |
| layered_naive | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | 0.60 | rising |
| layered_naive | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| layered_naive | 6 | step_forward | n^-1 | movement_result_change | movement_result | 0.92 | 0.67 | rising |
| layered_naive | 6 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.16 | 1.16 | rising |
| layered_naive | 7 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| layered_naive | 7 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| layered_naive | 7 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.91 | falling |
| layered_naive | 7 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 1.05 | -1.05 | falling |
| layered_naive | 7 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.67 | -0.67 | falling |
| layered_naive | 8 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| layered_naive | 8 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.91 | 0.91 | rising |
| layered_naive | 9 | pause | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| layered_naive | 9 | pause | n^-1 | movement_result_change | movement_result | 0.08 | -0.84 | falling |
| layered_naive | 9 | pause | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| layered_naive | 10 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| layered_naive | 10 | step_forward | n^-1 | movement_result_change | movement_result | 0.92 | 0.84 | rising |
| layered_naive | 10 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.68 | 1.68 | rising |
| layered_naive | 11 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.67 | falling |
| layered_naive | 11 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.51 | -1.51 | falling |
| layered_naive | 12 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| layered_naive | 12 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| layered_naive | 12 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| layered_naive | 12 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| layered_naive | 12 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.10 | -0.58 | falling |
| layered_naive | 12 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.46 | falling |
| layered_naive | 12 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| layered_naive | 12 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| layered_naive | 12 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.67 | 0.67 | rising |
| layered_naive | 12 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| layered_transfer | 4 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| layered_transfer | 4 | probe_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.95 | 0.87 | rising |
| layered_transfer | 4 | probe_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| layered_transfer | 4 | probe_forward | n^-1 | movement_result_change | movement_result | 0.70 | 0.45 | rising |
| layered_transfer | 5 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 1.24 | -1.24 | falling |
| layered_transfer | 5 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| layered_transfer | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| layered_transfer | 5 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.58 | falling |
| layered_transfer | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| layered_transfer | 5 | step_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.10 | -0.74 | falling |
| layered_transfer | 5 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| layered_transfer | 5 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.50 | falling |
| layered_transfer | 5 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| layered_transfer | 5 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.45 | falling |
| layered_transfer | 5 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| layered_transfer | 6 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| layered_transfer | 6 | probe_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| layered_transfer | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.74 | 0.60 | rising |
| layered_transfer | 6 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.20 | 1.20 | rising |
| layered_transfer | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.86 | 0.72 | rising |
| layered_transfer | 6 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.30 | 1.30 | rising |
| layered_transfer | 6 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| layered_transfer | 6 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| layered_transfer | 6 | probe_forward | n^-1 | movement_result_change | movement_result | 0.82 | 0.57 | rising |
| layered_transfer | 6 | probe_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.02 | 1.02 | rising |
| layered_transfer | 6 | probe_forward | n^-1 | cross_sensor_compact_agreement | foot_drop_warning, body_pitch_pressure | 2.00 | 0.00 | agreement |
| layered_transfer | 7 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| layered_transfer | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| layered_transfer | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| layered_transfer | 7 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.65 | -0.65 | falling |
| layered_transfer | 8 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| layered_transfer | 9 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.68 | 0.58 | rising |
| layered_transfer | 9 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| layered_transfer | 9 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.60 | falling |
| layered_transfer | 9 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | -0.60 | falling |
| layered_transfer | 9 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.64 | 0.46 | rising |
| layered_transfer | 9 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.72 | falling |
| layered_transfer | 9 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| layered_transfer | 9 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.57 | falling |
| layered_transfer | 9 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.65 | -0.65 | falling |
| layered_transfer | 9 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| layered_transfer | 10 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| layered_transfer | 10 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.60 | 0.60 | rising |
| layered_transfer | 10 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| layered_transfer | 10 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| layered_transfer | 10 | probe_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.16 | 1.16 | rising |
| layered_transfer | 11 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| layered_transfer | 11 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| layered_transfer | 11 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| layered_transfer | 11 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.27 | -1.27 | falling |
| layered_transfer | 12 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| layered_transfer | 12 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.50 | falling |
| layered_transfer | 12 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| layered_transfer | 12 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.77 | falling |
| layered_transfer | 12 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.77 | -0.77 | falling |
| layered_transfer | 12 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.77 | 0.77 | rising |
