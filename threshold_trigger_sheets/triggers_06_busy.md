# Trigger Sheet For Sample 06: Busy

Source: `../sensory_stream_samples/sample_06_busy.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records within-sensor and cross-sensor rate-of-change hits when one-tick absolute change is at least `0.5`; `n-2` records rate-of-rate-change when the compact `n-1` trigger pattern shifts.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 5 | n | threshold_hit | volume | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.65 | 0.5 |
| 6 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 7 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 9 | n-1 | rate_of_change_within_sensor | taste | 0.65 | 0.5 |
| 9 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 10 | n-1 | rate_of_change_within_sensor | taste | 0.60 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 10 | n-1 | rate_of_change_cross_sensor | taste, smell | 2 | 2 sensors |
| 10 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 11 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
| 14 | n | threshold_hit | volume | 1.00 | 1.0 |
| 15 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
| 15 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 16 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
