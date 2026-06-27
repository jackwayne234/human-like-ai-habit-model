# Hot Stove Map Update Log

Purpose: show deterministic cron-like handlers turning compact n-log patterns into inner-world map questions, updates, and labeled examples.

| second | handler | trigger pattern | map target | output | detail |
| --- | --- | --- | --- | --- | --- |
| 8 | touch_n_1_surface_question | touch n=1 in one mapped area | home_kitchen/stove_counter_edge | ask_surface_identity | What surface is here, and should this contact point be marked risky? |
| 8 | touch_rate_shape_risk_update | touch n=1 plus fast touch rise and withdrawal | home_kitchen/stove_counter_edge | map_risk_hypothesis | Mark this area as possible hot surface; lower raw-detail need because compact shape is already specific. |
| 12 | teacher_correction_label_handler | teacher label: touched_hot_stove | home_kitchen/stove_counter_edge | confirmed_map_update | Attach label touched_hot_stove to this surface contact pattern and raise trusted-teacher confidence. |
| 12 | correction_example_builder | prediction plus teacher correction | inner_world/labeled_examples/touch_danger | labeled_training_example | Store compact pattern, scene prior, prediction, teacher label, and correction note for future interpretation. |
