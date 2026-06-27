# Embodied Agent Tool Boundary Tool Audit Log

| tick | tool | result | detail |
| --- | --- | --- | --- |
| 0 | requestRawDetail | denied | check exact tunnel geometry before moving |
| 0 | suggestActionFromRiskMemory | ok | step_forward: risk memory has no active stop, duck, probe, or settle request |
| 0 | readCompactSensors | ok | compact stream quiet |
| 0 | readRiskMemory | ok | none |
| 0 | predictAction | ok | step_forward: movement should gather compact evidence without known active risk |
| 1 | chooseAction | ok | step_forward: mismatch_needs_map_update |
| 1 | readCompactSensors | ok | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement |
| 1 | readRiskMemory | ok | overheadAhead |
| 1 | useLearnedControl | ok | adaptive_low_clearance_crossing_routine_v1: probe_forward -> crouch_body -> step_forward |
| 1 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 1 | readCompactSensors | ok | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement |
| 1 | readRiskMemory | ok | overheadAhead |
| 1 | predictAction | ok | probe_forward: probe should test compact forward risk before body commitment |
| 2 | chooseAction | ok | probe_forward: matched_or_explained |
| 2 | readCompactSensors | ok | overhead_clearance n at_threshold; movement_result n^-1 rising |
| 2 | readRiskMemory | ok | overheadAhead |
| 2 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 2 | readCompactSensors | ok | overhead_clearance n at_threshold; movement_result n^-1 rising |
| 2 | readRiskMemory | ok | overheadAhead |
| 2 | predictAction | ok | crouch_body: body height should lower before testing overhead clearance |
| 3 | chooseAction | ok | crouch_body: matched_or_explained |
| 3 | readCompactSensors | ok | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| 3 | readRiskMemory | ok | overheadAhead |
| 3 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 3 | readCompactSensors | ok | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| 3 | readRiskMemory | ok | overheadAhead |
| 3 | predictAction | ok | step_forward: forward movement may carry compact risk already held in risk memory |
| 4 | chooseAction | ok | step_forward: matched_or_explained |
| 4 | readCompactSensors | ok | compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising |
| 4 | readRiskMemory | ok | overheadAhead |
| 4 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 4 | suggestActionFromRiskMemory | ok | probe_forward: risk memory: overheadAhead |
| 4 | readCompactSensors | ok | compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising |
| 4 | readRiskMemory | ok | overheadAhead |
| 4 | predictAction | ok | probe_forward: probe should test compact forward risk before body commitment |
| 5 | chooseAction | ok | probe_forward: mismatch_needs_map_update |
| 5 | readCompactSensors | ok | compact trigger stream n^-2 rising |
| 5 | readRiskMemory | ok | none |
| 5 | suggestActionFromRiskMemory | ok | step_forward: risk memory has no active stop, duck, probe, or settle request |
| 5 | readCompactSensors | ok | compact trigger stream n^-2 rising |
| 5 | readRiskMemory | ok | none |
| 5 | predictAction | ok | step_forward: movement should gather compact evidence without known active risk |
| 6 | chooseAction | ok | step_forward: matched_or_explained |
| 6 | readCompactSensors | ok | compact stream quiet |
| 6 | readRiskMemory | ok | overheadAhead |
| 6 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 6 | suggestActionFromRiskMemory | ok | probe_forward: risk memory: overheadAhead |
| 6 | readCompactSensors | ok | compact stream quiet |
| 6 | readRiskMemory | ok | overheadAhead |
| 6 | predictAction | ok | probe_forward: probe should test compact forward risk before body commitment |
| 7 | chooseAction | ok | probe_forward: mismatch_needs_map_update |
| 7 | readCompactSensors | ok | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising |
| 7 | readRiskMemory | ok | rampLoadAhead, raisedSurfaceAhead |
| 7 | suggestActionFromRiskMemory | ok | recenter_body: risk memory: rampLoadAhead |
| 7 | readCompactSensors | ok | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising |
| 7 | readRiskMemory | ok | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad |
| 7 | predictAction | ok | recenter_body: pitch/load pressure should settle before more movement |
| 8 | chooseAction | ok | recenter_body: matched_or_explained |
| 8 | readCompactSensors | ok | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling |
| 8 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, recenteredForLoad |
| 8 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 8 | suggestActionFromRiskMemory | ok | probe_forward: risk memory: overheadAhead |
| 8 | readCompactSensors | ok | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling |
| 8 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, recenteredForLoad |
| 8 | predictAction | ok | probe_forward: probe should test compact forward risk before body commitment |
| 9 | chooseAction | ok | probe_forward: mismatch_needs_map_update |
| 9 | readCompactSensors | ok | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising |
| 9 | readRiskMemory | ok | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad |
| 9 | suggestActionFromRiskMemory | ok | pause: risk memory: raisedSurfaceAhead |
| 9 | readCompactSensors | ok | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising |
| 9 | readRiskMemory | ok | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 9 | predictAction | ok | pause: pressure should settle without adding new contact |
| 10 | chooseAction | ok | pause: matched_or_explained |
| 10 | readCompactSensors | ok | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling |
| 10 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 10 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 10 | suggestActionFromRiskMemory | ok | probe_forward: risk memory: overheadAhead |
| 10 | readCompactSensors | ok | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling |
| 10 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 10 | predictAction | ok | probe_forward: probe should test compact forward risk before body commitment |
| 11 | chooseAction | ok | probe_forward: mismatch_needs_map_update |
| 11 | readCompactSensors | ok | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising |
| 11 | readRiskMemory | ok | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 11 | suggestActionFromRiskMemory | ok | step_forward: risk memory has no active stop, duck, probe, or settle request |
| 11 | readCompactSensors | ok | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising |
| 11 | readRiskMemory | ok | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 11 | predictAction | ok | step_forward: forward movement may carry compact risk already held in risk memory |
| 12 | chooseAction | ok | step_forward: matched_or_explained |
| 12 | readCompactSensors | ok | compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 falling; compact trigger stream n^-2 falling |
| 12 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 12 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 12 | suggestActionFromRiskMemory | ok | probe_forward: risk memory: overheadAhead |
| 12 | readCompactSensors | ok | compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 falling; compact trigger stream n^-2 falling |
| 12 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 12 | predictAction | ok | probe_forward: probe should test compact forward risk before body commitment |
| 13 | chooseAction | ok | probe_forward: mismatch_needs_map_update |
| 13 | readCompactSensors | ok | compact trigger stream n^-2 rising |
| 13 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 13 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
| 13 | suggestActionFromRiskMemory | ok | crouch_body: risk memory: overheadAhead confirmed by probe |
| 13 | readCompactSensors | ok | compact trigger stream n^-2 rising |
| 13 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| 13 | predictAction | ok | crouch_body: body height should lower before testing overhead clearance |
| 14 | chooseAction | ok | crouch_body: matched_or_explained |
| 14 | readCompactSensors | ok | compact stream quiet |
| 14 | readRiskMemory | ok | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| 14 | writeMapBelief | ok | near_body_height: possible_low_overhead_clearance |
