# Trigger Sheet For Sample 05: Cross Sense

Source: `../sensory_stream_samples/sample_05_cross_sense.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records within-sensor and cross-sensor rate-of-change hits when one-tick absolute change is at least `0.5`; `n-2` records rate-of-rate-change when the compact `n-1` trigger pattern shifts.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 10 | n-1 | rate_of_change_within_sensor | brightness | 0.57 | 0.5 |
| 10 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 11 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | volume | 0.52 | 0.5 |
| 11 | n-1 | rate_of_change_cross_sensor | brightness, volume | 2 | 2 sensors |
| 11 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.33 | > 0 shift |
| 12 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.50 | > 0 shift |
