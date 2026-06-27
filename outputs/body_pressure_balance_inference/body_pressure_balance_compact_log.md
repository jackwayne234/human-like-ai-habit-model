# Body Pressure Balance Compact Log

Purpose: feed labeled foot pressure, torso contact, and paired pressure-capsule differentials into the inner-world map without using dedicated raw accelerometer, barometer, or equilibrium streams.

| case | second | local event | place | area | layer | event type | involved streams/body locations | detected value or rate | signed change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| left_tilt_balance_confirmed | 10 | 1 | balance_lab | flat_test_pad | n^-1 | rate_of_change_within_touch_location | touch_left_foot | 0.64 | 0.64 | 0.5 |
| left_tilt_balance_confirmed | 10 | 2 | balance_lab | flat_test_pad | n^-1 | rate_of_change_within_touch_location | touch_right_foot | 0.55 | -0.55 | 0.5 |
| left_tilt_balance_confirmed | 10 | 3 | balance_lab | flat_test_pad | n^-1 | paired_pressure_differential | pressure_capsule_left, pressure_capsule_right | 0.61 | 0.61 | 0.5 differential |
| left_tilt_balance_confirmed | 11 | 4 | balance_lab | flat_test_pad | n^-1 | quiet_collision_context | touch_torso_front, touch_torso_back | 0.08 | 0.00 | < 0.5, no collision support |
| left_tilt_balance_confirmed | 12 | 5 | balance_lab | flat_test_pad | n^-2 | balance_pattern_shift | compact trigger stream | 0.32 | 0.00 | > 0 shift |
| right_foot_object_not_gravity | 28 | 1 | balance_lab | block_under_right_foot | n | threshold_hit | touch_right_foot | 1.00 | 0.00 | 1.0 |
| right_foot_object_not_gravity | 28 | 2 | balance_lab | block_under_right_foot | n^-1 | rate_of_change_within_touch_location | touch_right_foot | 0.74 | 0.74 | 0.5 |
| right_foot_object_not_gravity | 29 | 3 | balance_lab | block_under_right_foot | n^-1 | weak_capsule_change_below_threshold | pressure_capsule_left, pressure_capsule_right | 0.14 | 0.14 | < 0.5 differential |
| right_foot_object_not_gravity | 30 | 4 | balance_lab | block_under_right_foot | n^-2 | local_foot_contact_pattern_shift | compact trigger stream | 0.21 | 0.00 | > 0 shift |
| forward_acceleration_not_gravity | 44 | 1 | balance_lab | start_stop_lane | n^-1 | rate_of_change_within_pressure_capsule | pressure_capsule_front | 0.67 | 0.67 | 0.5 |
| forward_acceleration_not_gravity | 44 | 2 | balance_lab | start_stop_lane | n^-1 | rate_of_change_within_pressure_capsule | pressure_capsule_back | 0.58 | -0.58 | 0.5 |
| forward_acceleration_not_gravity | 44 | 3 | balance_lab | start_stop_lane | n^-1 | movement_command_change | movement_command | 1.00 | 1.00 | commanded movement |
| forward_acceleration_not_gravity | 45 | 4 | balance_lab | start_stop_lane | n^-2 | acceleration_pattern_shift | compact trigger stream | 0.36 | 0.00 | > 0 shift |
| air_pressure_capsule_not_balance | 62 | 1 | balance_lab | fan_pressure_lane | n^-1 | paired_pressure_differential | pressure_capsule_left, pressure_capsule_right | 0.69 | 0.69 | 0.5 differential |
| air_pressure_capsule_not_balance | 62 | 2 | balance_lab | fan_pressure_lane | n^-1 | rate_of_change_within_sensor | airflow | 0.72 | 0.72 | 0.5 |
| air_pressure_capsule_not_balance | 63 | 3 | balance_lab | fan_pressure_lane | n^-1 | quiet_foot_context | touch_left_foot, touch_right_foot | 0.10 | 0.00 | < 0.5, no foot-load support |
| air_pressure_capsule_not_balance | 64 | 4 | balance_lab | fan_pressure_lane | n^-2 | air_pressure_pattern_shift | compact trigger stream | 0.29 | 0.00 | > 0 shift |
