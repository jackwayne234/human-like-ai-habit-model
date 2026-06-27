# Trigger Sheet For Sample 09 Very Noisy

Source: `../sensory_stream_samples/sample_09_very_noisy.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 2 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 2 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 3 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.85; volume:0.70 | 0.5 each |
| 4 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 4 | n | threshold_hit | touch | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 4 | n-1 | rate_of_change_between_sensors | brightness, volume, touch | brightness:0.85; volume:0.70; touch:0.65 | 0.5 each |
| 5 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 5 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 5 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 5 | n-1 | rate_of_change_between_sensors | brightness, touch, taste | brightness:0.85; touch:0.65; taste:0.53 | 0.5 each |
| 6 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 6 | n | threshold_hit | smell | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 6 | n-1 | rate_of_change_between_sensors | brightness, volume, taste | brightness:0.85; volume:0.70; taste:0.53 | 0.5 each |
| 7 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | volume | 0.85 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | smell | 0.75 | 0.5 |
| 7 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.95; volume:0.85; smell:0.75 | 0.5 each |
| 8 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 8 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.85 | 0.5 |
| 8 | n-1 | rate_of_change_between_sensors | brightness, touch | brightness:0.95; touch:0.85 | 0.5 each |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 9 | n-1 | rate_of_change_between_sensors | brightness, volume, touch | brightness:0.85; volume:0.70; touch:0.65 | 0.5 each |
| 10 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 10 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 10 | n-1 | rate_of_change_between_sensors | brightness, volume, taste | brightness:0.85; volume:0.70; taste:0.53 | 0.5 each |
| 11 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 11 | n-1 | rate_of_change_between_sensors | brightness, taste | brightness:0.85; taste:0.53 | 0.5 each |
| 12 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 12 | n | threshold_hit | touch | 1.00 | 1.0 |
| 12 | n | threshold_hit | smell | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 12 | n-1 | rate_of_change_between_sensors | brightness, volume, touch | brightness:0.85; volume:0.70; touch:0.65 | 0.5 each |
| 13 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | volume | 0.85 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | touch | 0.85 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | smell | 0.75 | 0.5 |
| 13 | n-1 | rate_of_change_between_sensors | brightness, volume, touch, smell | brightness:0.95; volume:0.85; touch:0.85; smell:0.75 | 0.5 each |
| 14 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 14 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 15 | n-1 | rate_of_change_between_sensors | brightness, volume, taste | brightness:0.85; volume:0.70; taste:0.53 | 0.5 each |
| 16 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 16 | n | threshold_hit | touch | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 16 | n-1 | rate_of_change_between_sensors | brightness, volume, touch, taste | brightness:0.85; volume:0.70; touch:0.65; taste:0.53 | 0.5 each |
| 17 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 17 | n-1 | rate_of_change_between_sensors | brightness, touch | brightness:0.85; touch:0.65 | 0.5 each |
| 18 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 18 | n | threshold_hit | smell | 1.00 | 1.0 |
| 18 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 18 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.85; volume:0.70 | 0.5 each |
| 19 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | volume | 0.85 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | smell | 0.75 | 0.5 |
| 19 | n-1 | rate_of_change_between_sensors | brightness, volume, smell | brightness:0.95; volume:0.85; smell:0.75 | 0.5 each |
| 20 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 20 | n | threshold_hit | touch | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 20 | n-1 | rate_of_change_within_sensor | touch | 0.85 | 0.5 |
| 20 | n-1 | rate_of_change_within_sensor | taste | 0.78 | 0.5 |
| 20 | n-1 | rate_of_change_between_sensors | brightness, touch, taste | brightness:0.95; touch:0.85; taste:0.78 | 0.5 each |
