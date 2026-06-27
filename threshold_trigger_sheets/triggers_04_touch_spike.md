# Trigger Sheet For Sample 04: Touch Spike

Source: `../sensory_stream_samples/sample_04_touch_spike.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records within-sensor and cross-sensor rate-of-change hits when one-tick absolute change is at least `0.5`; `n-2` records rate-of-rate-change when the compact `n-1` trigger pattern shifts.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 7 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.75 | 0.5 |
| 8 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 9 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
