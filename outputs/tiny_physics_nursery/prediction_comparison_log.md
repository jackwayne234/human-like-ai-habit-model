# Tiny Physics Nursery Prediction And Comparison Log

Every intentional action receives a prediction before action and an immediate comparison after action. Delayed settling checks appear when pressure or airflow may change slowly.

| run | tick | action | phase | intention or prediction | compact evidence | result | update target |
| --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | step_forward | prediction_before_action | try the first visible-feeling forward path | body should move forward with quiet torso contact |  |  |
| run_1 | 1 | step_forward | immediate_comparison | body should move forward with quiet torso contact | touch_torso_front n at_threshold; ultrasonic_echo n at_threshold; reflection_volume n at_threshold; movement_result n at_threshold | mismatch_needs_map_update | world_map |
| run_1 | 10+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_1 | 10 | step_forward | immediate_comparison | body should move forward with quiet torso contact | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_1 | 11+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | touch_left_base n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update | world_map |
| run_1 | 11 | step_forward | immediate_comparison | body should move forward with quiet torso contact | touch_left_base n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update | world_map |
| run_1 | 2 | turn_right | prediction_before_action | change front direction after resistance | front echo pattern should change without forward collision |  |  |
| run_1 | 2+settle | turn_right | delayed_settling_check | front echo pattern should change without forward collision | touch_torso_front n^-1 falling; pressure_capsule_front n^-1 falling; ultrasonic_echo n^-1 falling; reflection_volume n^-1 falling | mismatch_needs_map_update | world_map |
| run_1 | 2 | turn_right | immediate_comparison | front echo pattern should change without forward collision | touch_torso_front n^-1 falling; pressure_capsule_front n^-1 falling; ultrasonic_echo n^-1 falling; reflection_volume n^-1 falling | mismatch_needs_map_update | world_map |
| run_1 | 3 | step_forward | prediction_before_action | move along the boundary | body should move forward with quiet torso contact |  |  |
| run_1 | 3 | step_forward | immediate_comparison | body should move forward with quiet torso contact | compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_1 | 4 | step_forward | prediction_before_action | keep moving after one easy step | body should move forward with quiet torso contact |  |  |
| run_1 | 4+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; pressure_capsule_front n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update | world_map |
| run_1 | 4 | step_forward | immediate_comparison | body should move forward with quiet torso contact | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; pressure_capsule_front n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update | world_map |
| run_1 | 5 | turn_right | prediction_before_action | turn away from base resistance | front echo pattern should change without forward collision |  |  |
| run_1 | 5+settle | turn_right | delayed_settling_check | front echo pattern should change without forward collision | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; pressure_capsule_front n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained | world_map |
| run_1 | 5 | turn_right | immediate_comparison | front echo pattern should change without forward collision | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; pressure_capsule_front n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained | world_map |
| run_1 | 6 | step_forward | prediction_before_action | try a new corridor after turning | body should move forward with quiet torso contact |  |  |
| run_1 | 6 | step_forward | immediate_comparison | body should move forward with quiet torso contact | compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_1 | 7 | step_forward | prediction_before_action | continue through pressure change | body should move forward with quiet torso contact |  |  |
| run_1 | 7+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | pressure_capsule_left n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_1 | 7 | step_forward | immediate_comparison | body should move forward with quiet torso contact | pressure_capsule_left n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_1 | 8 | pause | prediction_before_action | let body pressure settle | compact body signals should settle or stay quiet |  |  |
| run_1 | 8+settle | pause | delayed_settling_check | compact body signals should settle or stay quiet | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_1 | 8 | pause | immediate_comparison | compact body signals should settle or stay quiet | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_1 | 9 | step_forward | prediction_before_action | test whether the path is still safe | body should move forward with quiet torso contact |  |  |
| run_1 | 9+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | airflow n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_1 | 9 | step_forward | immediate_comparison | body should move forward with quiet torso contact | airflow n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_1 | 10 | step_forward | prediction_before_action | keep moving despite weak warning | body should move forward with quiet torso contact |  |  |
| run_1 | 10+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_1 | 10 | step_forward | immediate_comparison | body should move forward with quiet torso contact | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_1 | 11 | step_forward | prediction_before_action | continue until the base gives a clearer warning | body should move forward with quiet torso contact |  |  |
| run_1 | 11+settle | step_forward | delayed_settling_check | body should move forward with quiet torso contact | touch_left_base n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update | world_map |
| run_1 | 11 | step_forward | immediate_comparison | body should move forward with quiet torso contact | touch_left_base n^-1 rising; compact trigger stream n^-2 rising | mismatch_needs_map_update | world_map |
| run_2 | 1 | probe_forward | prediction_before_action | check learned front resistance before committing body weight | probe may find resistance or base warning before full body commitment |  |  |
| run_2 | 1 | probe_forward | immediate_comparison | probe may find resistance or base warning before full body commitment | compact stream stayed quiet | matched_or_explained | world_map |
| run_2 | 10+settle | probe_forward | delayed_settling_check | probe may find resistance or base warning before full body commitment | compact stream stayed quiet | mismatch_needs_map_update | self_map |
| run_2 | 10 | probe_forward | immediate_comparison | probe may find resistance or base warning before full body commitment | compact stream stayed quiet | mismatch_needs_map_update | self_map |
| run_2 | 12+settle | probe_forward | delayed_settling_check | probe may find resistance or base warning before full body commitment | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | world_map |
| run_2 | 12 | probe_forward | immediate_comparison | probe may find resistance or base warning before full body commitment | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | world_map |
| run_2 | 2 | turn_right | prediction_before_action | avoid repeating a resisted movement | front echo pattern should change without forward collision |  |  |
| run_2 | 2 | turn_right | immediate_comparison | front echo pattern should change without forward collision | touch_torso_front n^-1 falling; ultrasonic_echo n^-1 falling; movement_result n^-1 falling | mismatch_needs_map_update | world_map |
| run_2 | 3 | step_forward | prediction_before_action | test the changed front direction with a small step | forward movement may be blocked, partial, or pressure-changing |  |  |
| run_2 | 3 | step_forward | immediate_comparison | forward movement may be blocked, partial, or pressure-changing | compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_2 | 4 | probe_forward | prediction_before_action | check for low base obstacle before stepping | probe may find resistance or base warning before full body commitment |  |  |
| run_2 | 4 | probe_forward | immediate_comparison | probe may find resistance or base warning before full body commitment | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising | matched_or_explained | world_map |
| run_2 | 5 | turn_right | prediction_before_action | turn away after compact probe warning instead of committing body weight | front echo pattern should change without forward collision |  |  |
| run_2 | 5 | turn_right | immediate_comparison | front echo pattern should change without forward collision | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained | world_map |
| run_2 | 6 | step_forward | prediction_before_action | test the changed front direction with a small step | forward movement may be blocked, partial, or pressure-changing |  |  |
| run_2 | 6+settle | step_forward | delayed_settling_check | forward movement may be blocked, partial, or pressure-changing | compact trigger stream n^-2 rising; pressure_capsule_left n^-1 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_2 | 6 | step_forward | immediate_comparison | forward movement may be blocked, partial, or pressure-changing | compact trigger stream n^-2 rising; pressure_capsule_left n^-1 rising; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_2 | 7 | recenter_body | prediction_before_action | reduce left/right pressure mismatch before more movement | left/right pressure difference should reduce if the body was leaning |  |  |
| run_2 | 7+settle | recenter_body | delayed_settling_check | left/right pressure difference should reduce if the body was leaning | compact trigger stream n^-2 falling | mismatch_needs_map_update | self_map |
| run_2 | 7 | recenter_body | immediate_comparison | left/right pressure difference should reduce if the body was leaning | compact trigger stream n^-2 falling | mismatch_needs_map_update | self_map |
| run_2 | 8 | step_forward | prediction_before_action | move cautiously after recentering pressure | forward movement may be blocked, partial, or pressure-changing |  |  |
| run_2 | 8+settle | step_forward | delayed_settling_check | forward movement may be blocked, partial, or pressure-changing | airflow n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_2 | 8 | step_forward | immediate_comparison | forward movement may be blocked, partial, or pressure-changing | airflow n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | self_map |
| run_2 | 9 | pause | prediction_before_action | separate external airflow pressure from body lean | airflow or pressure may settle while base load stays quiet |  |  |
| run_2 | 9+settle | pause | delayed_settling_check | airflow or pressure may settle while base load stays quiet | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_2 | 9 | pause | immediate_comparison | airflow or pressure may settle while base load stays quiet | compact trigger stream n^-2 falling | matched_or_explained | self_map |
| run_2 | 10 | probe_forward | prediction_before_action | check for curb or edge warning before a full step | probe may find resistance or base warning before full body commitment |  |  |
| run_2 | 10+settle | probe_forward | delayed_settling_check | probe may find resistance or base warning before full body commitment | compact stream stayed quiet | mismatch_needs_map_update | self_map |
| run_2 | 10 | probe_forward | immediate_comparison | probe may find resistance or base warning before full body commitment | compact stream stayed quiet | mismatch_needs_map_update | self_map |
| run_2 | 11 | step_forward | prediction_before_action | commit one small step after a quiet probe | forward movement may be blocked, partial, or pressure-changing |  |  |
| run_2 | 11+settle | step_forward | delayed_settling_check | forward movement may be blocked, partial, or pressure-changing | compact stream stayed quiet | mismatch_needs_map_update | self_map |
| run_2 | 11 | step_forward | immediate_comparison | forward movement may be blocked, partial, or pressure-changing | compact stream stayed quiet | mismatch_needs_map_update | self_map |
| run_2 | 12 | probe_forward | prediction_before_action | check for curb or edge warning before a full step | probe may find resistance or base warning before full body commitment |  |  |
| run_2 | 12+settle | probe_forward | delayed_settling_check | probe may find resistance or base warning before full body commitment | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | world_map |
| run_2 | 12 | probe_forward | immediate_comparison | probe may find resistance or base warning before full body commitment | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising | matched_or_explained | world_map |
