# Layered 2.5D Nursery Prediction And Comparison Log

| run | tick | action | phase | prediction or evidence | result |
| --- | --- | --- | --- | --- | --- |
| training_room | 1 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 1 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| training_room | 2 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 2 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| training_room | 3 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 3 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| training_room | 4 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 4 | step_forward | immediate_comparison | foot_drop_warning n at_threshold; foot_drop_warning n^-1 rising; compact trigger stream n^-2 rising; ramp_load_shift n^-1 falling; compact trigger stream n^-2 falling | mismatch_needs_map_update |
| training_room | 5 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 5 | step_forward | immediate_comparison | overhead_clearance n^-1 rising; compact trigger stream n^-2 rising; foot_drop_warning n at_threshold; compact trigger stream n^-2 falling; vertical_echo n^-1 rising | mismatch_needs_map_update |
| training_room | 6 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 6 | step_forward | immediate_comparison | overhead_clearance n at_threshold; height_pressure n^-1 falling; compact trigger stream n^-2 falling; body_pitch_pressure n^-1 falling; compact trigger stream n^-2 falling | mismatch_needs_map_update |
| training_room | 7 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 7 | step_forward | immediate_comparison | overhead_clearance n at_threshold; foot_drop_warning n^-1 falling; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling | mismatch_needs_map_update |
| training_room | 8 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 8 | step_forward | immediate_comparison | overhead_clearance n at_threshold; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| training_room | 9 | pause | prediction_before_action | height pressure may settle without adding new contact |  |
| training_room | 9 | pause | immediate_comparison | overhead_clearance n at_threshold; movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| training_room | 10 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| training_room | 10 | step_forward | immediate_comparison | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; overhead_clearance n at_threshold | mismatch_needs_map_update |
| layered_naive | 1 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 1 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| layered_naive | 2 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 2 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| layered_naive | 3 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 3 | step_forward | immediate_comparison | foot_drop_warning n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 falling; compact trigger stream n^-2 falling; body_pitch_pressure n^-1 falling | matched_or_explained |
| layered_naive | 4 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 4 | step_forward | immediate_comparison | foot_drop_warning n at_threshold; height_pressure n^-1 rising; compact trigger stream n^-2 rising; body_pitch_pressure n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| layered_naive | 5 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 5 | step_forward | immediate_comparison | overhead_clearance n^-1 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 falling; height_pressure n^-1 falling; compact trigger stream n^-2 falling | mismatch_needs_map_update |
| layered_naive | 6 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 6 | step_forward | immediate_comparison | overhead_clearance n at_threshold; foot_drop_warning n^-1 falling; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising | mismatch_needs_map_update |
| layered_naive | 7 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 7 | step_forward | immediate_comparison | overhead_clearance n at_threshold; compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling | mismatch_needs_map_update |
| layered_naive | 8 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 8 | step_forward | immediate_comparison | overhead_clearance n at_threshold; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| layered_naive | 9 | pause | prediction_before_action | height pressure may settle without adding new contact |  |
| layered_naive | 9 | pause | immediate_comparison | overhead_clearance n at_threshold; movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| layered_naive | 10 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 10 | step_forward | immediate_comparison | overhead_clearance n at_threshold; movement_result n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| layered_naive | 11 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 11 | step_forward | immediate_comparison | movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| layered_naive | 12 | step_forward | prediction_before_action | forward movement should keep height and clearance streams quiet |  |
| layered_naive | 12 | step_forward | immediate_comparison | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; overhead_clearance n^-1 falling | mismatch_needs_map_update |
| layered_transfer | 1 | step_forward | prediction_before_action | forward movement may carry compact height, pitch, drop, or clearance evidence |  |
| layered_transfer | 1 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| layered_transfer | 2 | recenter_body | prediction_before_action | recenter should reduce pitch or left-right load pressure |  |
| layered_transfer | 2 | recenter_body | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| layered_transfer | 3 | step_forward | prediction_before_action | forward movement may carry compact height, pitch, drop, or clearance evidence |  |
| layered_transfer | 3 | step_forward | immediate_comparison | compact stream stayed quiet | matched_or_explained |
| layered_transfer | 4 | probe_forward | prediction_before_action | probe may warn about overhead or vertical clearance before upper-body commitment |  |
| layered_transfer | 4 | probe_forward | immediate_comparison | foot_drop_warning n at_threshold; foot_drop_warning n^-1 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising | matched_or_explained |
| layered_transfer | 5 | step_forward | prediction_before_action | forward movement may carry compact height, pitch, drop, or clearance evidence |  |
| layered_transfer | 5 | step_forward | immediate_comparison | compact trigger stream n^-2 falling; height_pressure n^-1 falling; compact trigger stream n^-2 falling; body_pitch_pressure n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| layered_transfer | 6 | probe_forward | prediction_before_action | probe may warn about overhead or vertical clearance before upper-body commitment |  |
| layered_transfer | 6 | probe_forward | immediate_comparison | foot_drop_warning n at_threshold; compact trigger stream n^-2 rising; height_pressure n^-1 rising; compact trigger stream n^-2 rising; body_pitch_pressure n^-1 rising | matched_or_explained |
| layered_transfer | 7 | step_forward | prediction_before_action | forward movement may carry compact height, pitch, drop, or clearance evidence |  |
| layered_transfer | 7 | step_forward | immediate_comparison | foot_drop_warning n at_threshold; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling | matched_or_explained |
| layered_transfer | 8 | probe_forward | prediction_before_action | probe may warn about overhead or vertical clearance before upper-body commitment |  |
| layered_transfer | 8 | probe_forward | immediate_comparison | foot_drop_warning n at_threshold | matched_or_explained |
| layered_transfer | 9 | step_forward | prediction_before_action | forward movement may carry compact height, pitch, drop, or clearance evidence |  |
| layered_transfer | 9 | step_forward | immediate_comparison | overhead_clearance n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 rising | matched_or_explained |
| layered_transfer | 10 | probe_forward | prediction_before_action | probe may warn about overhead or vertical clearance before upper-body commitment |  |
| layered_transfer | 10 | probe_forward | immediate_comparison | overhead_clearance n at_threshold; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained |
| layered_transfer | 11 | crouch_body | prediction_before_action | lowering posture should reduce overhead clearance pressure |  |
| layered_transfer | 11 | crouch_body | immediate_comparison | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| layered_transfer | 12 | step_forward | prediction_before_action | forward movement may carry compact height, pitch, drop, or clearance evidence |  |
| layered_transfer | 12 | step_forward | immediate_comparison | compact trigger stream n^-2 rising; foot_drop_warning n^-1 falling; compact trigger stream n^-2 falling; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
