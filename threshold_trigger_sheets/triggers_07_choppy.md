# Trigger Sheet For Sample 07 Choppy

Source: `../sensory_stream_samples/sample_07_choppy.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 2 | n-1 | rate_of_change_within_sensor | brightness | 0.58 | 0.5 |
| 2 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 2 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 2 | n-1 | rate_of_change_between_sensors | brightness, volume, touch | brightness:0.58; volume:0.53; touch:0.53 | 0.5 each |
| 3 | n-1 | rate_of_change_within_sensor | brightness | 0.53 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 3 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.53; volume:0.53; smell:0.52 | 0.5 each |
| 4 | n-1 | rate_of_change_within_sensor | brightness | 0.57 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 4 | n-1 | rate_of_change_between_sensors | brightness, volume, touch, smell | brightness:0.57; volume:0.53; touch:0.53; smell:0.52 | 0.5 each |
| 5 | n-1 | rate_of_change_within_sensor | brightness | 0.52 | 0.5 |
| 5 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 5 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.52; volume:0.53 | 0.5 each |
| 6 | n-1 | rate_of_change_within_sensor | brightness | 0.56 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 6 | n-1 | rate_of_change_between_sensors | brightness, volume, touch, smell | brightness:0.56; volume:0.53; touch:0.53; smell:0.52 | 0.5 each |
| 7 | n-1 | rate_of_change_within_sensor | brightness | 0.51 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 7 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.51; volume:0.53; smell:0.52 | 0.5 each |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.53 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 8 | n-1 | rate_of_change_between_sensors | brightness, volume, touch | brightness:0.53; volume:0.53; touch:0.53 | 0.5 each |
| 9 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 9 | n-1 | rate_of_change_between_sensors | volume, smell | volume:0.53; smell:0.52 | 0.5 each |
| 10 | n-1 | rate_of_change_within_sensor | brightness | 0.50 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 10 | n-1 | rate_of_change_between_sensors | brightness, volume, touch, smell | brightness:0.50; volume:0.53; touch:0.53; smell:0.52 | 0.5 each |
| 11 | n-1 | rate_of_change_within_sensor | brightness | 0.52 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 11 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.52; volume:0.53 | 0.5 each |
| 12 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 12 | n-1 | rate_of_change_between_sensors | volume, touch, smell | volume:0.53; touch:0.53; smell:0.52 | 0.5 each |
| 13 | n-1 | rate_of_change_within_sensor | brightness | 0.52 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 13 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.52; volume:0.53; smell:0.52 | 0.5 each |
| 14 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 14 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 14 | n-1 | rate_of_change_between_sensors | volume, touch | volume:0.53; touch:0.53 | 0.5 each |
| 15 | n-1 | rate_of_change_within_sensor | brightness | 0.52 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 15 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.52; volume:0.53; smell:0.52 | 0.5 each |
| 16 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 16 | n-1 | rate_of_change_between_sensors | volume, touch, smell | volume:0.53; touch:0.53; smell:0.52 | 0.5 each |
| 17 | n-1 | rate_of_change_within_sensor | brightness | 0.52 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 17 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.52; volume:0.53 | 0.5 each |
| 18 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 18 | n-1 | rate_of_change_between_sensors | volume, touch, smell | volume:0.53; touch:0.53; smell:0.52 | 0.5 each |
| 19 | n-1 | rate_of_change_within_sensor | brightness | 0.50 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 19 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.50; volume:0.53; smell:0.52 | 0.5 each |
| 20 | n-1 | rate_of_change_within_sensor | volume | 0.53 | 0.5 |
| 20 | n-1 | rate_of_change_within_sensor | touch | 0.53 | 0.5 |
| 20 | n-1 | rate_of_change_between_sensors | volume, touch | volume:0.53; touch:0.53 | 0.5 each |
