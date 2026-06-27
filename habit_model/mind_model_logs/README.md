# Mind Model Logs

This folder stores compact decision logs from the first single executive mind model.

These logs are not raw conversation transcripts and they are not full surveillance of everything the mind is thinking. They are small structured rows written only when the executive makes an inspectable control decision.

The always-on monitoring system watches compact threshold output, gate routes, resource meters, and sensor recording state. The decision log is different: it records the executive's chosen interpretation and action at meaningful moments. Monitoring answers "what was happening?" The decision log answers "what did the executive decide to do about it, and why?"

## Why Keep A Decision Log?

The log is useful because the habit model cannot learn good trigger-sequence-reward loops from raw monitoring alone.

Raw monitoring may show:

```text
volume n^-2 fired, storage healthy, preset curious
```

The compact decision log can show:

```text
executive watched volume instead of promoting because the signal was isolated,
resources were healthy, and more evidence was cheaper than creating an episode
```

That is the useful layer for later habit extraction. It links trigger, context, chosen sequence, result, reward, and cost without saving every internal thought.

## Single Executive Row Shape

Suggested row shape:

| field | meaning |
| --- | --- |
| tick_or_time | When this decision happened. |
| mode | Current global preset, such as calm, curious, focused, strained, danger, or recovery. |
| trigger_input | Compact threshold/gate input that reached the executive, if any. |
| resource_state | Storage, RAM/working memory, heat/compute, and power pressure in compact form. |
| executive_interpretation | What the single executive thinks the event probably means. |
| selected_action | What the system actually did. |
| recording_buttons | Any raw sensor recording buttons pressed or left alone. |
| memory_choice | Ignore, watch, promote metadata, request snippet, create episode, update belief, or ask for evidence. |
| reason | Short explanation for the action. |
| result | What happened afterward. |
| reward_signal | Useful result, if any. |
| cost_note | Attention, memory, compute, heat, storage, or time cost. |

Example row:

| field | example |
| --- | --- |
| tick_or_time | `sample_03:t7` |
| mode | `curious` |
| trigger_input | `volume n^-2`, no cross-sense support |
| resource_state | storage healthy, working memory healthy, heat normal |
| executive_interpretation | isolated sound change may be interesting but is not danger yet |
| selected_action | watch and ask for more evidence |
| recording_buttons | none |
| memory_choice | watch, no episode |
| reason | one unsupported acceleration event is enough to watch but not enough to promote |
| result | no repeat within window |
| reward_signal | avoided unnecessary episode |
| cost_note | low attention cost, no raw storage cost |

## Later Builder / Critic Split

After the single executive path works, this folder can add Builder / Dreamer and Critic / Reality-Checker fields.

Later row fields may include:

| field | meaning |
| --- | --- |
| builder_output | Builder / Dreamer proposal or action. |
| critic_output | Critic / Reality-Checker check, approval, denial, or correction. |
| selected_action | What the system actually did after the two roles resolved. |

The later split should preserve the same compact habit-friendly shape. It should not become a full transcript unless a specific debugging episode needs that extra detail.

No mind-model logs yet.
