# Trigger Sheet For Sample 06 Busy

Source: `../sensory_stream_samples/sample_06_busy.md`

Rules applied: `n` records `threshold_hit` when a current value equals `1.0`; `n-1` records rate-of-change hits when a one-tick absolute change is at least `0.5`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 5 | n | threshold_hit | volume | 1.00 | 1.0 |
| 6 | n-1 | rate_of_change_within_sensor | volume | 0.65 | 0.5 |
| 9 | n-1 | rate_of_change_within_sensor | taste | 0.65 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | taste | 0.60 | 0.5 |
| 10 | n-1 | rate_of_change_within_sensor | smell | 0.52 | 0.5 |
| 10 | n-1 | rate_of_change_between_sensors | taste, smell | taste:0.60; smell:0.52 | 0.5 each |
| 14 | n | threshold_hit | volume | 1.00 | 1.0 |
| 15 | n-1 | rate_of_change_within_sensor | volume | 0.70 | 0.5 |
