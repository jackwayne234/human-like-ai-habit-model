# Layered 2.5D Nursery Action Decision Log

The transfer run is selected by compact lessons learned in the training room. This log is robot-facing and records no hidden coordinates.

| run | tick | source | action | intention | reason | active compact beliefs |
| --- | --- | --- | --- | --- | --- | --- |
| training_room | 1 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 2 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 3 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 4 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 5 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 6 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 7 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 8 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 9 | scripted | pause | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| training_room | 10 | scripted | step_forward | first-pass body experience in the training height room | scripted movement without transfer chooser | none |
| layered_naive | 1 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 2 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 3 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 4 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 5 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 6 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 7 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 8 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 9 | scripted | pause | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 10 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 11 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_naive | 12 | scripted | step_forward | naive transfer-room movement without compact height lessons | scripted movement without transfer chooser | none |
| layered_transfer | 1 | compact_transfer_2_5d_action_chooser | step_forward | continue with a small forward test | no compact height belief currently asks for ducking, probing, pausing, or recentering | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 2 | compact_transfer_2_5d_action_chooser | recenter_body | reduce pitch/load mismatch before continuing over height change | compact height pressure suggests ramp or slope load shift | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 3 | compact_transfer_2_5d_action_chooser | step_forward | continue with a small forward test | no compact height belief currently asks for ducking, probing, pausing, or recentering | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 4 | compact_transfer_2_5d_action_chooser | probe_forward | test for foot drop before committing body weight | prior compact map says a forward path may contain a ledge or drop | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 5 | compact_transfer_2_5d_action_chooser | step_forward | commit slowly after the drop was noticed by the foot probe | drop warning was routed through probe before body commitment | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 6 | compact_transfer_2_5d_action_chooser | probe_forward | test vertical clearance before moving upper body forward | prior compact map says overhead clearance may be low | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 7 | compact_transfer_2_5d_action_chooser | step_forward | commit slowly after the drop was noticed by the foot probe | drop warning was routed through probe before body commitment | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 8 | compact_transfer_2_5d_action_chooser | probe_forward | test vertical clearance before moving upper body forward | prior compact map says overhead clearance may be low | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 9 | compact_transfer_2_5d_action_chooser | step_forward | commit slowly after the drop was noticed by the foot probe | drop warning was routed through probe before body commitment | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 10 | compact_transfer_2_5d_action_chooser | probe_forward | test vertical clearance before moving upper body forward | prior compact map says overhead clearance may be low | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 11 | compact_transfer_2_5d_action_chooser | crouch_body | lower body before testing the low-clearance path | compact probe reported overhead clearance pressure | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
| layered_transfer | 12 | compact_transfer_2_5d_action_chooser | step_forward | move while crouched after low-clearance warning | crouch should reduce overhead contact risk | rampRisk, dropRisk, overheadRisk, raisedSurfaceRisk |
