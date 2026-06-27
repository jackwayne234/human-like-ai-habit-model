# Tiny Physics Nursery Body And World Map Updates

Caregiver-style body-noticing runs every three ticks plus after surprise or collision. These are robot-facing self/world beliefs, not simulator truth.

| run | tick | action | map kind | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | step_forward | world_map_update | near_front_path: likely wall_or_tall_obstacle | high | forward movement resisted with torso-front or blocked movement compact evidence | turning should change echo/reflection before another forward step |
| run_1 | 2 | turn_right | world_map_update | near_front_path: likely wall_or_tall_obstacle | high | forward movement resisted with torso-front or blocked movement compact evidence | turning should change echo/reflection before another forward step |
| run_1 | 3 | step_forward | self_map_update | body_state: stable_enough_to_continue | low | no strong compact body surprise during this noticing window | small reversible action can gather more evidence |
| run_1 | 4 | step_forward | world_map_update | near_base_path: possible_low_obstacle_or_curb | medium | base contact changed without matching torso-front contact | probe_forward should warn before full step commitment |
| run_1 | 5 | turn_right | world_map_update | near_base_path: possible_low_obstacle_or_curb | medium | base contact changed without matching torso-front contact | probe_forward should warn before full step commitment |
| run_1 | 6 | step_forward | self_map_update | body_state: stable_enough_to_continue | low | no strong compact body surprise during this noticing window | small reversible action can gather more evidence |
| run_1 | 7 | step_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_1 | 8 | pause | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_1 | 9 | step_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_1 | 9 | step_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_1 | 10 | step_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_1 | 10 | step_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_1 | 11 | step_forward | world_map_update | near_base_path: possible_low_obstacle_or_curb | medium | base contact changed without matching torso-front contact | probe_forward should warn before full step commitment |
| run_1 | 11 | step_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_2 | 2 | turn_right | world_map_update | near_front_path: likely wall_or_tall_obstacle | high | forward movement resisted with torso-front or blocked movement compact evidence | turning should change echo/reflection before another forward step |
| run_2 | 3 | step_forward | self_map_update | body_state: stable_enough_to_continue | low | no strong compact body surprise during this noticing window | small reversible action can gather more evidence |
| run_2 | 4 | probe_forward | world_map_update | near_base_path: possible_low_obstacle_or_curb | medium | base contact changed without matching torso-front contact | probe_forward should warn before full step commitment |
| run_2 | 5 | turn_right | world_map_update | near_base_path: possible_low_obstacle_or_curb | medium | base contact changed without matching torso-front contact | probe_forward should warn before full step commitment |
| run_2 | 6 | step_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 7 | recenter_body | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 8 | step_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 8 | step_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_2 | 9 | pause | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 9 | pause | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_2 | 10 | probe_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 10 | probe_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_2 | 11 | step_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 11 | step_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |
| run_2 | 12 | probe_forward | self_map_update | body_state: leaning_left | medium | left/right pressure capsule difference changed while moving | recenter_body should reduce pressure difference |
| run_2 | 12 | probe_forward | world_map_update | near_base_path: possible_low_obstacle_or_curb | medium | base contact changed without matching torso-front contact | probe_forward should warn before full step commitment |
| run_2 | 12 | probe_forward | world_map_update | local_air: possible_fan_or_external_pressure | medium | airflow changed while base touch stayed mostly quiet | pause should let pressure settle without obstacle contact |

## Compact Surprise Routing

| run | tick | action | trigger | evidence | route |
| --- | --- | --- | --- | --- | --- |
| run_1 | 1 | step_forward | n:threshold_hit | touch_torso_front at_threshold | prediction_review_and_body_noticing |
| run_1 | 1 | step_forward | n:threshold_hit | ultrasonic_echo at_threshold | prediction_review_and_body_noticing |
| run_1 | 1 | step_forward | n:threshold_hit | reflection_volume at_threshold | prediction_review_and_body_noticing |
| run_1 | 1 | step_forward | n:movement_blocked_threshold | movement_result at_threshold | prediction_review_and_body_noticing |
| run_1 | 1 | step_forward | n^-1:cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume agreement | prediction_review_and_body_noticing |
| run_1 | 2 | turn_right | n^-1:rate_of_change_within_sensor | touch_torso_front falling | prediction_review_and_body_noticing |
| run_1 | 2 | turn_right | n^-1:rate_of_change_within_sensor | ultrasonic_echo falling | prediction_review_and_body_noticing |
| run_1 | 2 | turn_right | n^-1:rate_of_change_within_sensor | reflection_volume falling | prediction_review_and_body_noticing |
| run_1 | 2 | turn_right | n^-1:movement_result_change | movement_result falling | prediction_review_and_body_noticing |
| run_1 | 2 | turn_right | n^-1:cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume agreement | prediction_review_and_body_noticing |
| run_1 | 3 | step_forward | n^-2:compact_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 3 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 3 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 3 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 3 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 4 | step_forward | n^-1:rate_of_change_within_sensor | touch_left_base rising | prediction_review_and_body_noticing |
| run_1 | 4 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 4 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-1:rate_of_change_within_sensor | touch_left_base falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-1:rate_of_change_within_sensor | ultrasonic_echo falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-2:opening_space_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-1:rate_of_change_within_sensor | reflection_volume falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-2:opening_space_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-1:movement_result_change | movement_result falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-2:movement_consequence_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 5 | turn_right | n^-1:cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume agreement | prediction_review_and_body_noticing |
| run_1 | 6 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 6 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 6 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 6 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 6 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 7 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 8 | pause | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 9 | step_forward | n^-1:rate_of_change_within_sensor | airflow rising | prediction_review_and_body_noticing |
| run_1 | 9 | step_forward | n^-2:external_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_1 | 10 | step_forward | n^-2:external_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_1 | 11 | step_forward | n^-1:rate_of_change_within_sensor | touch_left_base rising | prediction_review_and_body_noticing |
| run_1 | 11 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 2 | turn_right | n^-1:movement_result_change | movement_result falling | prediction_review_and_body_noticing |
| run_2 | 3 | step_forward | n^-2:compact_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 3 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 3 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 3 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 4 | probe_forward | n^-1:rate_of_change_within_sensor | touch_left_base rising | prediction_review_and_body_noticing |
| run_2 | 4 | probe_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-1:rate_of_change_within_sensor | touch_left_base falling | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-1:rate_of_change_within_sensor | ultrasonic_echo falling | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-2:opening_space_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-2:opening_space_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-2:movement_consequence_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_2 | 5 | turn_right | n^-1:cross_sensor_compact_agreement | ultrasonic_echo, reflection_volume agreement | prediction_review_and_body_noticing |
| run_2 | 6 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 6 | step_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 6 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 6 | step_forward | n^-2:closing_distance_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 6 | step_forward | n^-2:movement_consequence_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 7 | recenter_body | n^-2:body_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_2 | 8 | step_forward | n^-1:rate_of_change_within_sensor | airflow rising | prediction_review_and_body_noticing |
| run_2 | 8 | step_forward | n^-2:external_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 9 | pause | n^-2:external_pressure_pattern_shift | compact trigger stream falling | prediction_review_and_body_noticing |
| run_2 | 12 | probe_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |
| run_2 | 12 | probe_forward | n^-2:body_pressure_pattern_shift | compact trigger stream rising | prediction_review_and_body_noticing |

## Movement Urge Cron

| run | tick | state | suggested action | reason |
| --- | --- | --- | --- | --- |
| run_1 | 1 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_1 | 2 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_1 | 3 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_1 | 4 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_1 | 5 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_1 | 6 | quiet | none | recent compact evidence is being processed |
| run_1 | 7 | speak | recenter_body | pressure suggests leaning; recenter before seeking more distance evidence |
| run_1 | 8 | speak | recenter_body | pressure suggests leaning; recenter before seeking more distance evidence |
| run_1 | 9 | speak | recenter_body | pressure suggests leaning; recenter before seeking more distance evidence |
| run_1 | 10 | speak | recenter_body | pressure suggests leaning; recenter before seeking more distance evidence |
| run_1 | 11 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 1 | quiet | none | recent compact evidence is being processed |
| run_2 | 2 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 3 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 4 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 5 | speak | turn_right | front path resisted; turning is safer than repeating forward movement |
| run_2 | 6 | speak | recenter_body | pressure suggests leaning; recenter before seeking more distance evidence |
| run_2 | 7 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 8 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 9 | speak | recenter_body | pressure suggests leaning; recenter before seeking more distance evidence |
| run_2 | 10 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 11 | yield | pause | unresolved prediction mismatch should be processed before new movement |
| run_2 | 12 | yield | pause | unresolved prediction mismatch should be processed before new movement |
