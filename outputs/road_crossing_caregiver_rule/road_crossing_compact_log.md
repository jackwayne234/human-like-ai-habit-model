# Road-Crossing Caregiver Compact Log

Purpose: feed compact sight, volume, movement, and multi-location touch evidence into a caregiver-style crossing routine without exposing raw sensory stream rows.

| case | second | local event | place | area | layer | event type | involved senses/body locations | detected value or rate | signed change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| street_edge_confirmed_crossing | 12 | 1 | neighborhood_walk | curb_at_elm_street | n^-1 | rate_of_change_within_sensor | brightness | 0.62 | 0.62 | 0.5 |
| street_edge_confirmed_crossing | 12 | 2 | neighborhood_walk | curb_at_elm_street | n^-1 | rate_of_change_within_sensor | volume | 0.58 | 0.58 | 0.5 |
| street_edge_confirmed_crossing | 12 | 3 | neighborhood_walk | curb_at_elm_street | n^-1 | rate_of_change_between_sensors | brightness, volume | 2.00 | 0.00 | 2 senses >= 0.5 |
| street_edge_confirmed_crossing | 13 | 4 | neighborhood_walk | curb_at_elm_street | n | threshold_hit | touch_left_foot | 1.00 | 0.00 | 1.0 |
| street_edge_confirmed_crossing | 13 | 5 | neighborhood_walk | curb_at_elm_street | n^-1 | rate_of_change_within_touch_location | touch_left_foot | 0.74 | 0.74 | 0.5 |
| street_edge_confirmed_crossing | 14 | 6 | neighborhood_walk | curb_at_elm_street | n^-2 | movement_and_vehicle_pattern_shift | compact trigger stream | 0.31 | 0.00 | > 0 shift |
| sidewalk_obstacle_not_crossing | 30 | 1 | neighborhood_walk | sidewalk_crack_near_mailbox | n | threshold_hit | touch_right_foot | 1.00 | 0.00 | 1.0 |
| sidewalk_obstacle_not_crossing | 30 | 2 | neighborhood_walk | sidewalk_crack_near_mailbox | n^-1 | rate_of_change_within_touch_location | touch_right_foot | 0.70 | 0.70 | 0.5 |
| sidewalk_obstacle_not_crossing | 31 | 3 | neighborhood_walk | sidewalk_crack_near_mailbox | n^-2 | foot_contact_pattern_shift | compact trigger stream | 0.16 | 0.00 | > 0 shift |
| driveway_vehicle_sound_caution | 44 | 1 | home_driveway | garage_apron | n | threshold_hit | volume | 1.00 | 0.00 | 1.0 |
| driveway_vehicle_sound_caution | 44 | 2 | home_driveway | garage_apron | n^-1 | rate_of_change_within_sensor | volume | 0.77 | 0.77 | 0.5 |
| driveway_vehicle_sound_caution | 45 | 3 | home_driveway | garage_apron | n^-1 | rate_of_change_within_sensor | brightness | 0.54 | 0.54 | 0.5 |
| driveway_vehicle_sound_caution | 46 | 4 | home_driveway | garage_apron | n^-2 | vehicle_sound_pattern_shift | compact trigger stream | 0.23 | 0.00 | > 0 shift |
