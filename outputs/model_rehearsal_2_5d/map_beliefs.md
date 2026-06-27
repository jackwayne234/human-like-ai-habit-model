# Model Rehearsal 2.5D Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
| 1 | local path is open enough to sample with a normal forward action | low | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement | mismatch_needs_map_update |
| 2 | near body path may require lower posture before forward commitment | medium | overhead_clearance n at_threshold; movement_result n^-1 rising | matched_or_explained |
| 3 | active routine is being tested from compact tool receipts | medium | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained |
| 4 | active routine is being tested from compact tool receipts | medium | compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising | matched_or_explained |
| 5 | forward clearance still needs compact confirmation | medium | compact trigger stream n^-2 rising | mismatch_needs_map_update |
| 6 | local path is open enough to sample with a normal forward action | medium | compact stream quiet | matched_or_explained |
| 7 | forward clearance still needs compact confirmation | medium | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update |
| 8 | height-load transition may be affecting posture | medium | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | matched_or_explained |
| 9 | forward clearance still needs compact confirmation | medium | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update |
| 10 | height-load transition may be affecting posture | medium | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | matched_or_explained |
| 11 | forward clearance still needs compact confirmation | medium | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update |
| 12 | height-load transition may be affecting posture | medium | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | matched_or_explained |
| 13 | forward clearance still needs compact confirmation | medium | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update |
| 14 | height-load transition may be affecting posture | medium | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | matched_or_explained |
