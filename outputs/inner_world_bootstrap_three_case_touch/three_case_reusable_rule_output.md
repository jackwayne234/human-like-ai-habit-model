# Three-Case Reusable Rule Output

Only the danger cases should become reusable danger rules. Harmless pressure should remain a map/contact-anchor update.

| rule id | source case | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
| rule_touch_hot_surface_contact_v2 | real_hot_stove | candidate_reusable_rule | kitchen/stove-like mapped areas | touch n=1 AND signed touch n^-1 sudden rise >= +0.7 AND signed withdrawal between -0.5 and -0.85 near stove-like anchor | predict hot-surface contact, mark hot-risk, pull attention outward, avoid raw detail unless context conflicts |
| rule_touch_sharp_object_contact_v1 | sharp_object_contact | candidate_reusable_rule | utensil/drawer/sharp-object mapped areas | touch n=1 AND signed touch n^-1 sudden rise >= +0.75 AND signed fall <= -0.85 near sharp-object anchor | predict sharp-object contact, mark cut/puncture risk, pull attention outward, request raw/detail only if object identity is uncertain |
