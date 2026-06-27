# Tiny 2.5D Nursery Action Decision Log

Run 1 is a scripted first-pass height/body experience. Run 2 is selected by the compact 2.5D action chooser from prior compact-derived beliefs plus current compact outcomes. This log is robot-facing: it records no hidden coordinates.

| run | tick | source | action | intention | reason | active compact beliefs |
| --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | scripted | step_forward | begin through the nursery path | scripted first-pass height experience | none |
| run_1 | 2 | scripted | step_forward | continue across the first height change | scripted first-pass height experience | none |
| run_1 | 3 | scripted | step_forward | keep moving after the load shift | scripted first-pass height experience | none |
| run_1 | 4 | scripted | step_forward | commit body weight near the foot-warning area | scripted first-pass height experience | none |
| run_1 | 5 | scripted | step_forward | continue after the pitch warning | scripted first-pass height experience | none |
| run_1 | 6 | scripted | step_forward | try the narrowing overhead path while standing | scripted first-pass height experience | none |
| run_1 | 7 | scripted | step_forward | push forward under low clearance | scripted first-pass height experience | none |
| run_1 | 8 | scripted | step_forward | continue toward the raised surface | scripted first-pass height experience | none |
| run_1 | 9 | scripted | pause | let body pressure settle | scripted first-pass height experience | none |
| run_1 | 10 | scripted | step_forward | test the final raised-pressure patch | scripted first-pass height experience | none |
| run_2 | 1 | compact_2_5d_action_chooser | step_forward | continue with a small forward test | no compact height belief currently asks for ducking, probing, pausing, or recentering | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 2 | compact_2_5d_action_chooser | recenter_body | reduce pitch/load mismatch before continuing over height change | compact height pressure suggests ramp or slope load shift | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 3 | compact_2_5d_action_chooser | step_forward | continue with a small forward test | no compact height belief currently asks for ducking, probing, pausing, or recentering | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 4 | compact_2_5d_action_chooser | probe_forward | test for foot drop before committing body weight | prior compact map says a forward path may contain a ledge or drop | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 5 | compact_2_5d_action_chooser | step_forward | continue with a small forward test | no compact height belief currently asks for ducking, probing, pausing, or recentering | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 6 | compact_2_5d_action_chooser | probe_forward | test vertical clearance before moving upper body forward | prior compact map says overhead clearance may be low | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 7 | compact_2_5d_action_chooser | step_forward | commit slowly after the drop was noticed by the foot probe | drop warning was routed through probe before body commitment | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 8 | compact_2_5d_action_chooser | probe_forward | test vertical clearance before moving upper body forward | prior compact map says overhead clearance may be low | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 9 | compact_2_5d_action_chooser | step_forward | commit slowly after the drop was noticed by the foot probe | drop warning was routed through probe before body commitment | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 10 | compact_2_5d_action_chooser | probe_forward | test vertical clearance before moving upper body forward | prior compact map says overhead clearance may be low | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 11 | compact_2_5d_action_chooser | crouch_body | lower body before testing the low-clearance path | compact probe reported overhead clearance pressure | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| run_2 | 12 | compact_2_5d_action_chooser | step_forward | move while crouched after low-clearance warning | crouch should reduce overhead contact risk | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
