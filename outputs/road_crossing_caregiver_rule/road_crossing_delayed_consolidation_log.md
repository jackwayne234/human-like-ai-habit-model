# Road-Crossing Delayed Consolidation Log

Purpose: run the one-minute consolidation handler after each caregiver-rule correction.

| case | due second | handler | question | evidence | decision | reusable rule | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| street_edge_confirmed_crossing | 76 | one_minute_caregiver_rule_consolidation | Should this corrected event become a reusable road-crossing safety rule? | curb_plus_vehicle_crossing_shape, map area curb_at_elm_street, trusted teacher label road_crossing_area_confirmed | yes | rule_movement_road_crossing_caregiver_v1 | Compact sight, volume, movement/contact evidence, map context, and teacher correction agree on road-crossing behavior. |
| sidewalk_obstacle_not_crossing | 94 | one_minute_caregiver_rule_consolidation | Should this corrected event become a reusable road-crossing safety rule? | foot_obstacle_without_road_evidence, map area sidewalk_crack_near_mailbox, trusted teacher label sidewalk_obstacle_not_crossing | no | none | Teacher correction and compact evidence do not both support the full crossing rule, so this stays a narrower map update. |
| driveway_vehicle_sound_caution | 108 | one_minute_caregiver_rule_consolidation | Should this corrected event become a reusable road-crossing safety rule? | vehicle_sound_without_curb_confirmation, map area garage_apron, trusted teacher label vehicle_nearby_caution_not_crossing_rule | no | none | Teacher correction and compact evidence do not both support the full crossing rule, so this stays a narrower map update. |
