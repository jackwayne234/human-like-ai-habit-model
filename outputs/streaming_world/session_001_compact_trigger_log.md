# Compact Trigger Log: session_001

Compact threshold monitoring stays on for every tick. Raw recording buttons do not affect `n`, `n^-1`, or `n^-2`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 4 | n-1 | rate_of_change_within_sensor | volume | 0.60 | 0.5 |
| 4 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 5 | n-1 | rate_of_change_within_sensor | volume | 0.54 | 0.5 |
| 6 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.50 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.64 | 0.5 |
| 8 | n-1 | rate_of_change_between_sensors | brightness, touch | 2 | 2 senses >= 0.5 |
| 8 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.54 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 9 | n-1 | rate_of_change_between_sensors | brightness, touch | 2 | 2 senses >= 0.5 |
| 10 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 12 | n | threshold_hit | taste | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | taste | 0.85 | 0.5 |
| 12 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 13 | n-1 | rate_of_change_within_sensor | taste | 0.85 | 0.5 |
| 14 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 16 | n-1 | rate_of_change_within_sensor | volume | 0.52 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | smell | 0.62 | 0.5 |
| 16 | n-1 | rate_of_change_between_sensors | volume, smell | 2 | 2 senses >= 0.5 |
| 16 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 17 | n-1 | rate_of_change_within_sensor | volume | 0.50 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | smell | 0.66 | 0.5 |
| 17 | n-1 | rate_of_change_between_sensors | volume, smell | 2 | 2 senses >= 0.5 |
| 18 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
