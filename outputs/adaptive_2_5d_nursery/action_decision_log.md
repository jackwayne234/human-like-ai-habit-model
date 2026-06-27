# Adaptive 2.5D Nursery Action Decision Log

The adaptive run is selected by compact risk memory, not fixed route timing. This log is robot-facing and records no hidden coordinates.

| run | tick | source | action | intention | reason | active risk memory |
| --- | --- | --- | --- | --- | --- | --- |
| adaptive_naive | 1 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 2 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 3 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 4 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 5 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 6 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 7 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 8 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 9 | scripted | pause | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 10 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 11 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_naive | 12 | scripted | step_forward | naive movement without compact risk-memory adaptation | scripted movement without adaptive risk memory | none |
| adaptive_risk_memory | 1 | compact_risk_memory_chooser | step_forward | gather the next compact body/world sample | risk memory has no active stop, duck, probe, or settle request | none |
| adaptive_risk_memory | 2 | compact_risk_memory_chooser | probe_forward | test upper-body clearance from compact vertical risk memory | risk memory: overheadAhead | overheadAhead |
| adaptive_risk_memory | 3 | compact_risk_memory_chooser | crouch_body | lower body because compact risk memory says overhead clearance is tight | risk memory: overheadAhead confirmed by probe | overheadAhead |
| adaptive_risk_memory | 4 | compact_risk_memory_chooser | step_forward | cross low-clearance area while the body is lowered | risk memory: crouchedForClearance is active | overheadAhead, crouchedForClearance |
| adaptive_risk_memory | 5 | compact_risk_memory_chooser | step_forward | gather the next compact body/world sample | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| adaptive_risk_memory | 6 | compact_risk_memory_chooser | step_forward | gather the next compact body/world sample | risk memory has no active stop, duck, probe, or settle request | overheadAhead, crouchedForClearance |
| adaptive_risk_memory | 7 | compact_risk_memory_chooser | recenter_body | settle pitch/load before moving across height change | risk memory: rampLoadAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance |
| adaptive_risk_memory | 8 | compact_risk_memory_chooser | pause | separate raised-surface load from collision | risk memory: raisedSurfaceAhead | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, recenteredForLoad |
| adaptive_risk_memory | 9 | compact_risk_memory_chooser | step_forward | gather the next compact body/world sample | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| adaptive_risk_memory | 10 | compact_risk_memory_chooser | step_forward | gather the next compact body/world sample | risk memory has no active stop, duck, probe, or settle request | rampLoadAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| adaptive_risk_memory | 11 | compact_risk_memory_chooser | probe_forward | test foot support from compact drop risk memory | risk memory: dropAhead | rampLoadAhead, dropAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| adaptive_risk_memory | 12 | compact_risk_memory_chooser | step_forward | commit slowly after compact foot-drop probe warning | risk memory: dropAhead was probed before body commitment | rampLoadAhead, dropAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| adaptive_risk_memory | 13 | compact_risk_memory_chooser | probe_forward | test foot support from compact drop risk memory | risk memory: dropAhead | rampLoadAhead, dropAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
| adaptive_risk_memory | 14 | compact_risk_memory_chooser | step_forward | commit slowly after compact foot-drop probe warning | risk memory: dropAhead was probed before body commitment | rampLoadAhead, dropAhead, overheadAhead, raisedSurfaceAhead, crouchedForClearance, settledRaisedSurface, recenteredForLoad |
