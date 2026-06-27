# Mind Model Logs

This folder stores compact logs from Builder / Dreamer and Critic / Reality-Checker for habit detection.

These logs are not raw conversation transcripts. They are structured rows the habit model can inspect for repeated loops.

Suggested row shape:

| field | meaning |
| --- | --- |
| tick_or_time | When this decision happened. |
| mode | Current global mode. |
| builder_output | Builder / Dreamer proposal or action. |
| critic_output | Critic / Reality-Checker check, approval, denial, or correction. |
| selected_action | What the system actually did. |
| result | What happened afterward. |
| reward_signal | Useful result, if any. |
| cost_note | Attention, memory, compute, heat, storage, or time cost. |

No mind-model logs yet.
