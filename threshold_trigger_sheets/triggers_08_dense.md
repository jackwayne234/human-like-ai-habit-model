# Trigger Sheet For Sample 08 Dense

Source: `../sensory_stream_samples/sample_08_dense.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 3 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 4 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 4 | n-1 | rate_of_change_between_sensors | brightness, smell | brightness:0.55; smell:0.60 | 0.5 each |
| 5 | n | threshold_hit | volume | 1.00 | 1.0 |
| 5 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 5 | n-1 | rate_of_change_within_sensor | volume | 0.60 | 0.5 |
| 5 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.55; volume:0.60 | 0.5 each |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.60 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 6 | n-1 | rate_of_change_between_sensors | volume, touch, smell | volume:0.60; touch:0.60; smell:0.60 | 0.5 each |
| 7 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | taste | 0.60 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 7 | n-1 | rate_of_change_between_sensors | touch, taste, smell | touch:0.60; taste:0.60; smell:0.60 | 0.5 each |
| 8 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | taste | 0.60 | 0.5 |
| 8 | n-1 | rate_of_change_between_sensors | brightness, taste | brightness:0.55; taste:0.60 | 0.5 each |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.80 | 0.5 |
| 10 | n | threshold_hit | volume | 1.00 | 1.0 |
| 10 | n-1 | rate_of_change_within_sensor | volume | 0.78 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | volume | 0.60 | 0.5 |
| 12 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 12 | n-1 | rate_of_change_between_sensors | brightness, touch, smell | brightness:0.55; touch:0.60; smell:0.60 | 0.5 each |
| 13 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 13 | n-1 | rate_of_change_between_sensors | brightness, touch, smell | brightness:0.55; touch:0.60; smell:0.60 | 0.5 each |
| 14 | n-1 | rate_of_change_within_sensor | taste | 0.60 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | taste | 0.64 | 0.5 |
| 16 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_within_sensor | brightness | 0.80 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 18 | n-1 | rate_of_change_between_sensors | touch, smell | touch:0.60; smell:0.60 | 0.5 each |
| 19 | n-1 | rate_of_change_within_sensor | touch | 0.60 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | smell | 0.60 | 0.5 |
| 19 | n-1 | rate_of_change_between_sensors | touch, smell | touch:0.60; smell:0.60 | 0.5 each |
| 20 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 20 | n | threshold_hit | volume | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 20 | n-1 | rate_of_change_within_sensor | volume | 0.60 | 0.5 |
| 20 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.55; volume:0.60 | 0.5 each |
