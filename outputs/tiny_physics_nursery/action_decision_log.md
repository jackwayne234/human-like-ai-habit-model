# Tiny Physics Nursery Action Decision Log

Run 1 is a scripted first-pass body experience. Run 2 is selected by the compact action chooser from prior compact-derived beliefs plus current compact outcomes. This log is robot-facing: it records no hidden coordinates.

| run | tick | source | action | intention | reason | active compact beliefs |
| --- | --- | --- | --- | --- | --- | --- |
| run_1 | 1 | scripted | step_forward | try the first visible-feeling forward path | scripted first-pass body experience | none |
| run_1 | 2 | scripted | turn_right | change front direction after resistance | scripted first-pass body experience | none |
| run_1 | 3 | scripted | step_forward | move along the boundary | scripted first-pass body experience | none |
| run_1 | 4 | scripted | step_forward | keep moving after one easy step | scripted first-pass body experience | none |
| run_1 | 5 | scripted | turn_right | turn away from base resistance | scripted first-pass body experience | none |
| run_1 | 6 | scripted | step_forward | try a new corridor after turning | scripted first-pass body experience | none |
| run_1 | 7 | scripted | step_forward | continue through pressure change | scripted first-pass body experience | none |
| run_1 | 8 | scripted | pause | let body pressure settle | scripted first-pass body experience | none |
| run_1 | 9 | scripted | step_forward | test whether the path is still safe | scripted first-pass body experience | none |
| run_1 | 10 | scripted | step_forward | keep moving despite weak warning | scripted first-pass body experience | none |
| run_1 | 11 | scripted | step_forward | continue until the base gives a clearer warning | scripted first-pass body experience | none |
| run_2 | 1 | compact_action_chooser | probe_forward | check learned front resistance before committing body weight | prior compact map says the first forward path may resist | frontRisk, baseRisk, externalPressure |
| run_2 | 2 | compact_action_chooser | turn_right | avoid repeating a resisted movement | last movement outcome carried compact risk | frontRisk, baseRisk, externalPressure |
| run_2 | 3 | compact_action_chooser | step_forward | test the changed front direction with a small step | turn changed echo/front relation after a risk belief | frontRisk, baseRisk, externalPressure |
| run_2 | 4 | compact_action_chooser | probe_forward | check for low base obstacle before stepping | prior compact map says base contact can appear without torso contact | frontRisk, baseRisk, externalPressure |
| run_2 | 5 | compact_action_chooser | turn_right | turn away after compact probe warning instead of committing body weight | previous probe reported resistance or base warning | frontRisk, baseRisk, externalPressure |
| run_2 | 6 | compact_action_chooser | step_forward | test the changed front direction with a small step | turn changed echo/front relation after a risk belief | frontRisk, baseRisk, externalPressure |
| run_2 | 7 | compact_action_chooser | recenter_body | reduce left/right pressure mismatch before more movement | compact pressure capsules suggest body leaning | frontRisk, baseRisk, externalPressure, leaning |
| run_2 | 8 | compact_action_chooser | step_forward | move cautiously after recentering pressure | body recenter was attempted and the path still needs evidence | frontRisk, baseRisk, externalPressure, leaning |
| run_2 | 9 | compact_action_chooser | pause | separate external airflow pressure from body lean | compact airflow/pressure evidence is active | frontRisk, baseRisk, externalPressure, leaning |
| run_2 | 10 | compact_action_chooser | probe_forward | check for curb or edge warning before a full step | base-risk lesson says probe before committing after pressure/airflow zone | frontRisk, baseRisk, externalPressure, leaning |
| run_2 | 11 | compact_action_chooser | step_forward | commit one small step after a quiet probe | probe did not report front or base risk | frontRisk, baseRisk, externalPressure, leaning |
| run_2 | 12 | compact_action_chooser | probe_forward | check for curb or edge warning before a full step | base-risk lesson says probe before committing after pressure/airflow zone | frontRisk, baseRisk, externalPressure, leaning |
