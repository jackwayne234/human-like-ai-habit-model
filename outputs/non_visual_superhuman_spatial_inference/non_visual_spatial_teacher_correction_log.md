# Non-Visual Spatial Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
| approaching_obstacle_confirmed | 12 | trusted_teacher | possible_obstacle_ahead | non_visual_obstacle_confirmed | The echo and reflection change are from a real obstacle ahead. Slow down, mark the obstacle, and prefer compact distance evidence before asking for raw vision. |
| open_space_echo_not_obstacle | 28 | trusted_teacher | possible_open_space | open_space_confirmed | Echo return falls and reflection spreads out here. Keep the map open; do not create an obstacle rule from open-space echo. |
| close_low_contrast_obstacle | 44 | trusted_teacher | possible_close_low_obstacle | low_contrast_obstacle_confirmed | This is a real low-contrast obstacle. Weak brightness does not cancel the echo, reflection, movement, and foot-risk evidence. |
| moving_sound_source_no_obstacle | 62 | trusted_teacher | possible_moving_source | moving_sound_source_not_obstacle | The sound source moved, but there was no physical obstacle in the path. Store a moving-source caution, not an obstacle rule. |
