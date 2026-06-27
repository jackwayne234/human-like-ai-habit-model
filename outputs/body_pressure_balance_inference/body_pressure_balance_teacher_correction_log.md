# Body Pressure Balance Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
| left_tilt_balance_confirmed | 14 | trusted_teacher | possible_left_tilt_or_weight_shift | balance_tilt_left_confirmed | The left foot load and paired pressure capsule difference mean the body tilted left. Correct posture before moving. |
| right_foot_object_not_gravity | 32 | trusted_teacher | possible_right_foot_load_or_obstacle | local_foot_obstacle_not_balance_rule | This is a local object under the right foot. Store a ground/object anchor, not a gravity or balance rule. |
| forward_acceleration_not_gravity | 48 | trusted_teacher | possible_forward_lean_or_acceleration | forward_acceleration_confirmed | This pressure difference came from commanded forward acceleration. Do not treat it as a standing gravity/balance correction. |
| air_pressure_capsule_not_balance | 66 | trusted_teacher | possible_pressure_gradient | airflow_pressure_gradient_confirmed | The capsule difference came from airflow or atmospheric pressure change, not body tilt. Store this as an air-pressure clue. |
