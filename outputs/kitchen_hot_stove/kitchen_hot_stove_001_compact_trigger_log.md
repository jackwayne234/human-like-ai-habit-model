# Kitchen Hot Stove Compact Trigger Log

Scenario: kitchen_hot_stove_001

This is the model-visible perception surface for the scenario.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
| 8 | n | threshold_hit | touch | 1.00 | 1.0 |
| 8 | n-1 | rate_of_change_within_sensor | touch | 0.79 | 0.5 |
| 8 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
| 9 | n-1 | rate_of_change_within_sensor | touch | 0.76 | 0.5 |
| 10 | n-2 | rate_of_rate_change | n-1 trigger stream | 0.17 | > 0 shift |
