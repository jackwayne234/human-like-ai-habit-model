# Embodied Agent Tool Boundary Action Log

Agent-facing action receipts only. This log intentionally omits hidden simulator coordinates and room feature objects.

| tick | action | reason | compact summary | comparison | risk memory |
| --- | --- | --- | --- | --- | --- |
| 1 | step_forward | risk memory has no active stop, duck, probe, or settle request | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement | mismatch_needs_map_update | overheadAhead |
| 2 | probe_forward | learned control queue | overhead_clearance n at_threshold; movement_result n^-1 rising | matched_or_explained | overheadAhead |
| 3 | crouch_body | learned control queue | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained | overheadAhead |
| 4 | step_forward | learned control queue | compact trigger stream n^-2 rising; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 rising | matched_or_explained | overheadAhead |
| 5 | probe_forward | risk memory: overheadAhead | compact trigger stream n^-2 rising | mismatch_needs_map_update | none |
| 6 | step_forward | risk memory has no active stop, duck, probe, or settle request | compact stream quiet | matched_or_explained | overheadAhead |
| 7 | probe_forward | risk memory: overheadAhead | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update | rampLoadAhead, raisedSurfaceAhead |
| 8 | recenter_body | risk memory: rampLoadAhead | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | matched_or_explained | rampLoadAhead, overheadAhead, raisedSurfaceAhead, recenteredForLoad |
| 9 | probe_forward | risk memory: overheadAhead | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad |
| 10 | pause | risk memory: raisedSurfaceAhead | touch_left_base n^-1 falling; compact trigger stream n^-2 falling; touch_right_base n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling | matched_or_explained | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 11 | probe_forward | risk memory: overheadAhead | touch_left_base n^-1 rising; compact trigger stream n^-2 rising; touch_right_base n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 rising | mismatch_needs_map_update | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 12 | step_forward | risk memory has no active stop, duck, probe, or settle request | compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 falling; compact trigger stream n^-2 falling | matched_or_explained | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 13 | probe_forward | risk memory: overheadAhead | compact trigger stream n^-2 rising | mismatch_needs_map_update | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| 14 | crouch_body | risk memory: overheadAhead confirmed by probe | compact stream quiet | matched_or_explained | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
