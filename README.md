# Human-Like AI Habit Model

This repository contains a first-pass architecture skeleton for a human-like AI habit and attention system.

The core idea is that raw sensory input should not become memory directly. Sensory values are first compressed through threshold monitors, then passed through an importance gate, memory promotion, an inner world model, habit formation, and efficiency compression.

## Current Structure

| file | purpose |
| --- | --- |
| `01_sensory_streams_system.md` | Defines the first sensory input layer and synthetic sample shape. |
| `02_threshold_monitors.md` | Defines `n`, `n^-1`, and `n^-2` threshold monitors. |
| `03_importance_gate.md` | Defines emergency and attention gates with adjustable duration knobs. |
| `04_memory_promotion.md` | Defines promoted memory forms and sensory storage pools. |
| `05_inner_world_model.md` | Defines the mind's internal world model and separate mind storage. |
| `06_habit_builder.md` | Defines how repeated successful pathways become habits. |
| `07_efficiency_enhancer_model.md` | Defines how mature habits become cheaper routines or shortcuts. |
| `PROJECT_PROGRESS.md` | Current checkpoint and implementation notes. |

## Prototype Artifacts

- `sensory_stream_samples/`: 10 deterministic sensory sample sheets.
- `threshold_trigger_sheets/`: matching trigger sheets generated from the sensory samples.
- `outputs/connected_spreadsheet_test/connected_sensory_threshold_gate_test.xlsx`: compact workbook prototype for sensory input and threshold layers.
- `spreadsheet_build/build_connected_threshold_workbook.mjs`: workbook builder script.

## Current Hypothesis

The skeleton starts with:

- five sensory streams: brightness, volume, touch, taste, smell
- three threshold monitor layers: `n`, `n^-1`, `n^-2`
- an importance gate with adjustable knobs
- 100 GB sensory storage split across five sensory pools
- 100 GB separate mind storage for inner-world modeling
- an initial 80% inner-world / 20% outside-world attention split
- a control-surface principle: thresholds, windows, route weights, attention split, and storage pressure should be exposed as mind-selectable knobs instead of hidden deterministic decisions

All numbers are starting parameters, not permanent rules.
