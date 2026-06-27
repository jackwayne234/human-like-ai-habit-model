# Trigger Sheet For Sample 03: Mild Spike

Source: `../sensory_stream_samples/sample_03_mild_spike.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records within-sensor and cross-sensor rate-of-change hits when one-tick absolute change is at least `0.5`; `n-2` records rate-of-rate-change when the compact `n-1` trigger pattern shifts.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 8 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.56 | 0.5 |
| 8 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.58 | 0.5 |
| 10 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
