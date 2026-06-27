# Hot Stove Compact n Log

Purpose: provide only compact perception rows to the inner-world bootstrap handlers.

Scene prior:

| field | value |
| --- | --- |
| place | home_kitchen |
| area | stove_counter_edge |
| action context | hand exploring work surface during evening kitchen routine |

| second | chunk | tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 8 | 3 | 8 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | 3 | 8 | n^-1 | rate_of_change_within_sensor | touch | 0.81 | 0.5 |
| 8 | 3 | 8 | n^-2 | rate_of_rate_change | n^-1 trigger stream | 0.17 | > 0 shift |
| 9 | 3 | 9 | n^-1 | rate_of_change_within_sensor | touch | 0.76 | 0.5 |
| 10 | 3 | 10 | n^-2 | rate_of_rate_change | n^-1 trigger stream | 0.17 | > 0 shift |
