# Habit Model Workspace

This folder is the v1 workspace for the quiet habit model.

The habit model does not act as a third conversational mind. It watches the Builder / Dreamer and Critic / Reality-Checker outputs from underneath, looking for repeated useful loops:

```text
trigger -> sequence -> reward
```

The habit model should not write broadly across the system. Its job here is to collect structured evidence, count repeated loops, and eventually propose candidate learned controls through `../learned_operation_controls.md`.

## Folders

| folder | purpose |
| --- | --- |
| `mind_model_logs/` | Compact logs of Builder / Dreamer and Critic / Reality-Checker decisions. |
| `trigger_sequence_reward_logs/` | Habit-model extraction rows showing possible trigger, sequence, and reward loops. |
| `candidate_habits/` | Candidate habits that have repeated enough to deserve review. |

## V1 Flow

1. Builder / Dreamer and Critic / Reality-Checker produce compact decision logs.
2. The habit model reads those logs.
3. It extracts possible `trigger -> sequence -> reward` rows.
4. Repeated successful rows can become candidate habits.
5. Mature candidates can be proposed as learned operation controls in `../learned_operation_controls.md`.

No candidate habits have been promoted yet.
