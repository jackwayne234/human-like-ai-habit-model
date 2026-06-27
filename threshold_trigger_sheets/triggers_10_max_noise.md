# Trigger Sheet For Sample 10: Max Noise

Source: `../sensory_stream_samples/sample_10_max_noise.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records within-sensor and cross-sensor rate-of-change hits when one-tick absolute change is at least `0.5`; `n-2` records rate-of-rate-change when the compact `n-1` trigger pattern shifts.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 1 | n | threshold_hit | volume | 1.00 | 1.0 |
| 1 | n | threshold_hit | taste | 1.00 | 1.0 |
| 2 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 2 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 2 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 2 | n | threshold_hit | touch | 1.00 | 1.0 |
| 2 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 2 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 2 | n | threshold_hit | smell | 1.00 | 1.0 |
| 2 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 2 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 2 | n-2 | rate_of_rate_change | n-1 trigger stream | 1.00 | > 0 shift |
| 3 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 3 | n | threshold_hit | volume | 1.00 | 1.0 |
| 3 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 3 | n | threshold_hit | taste | 1.00 | 1.0 |
| 3 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 3 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 4 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 4 | n | threshold_hit | touch | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 4 | n | threshold_hit | smell | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 4 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 5 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 5 | n | threshold_hit | volume | 1.00 | 1.0 |
| 5 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 5 | n | threshold_hit | touch | 1.00 | 1.0 |
| 5 | n | threshold_hit | taste | 1.00 | 1.0 |
| 5 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 5 | n | threshold_hit | smell | 1.00 | 1.0 |
| 5 | n-1 | rate_of_change_cross_sensor | volume, taste | 2 | 2 sensors |
| 5 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 6 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 6 | n | threshold_hit | touch | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 6 | n | threshold_hit | smell | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_cross_sensor | volume, taste | 2 | 2 sensors |
| 7 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 7 | n | threshold_hit | volume | 1.00 | 1.0 |
| 7 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 7 | n | threshold_hit | taste | 1.00 | 1.0 |
| 7 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 7 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 7 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 8 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 8 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 8 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 8 | n | threshold_hit | smell | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 8 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 9 | n | threshold_hit | volume | 1.00 | 1.0 |
| 9 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 9 | n | threshold_hit | taste | 1.00 | 1.0 |
| 9 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 9 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 10 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 10 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 10 | n | threshold_hit | volume | 1.00 | 1.0 |
| 10 | n | threshold_hit | touch | 1.00 | 1.0 |
| 10 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 10 | n | threshold_hit | taste | 1.00 | 1.0 |
| 10 | n | threshold_hit | smell | 1.00 | 1.0 |
| 10 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 10 | n-1 | rate_of_change_cross_sensor | brightness, touch, smell | 3 | 2 sensors |
| 10 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 11 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 11 | n | threshold_hit | volume | 1.00 | 1.0 |
| 11 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 11 | n | threshold_hit | taste | 1.00 | 1.0 |
| 11 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 11 | n-1 | rate_of_change_cross_sensor | brightness, touch, smell | 3 | 2 sensors |
| 12 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 12 | n | threshold_hit | touch | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 12 | n | threshold_hit | smell | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 12 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 12 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 13 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 13 | n | threshold_hit | volume | 1.00 | 1.0 |
| 13 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 13 | n | threshold_hit | taste | 1.00 | 1.0 |
| 13 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 13 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 14 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 14 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 14 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 14 | n | threshold_hit | touch | 1.00 | 1.0 |
| 14 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 14 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 14 | n | threshold_hit | smell | 1.00 | 1.0 |
| 14 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 14 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 15 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 15 | n | threshold_hit | volume | 1.00 | 1.0 |
| 15 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 15 | n | threshold_hit | touch | 1.00 | 1.0 |
| 15 | n | threshold_hit | taste | 1.00 | 1.0 |
| 15 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 15 | n | threshold_hit | smell | 1.00 | 1.0 |
| 15 | n-1 | rate_of_change_cross_sensor | volume, taste | 2 | 2 sensors |
| 15 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 16 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 16 | n | threshold_hit | touch | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 16 | n | threshold_hit | smell | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_cross_sensor | volume, taste | 2 | 2 sensors |
| 17 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 17 | n | threshold_hit | volume | 1.00 | 1.0 |
| 17 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 17 | n | threshold_hit | taste | 1.00 | 1.0 |
| 17 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 17 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 17 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 18 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 18 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 18 | n | threshold_hit | touch | 1.00 | 1.0 |
| 18 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 18 | n | threshold_hit | smell | 1.00 | 1.0 |
| 18 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 18 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 19 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 19 | n | threshold_hit | volume | 1.00 | 1.0 |
| 19 | n-1 | rate_of_change_within_sensor | volume | 0.90 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 19 | n | threshold_hit | taste | 1.00 | 1.0 |
| 19 | n-1 | rate_of_change_within_sensor | taste | 0.90 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 19 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste, smell | 5 | 2 sensors |
| 20 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | brightness | 0.90 | 0.5 |
| 20 | n | threshold_hit | volume | 1.00 | 1.0 |
| 20 | n | threshold_hit | touch | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | touch | 0.90 | 0.5 |
| 20 | n | threshold_hit | taste | 1.00 | 1.0 |
| 20 | n | threshold_hit | smell | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | smell | 0.90 | 0.5 |
| 20 | n-1 | rate_of_change_cross_sensor | brightness, touch, smell | 3 | 2 sensors |
| 20 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
