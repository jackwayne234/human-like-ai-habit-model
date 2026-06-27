# Embodied Agent Tool Boundary Map Beliefs

| tick | belief | confidence | evidence | next prediction |
| --- | --- | --- | --- | --- |
| 1 | near_body_height: possible_low_overhead_clearance | medium | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement | probe_forward then crouch_body should reduce upper-body contact risk |
| 2 | near_body_height: possible_low_overhead_clearance | medium | overhead_clearance n at_threshold; movement_result n^-1 rising | probe_forward then crouch_body should reduce upper-body contact risk |
| 3 | near_body_height: possible_low_overhead_clearance | medium | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling | probe_forward then crouch_body should reduce upper-body contact risk |
| 4 | near_body_height: possible_low_overhead_clearance | medium | compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising | probe_forward then crouch_body should reduce upper-body contact risk |
| 6 | near_body_height: possible_low_overhead_clearance | medium | compact stream quiet | probe_forward then crouch_body should reduce upper-body contact risk |
| 8 | near_body_height: possible_low_overhead_clearance | medium | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | probe_forward then crouch_body should reduce upper-body contact risk |
| 10 | near_body_height: possible_low_overhead_clearance | medium | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | probe_forward then crouch_body should reduce upper-body contact risk |
| 12 | near_body_height: possible_low_overhead_clearance | medium | compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 falling; compact trigger stream n^-2 falling | probe_forward then crouch_body should reduce upper-body contact risk |
| 13 | near_body_height: possible_low_overhead_clearance | medium | compact trigger stream n^-2 rising | probe_forward then crouch_body should reduce upper-body contact risk |
| 14 | near_body_height: possible_low_overhead_clearance | medium | compact stream quiet | probe_forward then crouch_body should reduce upper-body contact risk |
