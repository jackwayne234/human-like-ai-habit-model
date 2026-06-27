# Habit Model Workspace

This folder is the v1 workspace for the quiet habit model.

The habit model does not act as a third conversational mind. In the first implementation, it waits for compact logs from one executive mind model. Later, after the architecture splits into Builder / Dreamer and Critic / Reality-Checker roles, it can watch those compact role outputs from underneath.

The habit model looks for repeated useful loops:

```text
trigger -> sequence -> reward
```

The habit model should not write broadly across the system. Its job here is to collect structured evidence, count repeated loops, and eventually propose candidate learned controls through `../learned_operation_controls.md`.

## Monitoring Versus Decision Logs

The system can have continuous monitoring without saving every executive thought.

Continuous monitoring reads compact physical and sensory state:

- threshold outputs such as `n`, `n^-1`, and `n^-2`
- importance gate route and preset state
- raw sensor recording button state
- storage, working memory, heat/compute, and power pressure
- promotion, episode, and evidence-request outcomes

Decision logs are smaller and more selective. They are written when the executive makes a meaningful choice, such as watch, promote, create an episode, ask for more evidence, change preset, or press a raw sensor recording button.

This keeps the first system inspectable without turning it into a full transcript recorder. Monitoring supplies the facts. Decision logs supply the executive's chosen reason and action.

## Folders

| folder | purpose |
| --- | --- |
| `mind_model_logs/` | Compact single-executive decision logs first; later Builder / Dreamer and Critic / Reality-Checker logs. |
| `trigger_sequence_reward_logs/` | Habit-model extraction rows showing possible trigger, sequence, and reward loops. |
| `candidate_habits/` | Candidate habits that have repeated enough to deserve review. |

## V1 Flow

1. Continuous monitors track compact thresholds, gate state, resources, and button state.
2. The single executive mind writes compact decision logs only for meaningful choices.
3. The habit model reads those logs.
4. It extracts possible `trigger -> sequence -> reward` rows.
5. Repeated successful rows can become candidate habits.
6. Mature candidates can be proposed as learned operation controls in `../learned_operation_controls.md`.

No candidate habits have been promoted yet.
