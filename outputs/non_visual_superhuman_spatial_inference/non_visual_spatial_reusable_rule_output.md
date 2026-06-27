# Non-Visual Spatial Reusable Rule Output

The rule is approved from confirmed obstacle cases only. Open-space echo and moving sound-source cases remain narrower map updates.

| rule id | source cases | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
| rule_non_visual_obstacle_distance_v1 | approaching_obstacle_confirmed, close_low_contrast_obstacle | candidate_reusable_rule | navigation areas where vision is weak or unavailable | ultrasonic_echo n^-1 rise AND reflection_volume n^-1 rise AND movement/body-location risk supports closing distance | infer likely obstacle presence or decreasing distance, slow movement, update map anchor, and open raw vision only if compact evidence conflicts or stakes are high |
