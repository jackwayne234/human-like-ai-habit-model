# Three-Case Map Update Log

Purpose: test whether deterministic inner-world bootstrap handlers avoid turning every touch n=1 event into the same hot-stove rule.

| case | second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- | --- |
| real_hot_stove | 8 | touch_n_1_surface_question | touch n=1 in one mapped area | home_kitchen/stove_counter_edge | ask_surface_identity | What surface is here, and should this contact point be marked risky? |
| real_hot_stove | 8 | touch_shape_classifier | hot_surface_contact_shape | home_kitchen/stove_counter_edge | possible_hot_surface_contact | Mark possible hot_surface_risk while waiting for correction or repeated evidence. |
| real_hot_stove | 12 | teacher_correction_label_handler | teacher label: touched_hot_stove | home_kitchen/stove_counter_edge | confirmed_map_update | Attach teacher label touched_hot_stove to this compact touch shape and mapped area. |
| real_hot_stove | 12 | correction_example_builder | prediction plus teacher correction | inner_world/labeled_examples/touch_contact | labeled_training_example | Store hot_surface_contact_shape, scene prior, prediction possible_hot_surface_contact, teacher label, and correction note. |
| harmless_counter_pressure | 20 | touch_n_1_surface_question | touch n=1 in one mapped area | home_kitchen/cool_counter_edge | ask_surface_identity | What surface is here, and should this contact point be marked risky? |
| harmless_counter_pressure | 20 | touch_shape_classifier | gradual_pressure_contact_shape | home_kitchen/cool_counter_edge | contact_anchor_or_pressure | Treat as a contact anchor unless later evidence says it is dangerous. |
| harmless_counter_pressure | 24 | teacher_correction_label_handler | teacher label: harmless_counter_pressure | home_kitchen/cool_counter_edge | confirmed_map_update | Attach teacher label harmless_counter_pressure to this compact touch shape and mapped area. |
| harmless_counter_pressure | 24 | correction_example_builder | prediction plus teacher correction | inner_world/labeled_examples/touch_contact | labeled_training_example | Store gradual_pressure_contact_shape, scene prior, prediction unlabeled_touch_max, teacher label, and correction note. |
| sharp_object_contact | 34 | touch_n_1_surface_question | touch n=1 in one mapped area | home_kitchen/utensil_drawer_edge | ask_surface_identity | What surface is here, and should this contact point be marked risky? |
| sharp_object_contact | 34 | touch_shape_classifier | sharp_brief_contact_shape | home_kitchen/utensil_drawer_edge | possible_sharp_object_contact | Mark possible sharp_object_risk while waiting for correction or repeated evidence. |
| sharp_object_contact | 38 | teacher_correction_label_handler | teacher label: touched_sharp_object | home_kitchen/utensil_drawer_edge | confirmed_map_update | Attach teacher label touched_sharp_object to this compact touch shape and mapped area. |
| sharp_object_contact | 38 | correction_example_builder | prediction plus teacher correction | inner_world/labeled_examples/touch_contact | labeled_training_example | Store sharp_brief_contact_shape, scene prior, prediction possible_sharp_contact, teacher label, and correction note. |
