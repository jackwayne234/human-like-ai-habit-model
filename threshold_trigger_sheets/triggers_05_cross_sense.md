# Trigger Sheet For Sample 05 Cross Sense

Source: `../sensory_stream_samples/sample_05_cross_sense.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 10 | n-1 | rate_of_change_within_sensor | brightness | 0.57 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | brightness | 0.55 | 0.5 |
| 11 | n-1 | rate_of_change_within_sensor | volume | 0.52 | 0.5 |
| 11 | n-1 | rate_of_change_between_sensors | brightness, volume | brightness:0.55; volume:0.52 | 0.5 each |
