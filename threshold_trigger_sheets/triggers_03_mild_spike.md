# Trigger Sheet For Sample 03 Mild Spike

Source: `../sensory_stream_samples/sample_03_mild_spike.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 8 | n | threshold_hit | brightness | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | brightness | 0.56 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | brightness | 0.58 | 0.5 |
