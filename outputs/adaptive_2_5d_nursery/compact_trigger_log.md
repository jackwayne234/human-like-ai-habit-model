# Adaptive 2.5D Nursery Compact Trigger Log

Robot-facing compact perception only. This log intentionally omits hidden simulator coordinates and room feature objects.

| run | tick | action | layer | event | stream | value | signed change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| adaptive_naive | 2 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| adaptive_naive | 2 | step_forward | n | threshold_hit | ultrasonic_echo | 0.96 | 0.00 | at_threshold |
| adaptive_naive | 2 | step_forward | n^-1 | movement_result_change | movement_result | 0.92 | 0.67 | rising |
| adaptive_naive | 3 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| adaptive_naive | 3 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.96 | falling |
| adaptive_naive | 3 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 1.10 | -1.10 | falling |
| adaptive_naive | 3 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.67 | -0.67 | falling |
| adaptive_naive | 4 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| adaptive_naive | 4 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.96 | 0.96 | rising |
| adaptive_naive | 5 | step_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| adaptive_naive | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| adaptive_naive | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_naive | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| adaptive_naive | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_naive | 6 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| adaptive_naive | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| adaptive_naive | 6 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| adaptive_naive | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| adaptive_naive | 6 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.67 | falling |
| adaptive_naive | 6 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.67 | -0.67 | falling |
| adaptive_naive | 7 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_naive | 7 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_naive | 7 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.10 | -0.58 | falling |
| adaptive_naive | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| adaptive_naive | 7 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.46 | falling |
| adaptive_naive | 7 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| adaptive_naive | 7 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.67 | 0.67 | rising |
| adaptive_naive | 7 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2.00 | 0.00 | agreement |
| adaptive_naive | 8 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.72 | falling |
| adaptive_naive | 8 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_naive | 8 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.06 | -0.72 | falling |
| adaptive_naive | 8 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_naive | 8 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| adaptive_naive | 8 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_naive | 8 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.95 | 0.87 | rising |
| adaptive_naive | 8 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| adaptive_naive | 8 | step_forward | n^-1 | movement_result_change | movement_result | 0.74 | 0.49 | rising |
| adaptive_naive | 9 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_naive | 9 | pause | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_naive | 9 | pause | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_naive | 9 | pause | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| adaptive_naive | 9 | pause | n^-1 | movement_result_change | movement_result | 0.08 | -0.66 | falling |
| adaptive_naive | 9 | pause | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.15 | -1.15 | falling |
| adaptive_naive | 10 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_naive | 10 | step_forward | n^-1 | movement_result_change | movement_result | 0.74 | 0.66 | rising |
| adaptive_naive | 10 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.32 | 1.32 | rising |
| adaptive_naive | 11 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.87 | falling |
| adaptive_naive | 11 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| adaptive_naive | 11 | step_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.84 | 0.74 | rising |
| adaptive_naive | 11 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| adaptive_naive | 11 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.72 | 0.50 | rising |
| adaptive_naive | 11 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| adaptive_naive | 11 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.49 | falling |
| adaptive_naive | 11 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.15 | -1.15 | falling |
| adaptive_naive | 12 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| adaptive_naive | 12 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| adaptive_naive | 12 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| adaptive_risk_memory | 2 | probe_forward | n | low_clearance_threshold | overhead_clearance | 1.00 | 0.00 | at_threshold |
| adaptive_risk_memory | 2 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| adaptive_risk_memory | 3 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.42 | -0.58 | falling |
| adaptive_risk_memory | 3 | crouch_body | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.90 | -0.90 | falling |
| adaptive_risk_memory | 3 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| adaptive_risk_memory | 3 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 1.27 | -1.27 | falling |
| adaptive_risk_memory | 4 | step_forward | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| adaptive_risk_memory | 4 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.00 | -0.82 | falling |
| adaptive_risk_memory | 4 | step_forward | n^-2 | opening_space_pattern_shift | compact trigger stream | 0.82 | -0.82 | falling |
| adaptive_risk_memory | 4 | step_forward | n^-2 | movement_consequence_pattern_shift | compact trigger stream | 0.77 | 0.77 | rising |
| adaptive_risk_memory | 5 | step_forward | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.82 | 0.82 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.78 | 0.72 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.78 | 0.72 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-1 | rate_of_change_within_sensor | height_pressure | 0.88 | 0.74 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.68 | falling |
| adaptive_risk_memory | 6 | step_forward | n^-2 | clearance_opening_pattern_shift | compact trigger stream | 0.68 | -0.68 | falling |
| adaptive_risk_memory | 6 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.72 | 0.58 | rising |
| adaptive_risk_memory | 6 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | 0.58 | rising |
| adaptive_risk_memory | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_risk_memory | 7 | recenter_body | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_risk_memory | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| adaptive_risk_memory | 7 | recenter_body | n^-2 | overhead_clearance_pattern_shift | compact trigger stream | 0.68 | 0.68 | rising |
| adaptive_risk_memory | 7 | recenter_body | n^-2 | height_load_pattern_shift | compact trigger stream | 0.58 | -0.58 | falling |
| adaptive_risk_memory | 10 | step_forward | n^-1 | rate_of_change_within_sensor | touch_left_base | 0.06 | -0.72 | falling |
| adaptive_risk_memory | 10 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_risk_memory | 10 | step_forward | n^-1 | rate_of_change_within_sensor | touch_right_base | 0.06 | -0.72 | falling |
| adaptive_risk_memory | 10 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | -0.72 | falling |
| adaptive_risk_memory | 10 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_risk_memory | 10 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.95 | 0.87 | rising |
| adaptive_risk_memory | 10 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | 0.87 | rising |
| adaptive_risk_memory | 10 | step_forward | n^-1 | movement_result_change | movement_result | 0.74 | 0.49 | rising |
| adaptive_risk_memory | 11 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_risk_memory | 11 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.72 | 0.72 | rising |
| adaptive_risk_memory | 11 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_risk_memory | 11 | probe_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| adaptive_risk_memory | 12 | step_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_risk_memory | 13 | probe_forward | n | drop_warning_threshold | foot_drop_warning | 0.95 | 0.00 | at_threshold |
| adaptive_risk_memory | 13 | probe_forward | n^-1 | rate_of_change_within_sensor | ramp_load_shift | 0.84 | 0.74 | rising |
| adaptive_risk_memory | 13 | probe_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | 0.74 | rising |
| adaptive_risk_memory | 13 | probe_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.72 | 0.50 | rising |
| adaptive_risk_memory | 13 | probe_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | 0.50 | rising |
| adaptive_risk_memory | 14 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.08 | -0.87 | falling |
| adaptive_risk_memory | 14 | step_forward | n^-2 | foot_drop_pattern_shift | compact trigger stream | 0.87 | -0.87 | falling |
| adaptive_risk_memory | 14 | step_forward | n^-2 | height_load_pattern_shift | compact trigger stream | 0.74 | -0.74 | falling |
| adaptive_risk_memory | 14 | step_forward | n^-2 | body_pressure_pattern_shift | compact trigger stream | 0.50 | -0.50 | falling |
| adaptive_risk_memory | 14 | step_forward | n^-1 | movement_result_change | movement_result | 0.25 | -0.45 | falling |
