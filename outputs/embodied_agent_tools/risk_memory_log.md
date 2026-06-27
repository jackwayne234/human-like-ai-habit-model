# Embodied Agent Tool Boundary Risk Memory Log

| tick | action | before | compact evidence | after | outcome |
| --- | --- | --- | --- | --- | --- |
| 1 | step_forward | none | overhead_clearance:n^-1:rising; vertical_echo:n^-1:rising; overhead_clearance, vertical_echo:n^-1:agreement | overheadAhead | succeeded |
| 2 | probe_forward | overheadAhead | overhead_clearance:n:at_threshold; movement_result:n^-1:rising | overheadAhead | probe_overhead_warning |
| 3 | crouch_body | overheadAhead | overhead_clearance:n^-1:falling; compact trigger stream:n^-2:falling; movement_result:n^-1:falling; compact trigger stream:n^-2:falling | overheadAhead | settled |
| 4 | step_forward | overheadAhead | compact trigger stream:n^-2:rising; ultrasonic_echo:n^-1:falling; compact trigger stream:n^-2:falling; compact trigger stream:n^-2:rising | overheadAhead | succeeded |
| 5 | probe_forward | overheadAhead | compact trigger stream:n^-2:rising | none | succeeded |
| 6 | step_forward | none | compact stream quiet | overheadAhead | succeeded |
| 7 | probe_forward | overheadAhead | touch_left_base:n^-1:rising; compact trigger stream:n^-2:rising; touch_right_base:n^-1:rising; compact trigger stream:n^-2:rising | rampLoadAhead, raisedSurfaceAhead | succeeded |
| 8 | recenter_body | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad | touch_left_base:n^-1:falling; compact trigger stream:n^-2:falling; touch_right_base:n^-1:falling; compact trigger stream:n^-2:falling | rampLoadAhead, overheadAhead, raisedSurfaceAhead, recenteredForLoad | succeeded |
| 9 | probe_forward | rampLoadAhead, overheadAhead, raisedSurfaceAhead, recenteredForLoad | touch_left_base:n^-1:rising; compact trigger stream:n^-2:rising; touch_right_base:n^-1:rising; compact trigger stream:n^-2:rising | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad | succeeded |
| 10 | pause | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | touch_left_base:n^-1:falling; compact trigger stream:n^-2:falling; touch_right_base:n^-1:falling; compact trigger stream:n^-2:falling | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | settled |
| 11 | probe_forward | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | touch_left_base:n^-1:rising; compact trigger stream:n^-2:rising; touch_right_base:n^-1:rising; compact trigger stream:n^-2:rising | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | succeeded |
| 12 | step_forward | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | compact trigger stream:n^-2:falling; compact trigger stream:n^-2:falling; compact trigger stream:n^-2:falling; vertical_echo:n^-1:falling | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | succeeded |
| 13 | probe_forward | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | compact trigger stream:n^-2:rising | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad | probe_overhead_warning |
| 14 | crouch_body | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad | compact stream quiet | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad | settled |
