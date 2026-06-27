# Multi-Touch Body Compact Log

Purpose: prove that compact touch logs can preserve body location without exposing full raw tactile detail.

| tick | layer | event type | involved touch location | detected value or rate | signed touch change | threshold |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | n | threshold_hit | touch_left_fingertips | 1.00 | 0.00 | 1.0 |
| 2 | n^-1 | rate_of_change_within_touch_location | touch_left_fingertips | 0.92 | 0.92 | 0.5 |
| 2 | n^-2 | touch_location_pattern_shift | multi-touch trigger stream | 0.10 | 0.00 | > 0 shift |
| 3 | n^-1 | rate_of_change_within_touch_location | touch_left_fingertips | 0.88 | -0.88 | 0.5 |
| 4 | n^-2 | touch_location_pattern_shift | multi-touch trigger stream | 0.10 | 0.00 | > 0 shift |
| 5 | n | threshold_hit | touch_left_foot | 1.00 | 0.00 | 1.0 |
| 5 | n^-1 | rate_of_change_within_touch_location | touch_left_foot | 0.74 | 0.74 | 0.5 |
| 5 | n^-2 | touch_location_pattern_shift | multi-touch trigger stream | 0.10 | 0.00 | > 0 shift |
| 6 | n | threshold_hit | touch_torso_front | 1.00 | 0.00 | 1.0 |
| 6 | n^-1 | rate_of_change_within_touch_location | touch_torso_front | 0.92 | 0.92 | 0.5 |
| 6 | n^-1 | rate_of_change_within_touch_location | touch_left_foot | 0.78 | -0.78 | 0.5 |
| 6 | n^-1 | rate_of_change_between_touch_locations | touch_torso_front, touch_left_foot | 2.00 | 0.00 | 2 touch locations >= 0.5 |
| 6 | n^-2 | touch_location_pattern_shift | multi-touch trigger stream | 0.10 | 0.00 | > 0 shift |
| 7 | n^-1 | rate_of_change_within_touch_location | touch_left_palm | 0.80 | 0.80 | 0.5 |
| 7 | n^-1 | rate_of_change_within_touch_location | touch_right_palm | 0.82 | 0.82 | 0.5 |
| 7 | n^-1 | rate_of_change_within_touch_location | touch_torso_front | 0.82 | -0.82 | 0.5 |
| 7 | n^-1 | rate_of_change_between_touch_locations | touch_left_palm, touch_right_palm, touch_torso_front | 3.00 | 0.00 | 2 touch locations >= 0.5 |
| 7 | n^-2 | touch_location_pattern_shift | multi-touch trigger stream | 0.10 | 0.00 | > 0 shift |
| 8 | n^-1 | rate_of_change_within_touch_location | touch_left_palm | 0.70 | -0.70 | 0.5 |
| 8 | n^-1 | rate_of_change_within_touch_location | touch_right_palm | 0.70 | -0.70 | 0.5 |
| 8 | n^-1 | rate_of_change_between_touch_locations | touch_left_palm, touch_right_palm | 2.00 | 0.00 | 2 touch locations >= 0.5 |
| 8 | n^-2 | touch_location_pattern_shift | multi-touch trigger stream | 0.10 | 0.00 | > 0 shift |
