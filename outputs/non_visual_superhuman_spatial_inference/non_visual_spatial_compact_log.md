# Non-Visual Spatial Compact Log

Purpose: feed ultrasonic echo, reflection volume, movement history, weak visual evidence, and body-location risk into the inner-world map without exposing raw vision.

| case | second | local event | place | area | layer | event type | involved streams/body locations | detected value or rate | signed change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| approaching_obstacle_confirmed | 8 | 1 | training_room | matte_wall_lane | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.66 | 0.66 | 0.5 |
| approaching_obstacle_confirmed | 8 | 2 | training_room | matte_wall_lane | n^-1 | rate_of_change_within_sensor | reflection_volume | 0.58 | 0.58 | 0.5 |
| approaching_obstacle_confirmed | 8 | 3 | training_room | matte_wall_lane | n^-1 | rate_of_change_between_sensors | ultrasonic_echo, reflection_volume, movement_forward | 3.00 | 0.00 | 2+ streams >= 0.5 |
| approaching_obstacle_confirmed | 9 | 4 | training_room | matte_wall_lane | n^-2 | closing_distance_pattern_shift | compact trigger stream | 0.34 | 0.00 | > 0 shift |
| open_space_echo_not_obstacle | 24 | 1 | training_room | open_center_lane | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.52 | -0.52 | 0.5 |
| open_space_echo_not_obstacle | 24 | 2 | training_room | open_center_lane | n^-1 | rate_of_change_within_sensor | reflection_volume | 0.50 | -0.50 | 0.5 |
| open_space_echo_not_obstacle | 25 | 3 | training_room | open_center_lane | n^-2 | open_space_pattern_shift | compact trigger stream | 0.18 | 0.00 | > 0 shift |
| close_low_contrast_obstacle | 40 | 1 | training_room | black_soft_block_lane | n^-1 | rate_of_change_within_sensor | ultrasonic_echo | 0.71 | 0.71 | 0.5 |
| close_low_contrast_obstacle | 40 | 2 | training_room | black_soft_block_lane | n^-1 | rate_of_change_within_sensor | reflection_volume | 0.55 | 0.55 | 0.5 |
| close_low_contrast_obstacle | 41 | 3 | training_room | black_soft_block_lane | n^-1 | low_visual_change_below_threshold | brightness | 0.18 | 0.18 | < 0.5, no visual n^-1 |
| close_low_contrast_obstacle | 41 | 4 | training_room | black_soft_block_lane | n^-1 | rate_of_change_within_touch_location | touch_left_foot | 0.64 | 0.64 | 0.5 |
| close_low_contrast_obstacle | 42 | 5 | training_room | black_soft_block_lane | n^-2 | close_low_obstacle_pattern_shift | compact trigger stream | 0.39 | 0.00 | > 0 shift |
| moving_sound_source_no_obstacle | 58 | 1 | training_room | speaker_cart_passing | n | threshold_hit | volume | 1.00 | 0.00 | 1.0 |
| moving_sound_source_no_obstacle | 58 | 2 | training_room | speaker_cart_passing | n^-1 | rate_of_change_within_sensor | volume | 0.76 | 0.76 | 0.5 |
| moving_sound_source_no_obstacle | 59 | 3 | training_room | speaker_cart_passing | n^-1 | weak_echo_change_below_threshold | ultrasonic_echo | 0.12 | 0.12 | < 0.5, no echo support |
| moving_sound_source_no_obstacle | 60 | 4 | training_room | speaker_cart_passing | n^-2 | moving_sound_pattern_shift | compact trigger stream | 0.22 | 0.00 | > 0 shift |
