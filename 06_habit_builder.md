# Habit Builder

The habit builder watches for repeated trigger-sequence-reward pathways that succeed often enough over time to become habits.

## Purpose

The habit builder turns repeated successful pathways into reusable behavior.

It watches what the system notices, what the mind decides, what action happens, and whether the result helped. If a pattern repeats often enough and works often enough, it can become a habit.

The habit builder should not create habits from raw sensory data alone. It should use promoted events, inner-world context, actions, outcomes, and resource cost.

## Inputs

The habit builder can read:

| input | source |
| --- | --- |
| promoted events | Memory promotion |
| episode summaries | Memory promotion |
| current world context | Inner world model |
| actions taken | Action system, when added |
| outcomes / reward | Result tracking, when added |
| resource cost | Resource monitor |

## Habit Shape

A habit can be stored as:

| part | meaning |
| --- | --- |
| cue | What signal or context starts the habit. |
| state | What inner-world state must be true. |
| action | What the system tends to do. |
| expected result | What should happen if the habit works. |
| confidence | How reliable the habit has been. |
| cost | How expensive it is in attention, memory, or compute. |

Example:

| field | example |
| --- | --- |
| cue | touch `n` hits repeatedly |
| state | danger / damage possible |
| action | withdraw or reduce contact |
| expected result | touch signal drops |
| confidence | high after repeated success |
| cost | low |

## Starting Promotion Rule

The first habit rule can be simple:

| condition | result |
| --- | --- |
| same cue-state-action-result pattern succeeds at least 5 times | mark as candidate habit |
| candidate habit succeeds at least 80% of the time over later uses | promote to habit |
| mature habit fails repeatedly | demote or send back to mind model |

These are starting parameters, not final values.

## Relationship To The Inner World

The habit builder should not blindly automate everything.

The inner world model provides context. A habit that works in one situation may be dangerous in another. The habit builder should therefore store the context where a habit works, not only the action.

## Relationship To Efficiency

The habit builder creates reliable repeated pathways.

The efficiency enhancer later compresses mature habits into cheaper routines, shortcuts, tools, or deterministic processes.

## v1 Boundary

The habit builder does not:

- detect sensory thresholds
- decide importance directly
- manage raw memory allocation
- optimize habits into tools by itself

Its job is to notice repeated successful pathways and mark them as reusable.
