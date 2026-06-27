# Habit Promotion 2.5D Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| case | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| normal_low_tunnel | 2 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| normal_low_tunnel | 2 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| normal_low_tunnel | 3 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| normal_low_tunnel | 3 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| normal_low_tunnel | 3 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| normal_low_tunnel | 3 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.27 | -1.27 | falling |
| normal_low_tunnel | 4 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| normal_low_tunnel | 4 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.82 | falling |
| normal_low_tunnel | 4 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.82 | -0.82 | falling |
| normal_low_tunnel | 4 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.77 | 0.77 | rising |
| normal_low_tunnel | 5 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.82 | 0.82 | rising |
| normal_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| normal_low_tunnel | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| normal_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| normal_low_tunnel | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| normal_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| normal_low_tunnel | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| normal_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.68 | falling |
| normal_low_tunnel | 6 | step_forward | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.68 | -0.68 | falling |
| normal_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| normal_low_tunnel | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| normal_low_tunnel | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| normal_low_tunnel | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| normal_low_tunnel | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| normal_low_tunnel | 7 | recenter_body | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.68 | 0.68 | rising |
| normal_low_tunnel | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| early_low_tunnel | 2 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| early_low_tunnel | 2 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| early_low_tunnel | 3 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| early_low_tunnel | 3 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| early_low_tunnel | 3 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| early_low_tunnel | 3 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.27 | -1.27 | falling |
| early_low_tunnel | 4 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| early_low_tunnel | 4 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.78 | falling |
| early_low_tunnel | 4 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.78 | -0.78 | falling |
| early_low_tunnel | 4 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.77 | 0.77 | rising |
| early_low_tunnel | 5 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.78 | 0.78 | rising |
| early_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| early_low_tunnel | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| early_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| early_low_tunnel | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| early_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| early_low_tunnel | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| early_low_tunnel | 6 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| early_low_tunnel | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| early_low_tunnel | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| early_low_tunnel | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| early_low_tunnel | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| early_low_tunnel | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| early_low_tunnel | 9 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.46 | falling |
| after_raised_surface | 4 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.72 | falling |
| after_raised_surface | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| after_raised_surface | 4 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.06 | -0.72 | falling |
| after_raised_surface | 4 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| after_raised_surface | 4 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.68 | 0.58 | rising |
| after_raised_surface | 4 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| after_raised_surface | 4 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.64 | 0.46 | rising |
| after_raised_surface | 4 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.58 | falling |
| after_raised_surface | 4 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| after_raised_surface | 4 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| after_raised_surface | 5 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| after_raised_surface | 5 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| after_raised_surface | 5 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| after_raised_surface | 5 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| after_raised_surface | 5 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| after_raised_surface | 6 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| after_raised_surface | 6 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| after_raised_surface | 6 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| after_raised_surface | 6 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.27 | -1.27 | falling |
| after_raised_surface | 7 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| after_raised_surface | 7 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.84 | falling |
| after_raised_surface | 7 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| after_raised_surface | 7 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.77 | 0.77 | rising |
| after_raised_surface | 8 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.84 | 0.84 | rising |
| after_raised_surface | 9 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.68 | falling |
| after_raised_surface | 9 | step_forward | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.68 | -0.68 | falling |
| side_echo_false_alarm | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| side_echo_false_alarm | 6 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| side_echo_false_alarm | 7 | recenter_body | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.72 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.44 | -1.44 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.06 | -0.72 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.44 | -1.44 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.74 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 1.48 | -1.48 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.58 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 1.16 | -1.16 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| side_echo_false_alarm | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| side_echo_false_alarm | 8 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.44 | 1.44 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.44 | 1.44 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.48 | 1.48 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 1.16 | 1.16 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.84 | 0.84 | rising |
| side_echo_false_alarm | 8 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.84 | 0.84 | rising |
| side_echo_false_alarm | 9 | pause | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.72 | falling |
| side_echo_false_alarm | 9 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.44 | -1.44 | falling |
| side_echo_false_alarm | 9 | pause | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.06 | -0.72 | falling |
| side_echo_false_alarm | 9 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 1.44 | -1.44 | falling |
| side_echo_false_alarm | 9 | pause | n^-1 | rate_of_change_within_sensor | height_pressure | 0.14 | -0.74 | falling |
| side_echo_false_alarm | 9 | pause | n^-2 | height_load_pattern_shift | compact trigger stream | 1.48 | -1.48 | falling |
| side_echo_false_alarm | 9 | pause | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.58 | falling |
| side_echo_false_alarm | 9 | pause | n^-2 | height_load_pattern_shift | compact trigger stream | 1.16 | -1.16 | falling |
| side_echo_false_alarm | 9 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| side_echo_false_alarm | 9 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.84 | -0.84 | falling |
| too_low_even_crouched | 2 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| too_low_even_crouched | 2 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| too_low_even_crouched | 3 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| too_low_even_crouched | 3 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| too_low_even_crouched | 3 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| too_low_even_crouched | 3 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.27 | -1.27 | falling |
| too_low_even_crouched | 4 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| too_low_even_crouched | 4 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 1.00 | 0.58 | rising |
| too_low_even_crouched | 4 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 1.16 | 1.16 | rising |
| too_low_even_crouched | 4 | step_forward | n | threshold_hit | ultrasonic_echo | 0.96 | 0.00 | at_threshold |
| too_low_even_crouched | 4 | step_forward | n^-1 | movement_result_change | movement_result | 0.92 | 0.76 | rising |
| too_low_even_crouched | 4 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.44 | 1.44 | rising |
| too_low_even_crouched | 5 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| too_low_even_crouched | 5 | step_forward | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| too_low_even_crouched | 5 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.96 | falling |
| too_low_even_crouched | 5 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 1.10 | -1.10 | falling |
| too_low_even_crouched | 5 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.76 | -0.76 | falling |
| too_low_even_crouched | 6 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| too_low_even_crouched | 6 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.96 | 0.96 | rising |
| too_low_even_crouched | 7 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| too_low_even_crouched | 8 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| too_low_even_crouched | 8 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| too_low_even_crouched | 8 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| too_low_even_crouched | 8 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| too_low_even_crouched | 8 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| too_low_even_crouched | 8 | step_forward | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| too_low_even_crouched | 8 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| too_low_even_crouched | 8 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| too_low_even_crouched | 8 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| too_low_even_crouched | 8 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| too_low_even_crouched | 8 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.67 | falling |
| too_low_even_crouched | 8 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.67 | -0.67 | falling |
| too_low_even_crouched | 9 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| too_low_even_crouched | 9 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| too_low_even_crouched | 9 | recenter_body | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| too_low_even_crouched | 9 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| too_low_even_crouched | 9 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| too_low_even_crouched | 9 | recenter_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.62 | 0.62 | rising |
