# Three-Case Delayed Consolidation Log

Purpose: run the one-minute consolidation handler for each corrected touch case.

| case | due second | handler | question | evidence | decision | reusable rule | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| real_hot_stove | 72 | one_minute_notable_event_consolidation | Should this corrected event become a reusable general rule? | hot_surface_contact_shape, map area stove_counter_edge, trusted teacher label touched_hot_stove | yes | rule_touch_hot_surface_contact_v2 | Compact shape, mapped context, and teacher correction agree on a reusable danger pattern. |
| harmless_counter_pressure | 84 | one_minute_notable_event_consolidation | Should this corrected event become a reusable general rule? | gradual_pressure_contact_shape, map area cool_counter_edge, trusted teacher label harmless_counter_pressure | no | none | This should update the map as a contact anchor, but it should not become a danger rule from one harmless pressure example. |
| sharp_object_contact | 98 | one_minute_notable_event_consolidation | Should this corrected event become a reusable general rule? | sharp_brief_contact_shape, map area utensil_drawer_edge, trusted teacher label touched_sharp_object | yes | rule_touch_sharp_object_contact_v1 | Compact shape, mapped context, and teacher correction agree on a reusable danger pattern. |
