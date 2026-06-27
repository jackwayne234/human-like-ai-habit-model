# Compact Trigger Log: experience_session_001

These are the formula outputs the model can notice from the stream. Compact monitoring stays on every tick.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 8 | n-1 | rate_of_change_within_sensor | volume | 0.60 | 0.5 |
| 8 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 9 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 14 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 14 | n-1 | rate_of_change_within_sensor | brightness | 0.54 | 0.5 |
| 14 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 15 | n-1 | rate_of_change_within_sensor | brightness | 0.58 | 0.5 |
| 16 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 21 | n-1 | rate_of_change_within_sensor | touch | 0.67 | 0.5 |
| 21 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 22 | n-1 | rate_of_change_within_sensor | volume | 0.56 | 0.5 |
| 22 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 22 | n-1 | rate_of_change_between_sensors | volume, touch | 2 | 2 senses >= 0.5 |
| 22 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 23 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 31 | n | threshold_hit | taste | 1.00 | 1.0 |
| 31 | n-1 | rate_of_change_within_sensor | taste | 0.91 | 0.5 |
| 31 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 32 | n-1 | rate_of_change_within_sensor | taste | 0.88 | 0.5 |
| 32 | n-1 | rate_of_change_within_sensor | smell | 0.56 | 0.5 |
| 32 | n-1 | rate_of_change_between_sensors | taste, smell | 2 | 2 senses >= 0.5 |
| 32 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 33 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 43 | n-1 | rate_of_change_within_sensor | volume | 0.56 | 0.5 |
| 43 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 43 | n-1 | rate_of_change_between_sensors | volume, touch | 2 | 2 senses >= 0.5 |
| 43 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 44 | n-1 | rate_of_change_within_sensor | brightness | 0.54 | 0.5 |
| 44 | n-1 | rate_of_change_within_sensor | volume | 0.55 | 0.5 |
| 44 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 44 | n-1 | rate_of_change_between_sensors | brightness, volume, touch | 3 | 2 senses >= 0.5 |
| 44 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 45 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.67 | > 0 shift |
| 55 | n | threshold_hit | smell | 1.00 | 1.0 |
| 55 | n-1 | rate_of_change_within_sensor | smell | 0.64 | 0.5 |
| 55 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 56 | n-1 | rate_of_change_within_sensor | smell | 0.78 | 0.5 |
| 57 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
