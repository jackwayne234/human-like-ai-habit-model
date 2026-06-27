# Adaptive 2.5D Nursery Prediction And Comparison Log

| run | tick | action | phase | prediction or evidence | result |
| --- | --- | --- | --- | --- | --- |
| adaptive_naive | 1 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 1 | step_forward | immediate_comparison | compact stream quiet | matched_or_explained |
| adaptive_naive | 2 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 2 | step_forward | immediate_comparison | overhead_clearance n at_threshold; ultrasonic_echo n at_threshold; movement_result n^-1 rising | mismatch_needs_map_update |
| adaptive_naive | 3 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 3 | step_forward | immediate_comparison | overhead_clearance n at_threshold; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling | mismatch_needs_map_update |
| adaptive_naive | 4 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 4 | step_forward | immediate_comparison | overhead_clearance n at_threshold; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| adaptive_naive | 5 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 5 | step_forward | immediate_comparison | overhead_clearance n at_threshold | mismatch_needs_map_update |
| adaptive_naive | 6 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 6 | step_forward | immediate_comparison | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | matched_or_explained |
| adaptive_naive | 7 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 7 | step_forward | immediate_comparison | compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 falling | mismatch_needs_map_update |
| adaptive_naive | 8 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 8 | step_forward | immediate_comparison | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| adaptive_naive | 9 | pause | prediction_before_action | height pressure should settle without adding new contact |  |
| adaptive_naive | 9 | pause | immediate_comparison | compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; foot_drop_warning n at_threshold; compact trigger stream n^-2 falling; movement_result n^-1 falling | matched_or_explained |
| adaptive_naive | 10 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 10 | step_forward | immediate_comparison | foot_drop_warning n at_threshold; movement_result n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update |
| adaptive_naive | 11 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 11 | step_forward | immediate_comparison | foot_drop_warning n^-1 falling; compact trigger stream n^-2 falling; ramp_load_shift n^-1 rising; compact trigger stream n^-2 rising; pressure_capsule_left n^-1 rising | matched_or_explained |
| adaptive_naive | 12 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_naive | 12 | step_forward | immediate_comparison | compact trigger stream n^-2 rising; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling | matched_or_explained |
| adaptive_risk_memory | 1 | step_forward | prediction_before_action | forward movement should gather compact evidence with no known active risk memory |  |
| adaptive_risk_memory | 1 | step_forward | immediate_comparison | compact stream quiet | matched_or_explained |
| adaptive_risk_memory | 2 | probe_forward | prediction_before_action | probe should test active compact forward risk before body commitment |  |
| adaptive_risk_memory | 2 | probe_forward | immediate_comparison | overhead_clearance n at_threshold; movement_result n^-1 rising | matched_or_explained |
| adaptive_risk_memory | 3 | crouch_body | prediction_before_action | lowering posture should reduce overhead clearance pressure |  |
| adaptive_risk_memory | 3 | crouch_body | immediate_comparison | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| adaptive_risk_memory | 4 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 4 | step_forward | immediate_comparison | compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising | matched_or_explained |
| adaptive_risk_memory | 5 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 5 | step_forward | immediate_comparison | compact trigger stream n^-2 rising | matched_or_explained |
| adaptive_risk_memory | 6 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 6 | step_forward | immediate_comparison | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | matched_or_explained |
| adaptive_risk_memory | 7 | recenter_body | prediction_before_action | body load should settle before crossing height change |  |
| adaptive_risk_memory | 7 | recenter_body | immediate_comparison | compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising; compact trigger stream n^-2 falling | matched_or_explained |
| adaptive_risk_memory | 8 | pause | prediction_before_action | height pressure should settle without adding new contact |  |
| adaptive_risk_memory | 8 | pause | immediate_comparison | compact stream quiet | matched_or_explained |
| adaptive_risk_memory | 9 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 9 | step_forward | immediate_comparison | compact stream quiet | matched_or_explained |
| adaptive_risk_memory | 10 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 10 | step_forward | immediate_comparison | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; foot_drop_warning n at_threshold | matched_or_explained |
| adaptive_risk_memory | 11 | probe_forward | prediction_before_action | probe should test active compact forward risk before body commitment |  |
| adaptive_risk_memory | 11 | probe_forward | immediate_comparison | compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; foot_drop_warning n at_threshold; compact trigger stream n^-2 falling | matched_or_explained |
| adaptive_risk_memory | 12 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 12 | step_forward | immediate_comparison | foot_drop_warning n at_threshold | matched_or_explained |
| adaptive_risk_memory | 13 | probe_forward | prediction_before_action | probe should test active compact forward risk before body commitment |  |
| adaptive_risk_memory | 13 | probe_forward | immediate_comparison | foot_drop_warning n at_threshold; ramp_load_shift n^-1 rising; compact trigger stream n^-2 rising; pressure_capsule_left n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained |
| adaptive_risk_memory | 14 | step_forward | prediction_before_action | forward movement may carry compact risk evidence already held in risk memory |  |
| adaptive_risk_memory | 14 | step_forward | immediate_comparison | foot_drop_warning n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling | matched_or_explained |
