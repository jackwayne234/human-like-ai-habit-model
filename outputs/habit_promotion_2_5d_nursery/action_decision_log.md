# Habit Promotion 2.5D Action Decision Log

| case | tick | action | reason | active risk memory |
| --- | --- | --- | --- | --- |
| normal_low_tunnel | 1 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| normal_low_tunnel | 2 | probe_forward | risk memory: overheadAhead | overheadAhead |
| normal_low_tunnel | 3 | crouch_body | risk memory: overheadAhead confirmed by probe | overheadAhead |
| normal_low_tunnel | 4 | step_forward | risk memory: crouchedForClearance is active | overheadAhead, crouchedForClearance |
| normal_low_tunnel | 5 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| normal_low_tunnel | 6 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| normal_low_tunnel | 7 | recenter_body | risk memory: rampLoadAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance |
| normal_low_tunnel | 8 | pause | risk memory: raisedSurfaceAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, recenteredForLoad |
| normal_low_tunnel | 9 | step_forward | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| early_low_tunnel | 1 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| early_low_tunnel | 2 | probe_forward | risk memory: overheadAhead | overheadAhead |
| early_low_tunnel | 3 | crouch_body | risk memory: overheadAhead confirmed by probe | overheadAhead |
| early_low_tunnel | 4 | step_forward | risk memory: crouchedForClearance is active | overheadAhead, crouchedForClearance |
| early_low_tunnel | 5 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| early_low_tunnel | 6 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| early_low_tunnel | 7 | recenter_body | risk memory: rampLoadAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance |
| early_low_tunnel | 8 | pause | risk memory: raisedSurfaceAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, recenteredForLoad |
| early_low_tunnel | 9 | step_forward | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| after_raised_surface | 1 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| after_raised_surface | 2 | recenter_body | risk memory: rampLoadAhead | rampLoadAhead, raisedSurfaceAhead |
| after_raised_surface | 3 | pause | risk memory: raisedSurfaceAhead | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad |
| after_raised_surface | 4 | step_forward | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| after_raised_surface | 5 | probe_forward | risk memory: overheadAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| after_raised_surface | 6 | crouch_body | risk memory: overheadAhead confirmed by probe | rampLoadAhead, overheadAhead, raisedSurfaceAhead, settledRaisedSurface, recenteredForLoad |
| after_raised_surface | 7 | step_forward | risk memory: crouchedForClearance is active | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| after_raised_surface | 8 | step_forward | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| after_raised_surface | 9 | step_forward | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| side_echo_false_alarm | 1 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| side_echo_false_alarm | 2 | probe_forward | risk memory: overheadAhead | overheadAhead |
| side_echo_false_alarm | 3 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| side_echo_false_alarm | 4 | probe_forward | risk memory: overheadAhead | overheadAhead |
| side_echo_false_alarm | 5 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| side_echo_false_alarm | 6 | probe_forward | risk memory: overheadAhead | overheadAhead |
| side_echo_false_alarm | 7 | recenter_body | risk memory: rampLoadAhead | rampLoadAhead, raisedSurfaceAhead |
| side_echo_false_alarm | 8 | probe_forward | risk memory: overheadAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, recenteredForLoad |
| side_echo_false_alarm | 9 | pause | risk memory: raisedSurfaceAhead | rampLoadAhead, raisedSurfaceAhead, recenteredForLoad |
| too_low_even_crouched | 1 | step_forward | risk memory has no active stop, duck, probe, or settle request | none |
| too_low_even_crouched | 2 | probe_forward | risk memory: overheadAhead | overheadAhead |
| too_low_even_crouched | 3 | crouch_body | risk memory: overheadAhead confirmed by probe | overheadAhead |
| too_low_even_crouched | 4 | step_forward | risk memory: crouchedForClearance is active | overheadAhead, crouchedForClearance |
| too_low_even_crouched | 5 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| too_low_even_crouched | 6 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| too_low_even_crouched | 7 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| too_low_even_crouched | 8 | step_forward | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| too_low_even_crouched | 9 | recenter_body | risk memory: rampLoadAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance |
