# Trigger Sheet For Sample 09: Very Noisy

Source: `../sensory_stream_samples/sample_09_very_noisy.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records within-sensor and cross-sensor rate-of-change hits when one-tick absolute change is at least `0.5`; `n-2` records rate-of-rate-change when the compact `n-1` trigger pattern shifts.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 2 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 2 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 2 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 3 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 3 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 3 | n-1 | rate_of_change_cross_sensor | brightness, volume | 2 | 2 sensors |
| 3 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 4 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 4 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 4 | n | threshold_hit | touch | 1.00 | 1.0 |
| 4 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 4 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch | 3 | 2 sensors |
| 4 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 5 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 5 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 5 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 5 | n-1 | rate_of_change_cross_sensor | brightness, touch, taste | 3 | 2 sensors |
| 6 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 6 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 6 | n | threshold_hit | smell | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_cross_sensor | brightness, volume, taste | 3 | 2 sensors |
| 7 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | volume | 0.85 | 0.5 |
| 7 | n-1 | rate_of_change_within_sensor | smell | 0.75 | 0.5 |
| 7 | n-1 | rate_of_change_cross_sensor | brightness, volume, smell | 3 | 2 sensors |
| 8 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 8 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.85 | 0.5 |
| 8 | n-1 | rate_of_change_cross_sensor | brightness, touch | 2 | 2 sensors |
| 8 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 9 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch | 3 | 2 sensors |
| 9 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 10 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 10 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 10 | n-1 | rate_of_change_cross_sensor | brightness, volume, taste | 3 | 2 sensors |
| 11 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 11 | n-1 | rate_of_change_cross_sensor | brightness, taste | 2 | 2 sensors |
| 11 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 12 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 12 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 12 | n | threshold_hit | touch | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 12 | n | threshold_hit | smell | 1.00 | 1.0 |
| 12 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch | 3 | 2 sensors |
| 12 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 13 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | volume | 0.85 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | touch | 0.85 | 0.5 |
| 13 | n-1 | rate_of_change_within_sensor | smell | 0.75 | 0.5 |
| 13 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, smell | 4 | 2 sensors |
| 13 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 14 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 14 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 14 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.67 | > 0 shift |
| 15 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 15 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 15 | n-1 | rate_of_change_cross_sensor | brightness, volume, taste | 3 | 2 sensors |
| 15 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 16 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 16 | n | threshold_hit | touch | 1.00 | 1.0 |
| 16 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 16 | n-1 | rate_of_change_within_sensor | taste | 0.53 | 0.5 |
| 16 | n-1 | rate_of_change_cross_sensor | brightness, volume, touch, taste | 4 | 2 sensors |
| 16 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 17 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 17 | n-1 | rate_of_change_within_sensor | touch | 0.65 | 0.5 |
| 17 | n-1 | rate_of_change_cross_sensor | brightness, touch | 2 | 2 sensors |
| 17 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 18 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 18 | n-1 | rate_of_change_within_sensor | brightness | 0.85 | 0.5 |
| 18 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 18 | n | threshold_hit | smell | 1.00 | 1.0 |
| 18 | n-1 | rate_of_change_cross_sensor | brightness, volume | 2 | 2 sensors |
| 19 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | volume | 0.85 | 0.5 |
| 19 | n-1 | rate_of_change_within_sensor | smell | 0.75 | 0.5 |
| 19 | n-1 | rate_of_change_cross_sensor | brightness, volume, smell | 3 | 2 sensors |
| 19 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 20 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | brightness | 0.95 | 0.5 |
| 20 | n | threshold_hit | touch | 1.00 | 1.0 |
| 20 | n-1 | rate_of_change_within_sensor | touch | 0.85 | 0.5 |
| 20 | n-1 | rate_of_change_within_sensor | taste | 0.78 | 0.5 |
| 20 | n-1 | rate_of_change_cross_sensor | brightness, touch, taste | 3 | 2 sensors |
