# Trigger Sheet For Sample 04 Touch Spike

Source: `../sensory_stream_samples/sample_04_touch_spike.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 6 | n-1 | rate_of_change_within_sensor | touch | 0.50 | 0.5 |
| 7 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.75 | 0.5 |
