# Tiny 3D Nursery Compact Trigger Log

Agent-facing compact rows only. Hidden geometry and true coordinates are not included.

| tick | action | layer | event | stream | value | change | direction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | step_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.7 | 0.6 | rising |
| 1 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.66 | 0.48 | rising |
| 1 | step_forward | n^-1 | cross_sensor_compact_agreement | overhead_clearance, vertical_echo | 2 | 0 | agreement |
| 2 | probe_forward | n | top_clearance_threshold | overhead_clearance | 1 | 0 | at_threshold |
| 2 | probe_forward | n | top_clearance_threshold | body_top_pressure | 1 | 0 | at_threshold |
| 2 | probe_forward | n^-1 | rate_of_change_within_sensor | body_top_pressure | 1 | 0.46 | rising |
| 2 | probe_forward | n^-1 | movement_result_change | movement_result | 0.84 | 0.59 | rising |
| 3 | crouch_body | n^-1 | rate_of_change_within_sensor | overhead_clearance | 0.46 | -0.54 | falling |
| 3 | crouch_body | n^-2 | upper_volume_opening_pattern_shift | compact 3d trigger stream | 0.84 | -0.84 | falling |
| 3 | crouch_body | n^-1 | rate_of_change_within_sensor | body_top_pressure | 0.54 | -0.46 | falling |
| 3 | crouch_body | n^-2 | upper_volume_opening_pattern_shift | compact 3d trigger stream | 0.92 | -0.92 | falling |
| 3 | crouch_body | n^-1 | rate_of_change_within_sensor | base_height_shift | 0.9 | 0.82 | rising |
| 3 | crouch_body | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.82 | 0.82 | rising |
| 3 | crouch_body | n^-1 | movement_result_change | movement_result | 0.16 | -0.68 | falling |
| 3 | crouch_body | n^-2 | movement_consequence_pattern_shift | compact 3d trigger stream | 1.27 | -1.27 | falling |
| 4 | probe_forward | n^-2 | upper_volume_closing_pattern_shift | compact 3d trigger stream | 0.54 | 0.54 | rising |
| 4 | probe_forward | n^-2 | upper_volume_closing_pattern_shift | compact 3d trigger stream | 0.64 | 0.64 | rising |
| 4 | probe_forward | n^-1 | rate_of_change_within_sensor | base_height_shift | 0.08 | -0.82 | falling |
| 4 | probe_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 1.64 | -1.64 | falling |
| 4 | probe_forward | n^-2 | movement_consequence_pattern_shift | compact 3d trigger stream | 0.77 | 0.77 | rising |
| 5 | step_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.82 | 0.82 | rising |
| 6 | step_forward | n^-1 | rate_of_change_within_sensor | foot_step_warning | 0.58 | 0.5 | rising |
| 6 | step_forward | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.5 | 0.5 | rising |
| 6 | step_forward | n^-2 | closing_distance_pattern_shift | compact 3d trigger stream | 0.71 | 0.71 | rising |
| 7 | probe_forward | n | raised_support_threshold | foot_step_warning | 0.96 | 0 | at_threshold |
| 7 | probe_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.74 | 0.6 | rising |
| 7 | probe_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.6 | 0.6 | rising |
| 7 | probe_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.7 | 0.48 | rising |
| 7 | probe_forward | n^-1 | movement_result_change | movement_result | 0.72 | 0.47 | rising |
| 8 | step_up | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.76 | -0.76 | falling |
| 8 | step_up | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.64 | -0.64 | falling |
| 8 | step_up | n^-1 | rate_of_change_within_sensor | base_height_shift | 0.9 | 0.82 | rising |
| 8 | step_up | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.82 | 0.82 | rising |
| 8 | step_up | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.6 | -0.6 | falling |
| 8 | step_up | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.48 | falling |
| 8 | step_up | n^-2 | body_load_pattern_shift | compact 3d trigger stream | 0.96 | -0.96 | falling |
| 8 | step_up | n^-2 | movement_consequence_pattern_shift | compact 3d trigger stream | 0.83 | -0.83 | falling |
| 9 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.18 | -0.48 | falling |
| 9 | step_forward | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.64 | 0.64 | rising |
| 9 | step_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 1.1 | -1.1 | falling |
| 9 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.7 | 0.48 | rising |
| 9 | step_forward | n^-2 | body_load_pattern_shift | compact 3d trigger stream | 0.96 | 0.96 | rising |
| 9 | step_forward | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.19 | -0.53 | falling |
| 9 | step_forward | n^-2 | opening_space_pattern_shift | compact 3d trigger stream | 0.53 | -0.53 | falling |
| 10 | step_forward | n^-2 | closing_distance_pattern_shift | compact 3d trigger stream | 0.84 | 0.84 | rising |
| 11 | step_forward | n^-1 | rate_of_change_within_sensor | foot_drop_warning | 0.58 | 0.5 | rising |
| 11 | step_forward | n^-2 | lower_support_pattern_shift | compact 3d trigger stream | 0.5 | 0.5 | rising |
| 11 | step_forward | n^-1 | rate_of_change_within_sensor | base_height_shift | 0.08 | -0.54 | falling |
| 11 | step_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.54 | -0.54 | falling |
| 11 | step_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.14 | -0.6 | falling |
| 11 | step_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.6 | -0.6 | falling |
| 11 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_left | 0.22 | -0.48 | falling |
| 12 | probe_forward | n | lower_support_threshold | foot_drop_warning | 0.96 | 0 | at_threshold |
| 12 | probe_forward | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.68 | 0.68 | rising |
| 12 | probe_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.54 | 0.54 | rising |
| 12 | probe_forward | n^-1 | rate_of_change_within_sensor | body_pitch_pressure | 0.86 | 0.72 | rising |
| 12 | probe_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 1.32 | 1.32 | rising |
| 12 | probe_forward | n^-2 | body_load_pattern_shift | compact 3d trigger stream | 0.54 | 0.54 | rising |
| 12 | probe_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_right | 0.7 | 0.48 | rising |
| 12 | probe_forward | n^-2 | body_load_pattern_shift | compact 3d trigger stream | 0.58 | 0.58 | rising |
| 12 | probe_forward | n^-1 | movement_result_change | movement_result | 0.82 | 0.57 | rising |
| 12 | probe_forward | n^-2 | movement_consequence_pattern_shift | compact 3d trigger stream | 0.57 | 0.57 | rising |
| 13 | step_down | n^-2 | lower_support_pattern_shift | compact 3d trigger stream | 0.76 | -0.76 | falling |
| 13 | step_down | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.72 | -0.72 | falling |
| 13 | step_down | n^-1 | rate_of_change_within_sensor | base_height_shift | 0.9 | 0.82 | rising |
| 13 | step_down | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.82 | 0.82 | rising |
| 13 | step_down | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 0.72 | -0.72 | falling |
| 13 | step_down | n^-1 | rate_of_change_within_sensor | pressure_capsule_right | 0.22 | -0.48 | falling |
| 13 | step_down | n^-2 | body_load_pattern_shift | compact 3d trigger stream | 0.96 | -0.96 | falling |
| 13 | step_down | n^-2 | movement_consequence_pattern_shift | compact 3d trigger stream | 1.01 | -1.01 | falling |
| 14 | step_forward | n^-1 | rate_of_change_within_sensor | foot_step_warning | 0.08 | -0.5 | falling |
| 14 | step_forward | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.5 | -0.5 | falling |
| 14 | step_forward | n | lower_support_threshold | foot_drop_warning | 0.96 | 0 | at_threshold |
| 14 | step_forward | n^-2 | lower_support_pattern_shift | compact 3d trigger stream | 0.76 | 0.76 | rising |
| 14 | step_forward | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.72 | 0.72 | rising |
| 14 | step_forward | n^-2 | body_vertical_motion_pattern_shift | compact 3d trigger stream | 1.1 | -1.1 | falling |
| 14 | step_forward | n^-1 | rate_of_change_within_sensor | pressure_capsule_right | 0.7 | 0.48 | rising |
| 14 | step_forward | n^-2 | body_load_pattern_shift | compact 3d trigger stream | 0.96 | 0.96 | rising |
| 15 | step_forward | n^-1 | rate_of_change_within_sensor | vertical_echo | 0.66 | 0.48 | rising |
| 15 | step_forward | n^-2 | raised_support_pattern_shift | compact 3d trigger stream | 0.5 | 0.5 | rising |
| 15 | step_forward | n | lower_support_threshold | foot_drop_warning | 0.96 | 0 | at_threshold |
| 15 | step_forward | n^-2 | closing_distance_pattern_shift | compact 3d trigger stream | 0.67 | 0.67 | rising |
| 16 | probe_forward | n | top_clearance_threshold | overhead_clearance | 1 | 0 | at_threshold |
| 16 | probe_forward | n^-1 | rate_of_change_within_sensor | overhead_clearance | 1 | 0.54 | rising |
| 16 | probe_forward | n | lower_support_threshold | foot_drop_warning | 0.96 | 0 | at_threshold |
| 16 | probe_forward | n | top_clearance_threshold | body_top_pressure | 1 | 0 | at_threshold |
| 16 | probe_forward | n^-1 | rate_of_change_within_sensor | body_top_pressure | 1 | 0.46 | rising |
| 16 | probe_forward | n | movement_consequence_threshold | movement_result | 0.96 | 0 | at_threshold |
| 16 | probe_forward | n^-1 | movement_result_change | movement_result | 0.96 | 0.71 | rising |
| 16 | probe_forward | n^-2 | movement_consequence_pattern_shift | compact 3d trigger stream | 0.71 | 0.71 | rising |
