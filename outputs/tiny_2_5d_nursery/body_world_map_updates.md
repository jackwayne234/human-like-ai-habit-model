# Tiny 2.5D Nursery Body And World Map Updates

Caregiver-style body-noticing runs every three ticks plus after compact surprise. These are robot-facing self/world beliefs, not simulator truth.

| run | tick | action | map kind | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 3 | step_forward | world_map_update | near_floor_height: possible_ramp_or_slope | medium | ramp load shift and body pitch pressure changed during forward movement | recenter_body should reduce pitch before the next full step |
| run_1 | 3 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_1 | 4 | step_forward | world_map_update | near_floor_height: possible_ramp_or_slope | medium | ramp load shift and body pitch pressure changed during forward movement | recenter_body should reduce pitch before the next full step |
| run_1 | 4 | step_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_1 | 4 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_1 | 5 | step_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_1 | 5 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_1 | 5 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_1 | 6 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_1 | 6 | step_forward | world_map_update | near_floor_height: possible_raised_pressure_surface | medium | height pressure rose while both base sensors carried load | pause should help separate stable raised load from collision |
| run_1 | 7 | step_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_1 | 7 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_1 | 8 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_1 | 9 | pause | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_1 | 10 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_1 | 10 | step_forward | world_map_update | near_floor_height: possible_raised_pressure_surface | medium | height pressure rose while both base sensors carried load | pause should help separate stable raised load from collision |
| run_1 | 10 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 3 | step_forward | world_map_update | near_floor_height: possible_ramp_or_slope | medium | ramp load shift and body pitch pressure changed during forward movement | recenter_body should reduce pitch before the next full step |
| run_2 | 3 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 5 | step_forward | world_map_update | near_floor_height: possible_ramp_or_slope | medium | ramp load shift and body pitch pressure changed during forward movement | recenter_body should reduce pitch before the next full step |
| run_2 | 5 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 6 | probe_forward | world_map_update | near_floor_height: possible_ramp_or_slope | medium | ramp load shift and body pitch pressure changed during forward movement | recenter_body should reduce pitch before the next full step |
| run_2 | 6 | probe_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 6 | probe_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 7 | step_forward | world_map_update | near_floor_height: possible_ramp_or_slope | medium | ramp load shift and body pitch pressure changed during forward movement | recenter_body should reduce pitch before the next full step |
| run_2 | 7 | step_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 7 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 8 | probe_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 8 | probe_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 9 | step_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 9 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_2 | 9 | step_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 10 | probe_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 10 | probe_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_2 | 10 | probe_forward | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 11 | crouch_body | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 11 | crouch_body | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_2 | 11 | crouch_body | self_map_update | body_state: pitch_or_load_shift | medium | pressure capsules and pitch pressure changed without needing hidden body coordinates | recenter_body should reduce the pressure difference |
| run_2 | 12 | step_forward | world_map_update | near_floor_height: possible_drop_or_ledge | high | foot drop warning rose with body pitch pressure | probe_forward should warn before committing body weight |
| run_2 | 12 | step_forward | world_map_update | near_body_height: possible_low_overhead_clearance | high | overhead clearance and vertical echo compact streams rose together | crouch_body should reduce upper-body contact risk |
| run_2 | 12 | step_forward | world_map_update | near_floor_height: possible_raised_pressure_surface | medium | height pressure rose while both base sensors carried load | pause should help separate stable raised load from collision |

## Compact Surprise Routing

| run | tick | action | trigger | evidence | route |
| --- | --- | --- | --- | --- | --- |
| run_1 | 4 | step_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 4 | step_forward | n^-1:rate_of_change_within_sensor | foot_drop_warning rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 4 | step_forward | n^-2:foot_drop_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 4 | step_forward | n^-1:rate_of_change_within_sensor | ramp_load_shift falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 4 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 4 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 5 | step_forward | n^-2:overhead_clearance_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 5 | step_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 5 | step_forward | n^-2:foot_drop_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 5 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 5 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 5 | step_forward | n^-1:cross_sensor_compact_agreement | overhead_clearance, vertical_echo agreement | prediction_review_body_noticing_and_height_map_update |
| run_1 | 6 | step_forward | n:low_clearance_threshold | overhead_clearance at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 6 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 6 | step_forward | n^-1:rate_of_change_within_sensor | body_pitch_pressure falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 6 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 6 | step_forward | n:threshold_hit | ultrasonic_echo at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 7 | step_forward | n:low_clearance_threshold | overhead_clearance at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 7 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 7 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 7 | step_forward | n^-1:rate_of_change_within_sensor | ultrasonic_echo falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 7 | step_forward | n^-2:opening_space_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 8 | step_forward | n:low_clearance_threshold | overhead_clearance at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 8 | step_forward | n^-2:foot_drop_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 8 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 9 | pause | n:low_clearance_threshold | overhead_clearance at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 9 | pause | n^-1:movement_result_change | movement_result falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 9 | pause | n^-2:movement_consequence_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-1:rate_of_change_within_sensor | touch_left_base rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-1:rate_of_change_within_sensor | touch_right_base rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n:low_clearance_threshold | overhead_clearance at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-1:rate_of_change_within_sensor | height_pressure rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-1:movement_result_change | movement_result rising | prediction_review_body_noticing_and_height_map_update |
| run_1 | 10 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 5 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 6 | probe_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 6 | probe_forward | n^-1:rate_of_change_within_sensor | foot_drop_warning rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 6 | probe_forward | n^-2:foot_drop_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 6 | probe_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 7 | step_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 7 | step_forward | n^-2:foot_drop_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 7 | step_forward | n^-1:rate_of_change_within_sensor | ramp_load_shift falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 7 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 7 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 7 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 8 | probe_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 8 | probe_forward | n^-2:height_load_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 8 | probe_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 9 | step_forward | n^-2:overhead_clearance_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 9 | step_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 9 | step_forward | n^-1:cross_sensor_compact_agreement | overhead_clearance, vertical_echo agreement | prediction_review_body_noticing_and_height_map_update |
| run_2 | 10 | probe_forward | n:low_clearance_threshold | overhead_clearance at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 10 | probe_forward | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 11 | crouch_body | n^-2:clearance_opening_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 11 | crouch_body | n:drop_warning_threshold | foot_drop_warning at_threshold | prediction_review_body_noticing_and_height_map_update |
| run_2 | 11 | crouch_body | n^-1:movement_result_change | movement_result falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 11 | crouch_body | n^-2:movement_consequence_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-2:overhead_clearance_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-1:rate_of_change_within_sensor | foot_drop_warning falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-2:foot_drop_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-1:rate_of_change_within_sensor | body_pitch_pressure falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-2:height_load_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-1:rate_of_change_within_sensor | ultrasonic_echo falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-2:opening_space_pattern_shift | compact trigger stream falling | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_body_noticing_and_height_map_update |
| run_2 | 12 | step_forward | n^-1:cross_sensor_compact_agreement | foot_drop_warning, body_pitch_pressure agreement | prediction_review_body_noticing_and_height_map_update |
