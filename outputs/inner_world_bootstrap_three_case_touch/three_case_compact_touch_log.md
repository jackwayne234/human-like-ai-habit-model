# Three-Case Compact Touch Log

Purpose: feed compact touch perception into inner-world bootstrap handlers without using raw sensory stream rows.

The `signed touch change` column is a compact shape feature, not a raw stream replay. It lets the handler distinguish rise from withdrawal.

| case | second | local event | place | area | layer | event type | involved senses | detected value or rate | signed touch change | threshold |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| real_hot_stove | 8 | 1 | home_kitchen | stove_counter_edge | n | threshold_hit | touch | 1.00 | 0.00 | 1.0 |
| real_hot_stove | 8 | 2 | home_kitchen | stove_counter_edge | n^-1 | rate_of_change_within_sensor | touch | 0.81 | 0.81 | 0.5 |
| real_hot_stove | 8 | 3 | home_kitchen | stove_counter_edge | n^-2 | rate_of_rate_change | n^-1 trigger stream | 0.17 | 0.00 | > 0 shift |
| real_hot_stove | 9 | 4 | home_kitchen | stove_counter_edge | n^-1 | rate_of_change_within_sensor | touch | 0.76 | -0.76 | 0.5 |
| real_hot_stove | 10 | 5 | home_kitchen | stove_counter_edge | n^-2 | rate_of_rate_change | n^-1 trigger stream | 0.17 | 0.00 | > 0 shift |
| harmless_counter_pressure | 20 | 1 | home_kitchen | cool_counter_edge | n^-2 | gradual_touch_buildup_summary | touch | 0.18 | 0.18 | compact shape summary |
| harmless_counter_pressure | 25 | 2 | home_kitchen | cool_counter_edge | n | threshold_hit | touch | 1.00 | 0.00 | 1.0 |
| sharp_object_contact | 34 | 1 | home_kitchen | utensil_drawer_edge | n | threshold_hit | touch | 1.00 | 0.00 | 1.0 |
| sharp_object_contact | 34 | 2 | home_kitchen | utensil_drawer_edge | n^-1 | rate_of_change_within_sensor | touch | 0.84 | 0.84 | 0.5 |
| sharp_object_contact | 34 | 3 | home_kitchen | utensil_drawer_edge | n^-2 | rate_of_rate_change | n^-1 trigger stream | 0.21 | 0.00 | > 0 shift |
| sharp_object_contact | 35 | 4 | home_kitchen | utensil_drawer_edge | n^-1 | rate_of_change_within_sensor | touch | 0.91 | -0.91 | 0.5 |
| sharp_object_contact | 36 | 5 | home_kitchen | utensil_drawer_edge | n^-2 | rate_of_rate_change | n^-1 trigger stream | 0.22 | 0.00 | > 0 shift |
