# Hot Stove Reusable Rule Output

| field | value |
| --- | --- |
| rule id | rule_touch_hot_stove_contact_v1 |
| status | candidate_reusable_rule |
| scope | kitchen/stove-like mapped areas |
| compact input pattern | touch n=1 AND touch n^-1 sudden rise >= 0.7 AND touch n^-1 withdrawal >= 0.5 near stove/counter map anchor |
| teacher label | touched_hot_stove |
| future output | predict touched_hot_stove, mark surface as hot-risk, pull attention outward, and avoid opening raw detail unless the compact pattern conflicts with map context or teacher correction |
| raw inspection policy | not normally required after this correction because the compact rate-shape plus place context identifies the event |
