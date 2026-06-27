# Trigger Sequence Reward Logs

This folder stores the habit model's extracted loop rows.

The habit model reads compact mind-model logs and looks for:

```text
trigger -> sequence -> reward
```

Suggested row shape:

| field | meaning |
| --- | --- |
| loop_id | Stable identifier for a possible repeated loop. |
| trigger | Signal, context, mode, gate output, or event that starts the loop. |
| sequence | Repeated decision/action path after the trigger. |
| reward | Useful result that closes the loop. |
| context | Conditions where the loop appears to work. |
| repetition_count | How many times the loop has appeared. |
| success_count | How many times the loop produced the expected reward. |
| confidence | Current reliability estimate. |
| status | `observed`, `candidate`, `review`, or `rejected`. |

No trigger-sequence-reward rows yet.
