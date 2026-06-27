# Project Progress

## 2026-06-27

- Created seven architecture notes:
  - `01_sensory_streams_system.md`
  - `02_threshold_monitors.md`
  - `03_importance_gate.md`
  - `04_memory_promotion.md`
  - `05_inner_world_model.md`
  - `06_habit_builder.md`
  - `07_efficiency_enhancer_model.md`
- Completed the 30-question design interview for `01_sensory_streams_system.md`.
- Recorded the current `01` target: create 10 Markdown sensory sample sheets in `sensory_stream_samples/`.
- Locked the first sample-sheet shape: 20 ticks per sheet, five values per tick: `brightness`, `volume`, `touch`, `taste`, and `smell`.
- Clarified the `01` boundary: the sensory stream system only emits/clamps temporary input and exposes the current rolling buffer; threshold, importance, and memory decisions belong to later layers.
- Completed the 30-question design interview for `02_threshold_monitors.md`.
- Recorded the current `02` boundary: threshold monitors are deterministic trigger recorders, similar to spreadsheet formulas. They record threshold hits only; they do not decide importance, gate opening, memory storage, or emotional meaning.
- Locked the first `02` constants: `n` threshold hits when a current sensory value equals `1.0`; `n-1` rate-of-change hits when change is at least `0.5`.
- Clarified `n`: current tick only, no previous-tick comparison.
- Clarified `n-1`: detects rate of change in two ways, within the same sensor and between different sensors.
- Clarified initial `n-2`: measures acceleration of change by reading the populated `n-1` rate-of-change trigger sheet.
- Recorded the current `02` target: after the 10 sensory sample sheets exist, create one Markdown threshold trigger sheet per sensory sample sheet in `threshold_trigger_sheets/`.
- Started `03_importance_gate.md` planning, then paused before recording answers because the importance gate needs real `01` and `02` output examples first.
- Created 10 sensory sample sheets in `sensory_stream_samples/`.
- Each sensory sample sheet contains 20 ticks and five normalized values per tick: `brightness`, `volume`, `touch`, `taste`, and `smell`.
- Created 10 matching threshold trigger sheets in `threshold_trigger_sheets/`.
- The trigger sheets apply the locked `02` rules: `n` records `threshold_hit` when a value equals `1.0`; `n-1` records within-sensor and between-sensor rate-of-change hits when one-tick absolute change is at least `0.5`.
- Early result from the concrete sheets: quiet and soft samples produce no trigger rows, isolated spike samples produce a small number of clear rows, and noisy samples produce many rows. This gives `03_importance_gate.md` better evidence for deciding what to ignore, watch, promote, record, or escalate.
- Clarified that the first test does not need to be a live stream. It can be a connected workbook with separate sheets for sensory input, `n`, `n^-1`, `n^-2`, and a review/gate sandbox.
- Created `outputs/connected_spreadsheet_test/connected_sensory_threshold_gate_test.xlsx` as the first connected spreadsheet prototype.
- Reworked the connected workbook to be compact and numeric-first: the first tab is `00 Compact View`, sensory values stay `0.0` to `1.0`, and threshold outputs use `0` or `1` instead of word labels.
- Recorded an initial memory-storage idea in `04_memory_promotion.md`: the colored brain areas can map to five sensory storage pools, starting at 20 GB each for a 100 GB total, with later reallocation by the mind model based on use, need, and survival relevance.
- Recorded an initial inner-world storage idea in `05_inner_world_model.md`: the mind gets its own separate 100 GB storage budget for building an internal world model, with an initial 80% inner-world / 20% outside-world attention split.
- Populated `03_importance_gate.md` with a first-pass gate design: emergency/reflex route, attention/brain route, three adjustable duration knobs, resource pressure rules, and gate outputs.
- Expanded `04_memory_promotion.md` with promotion inputs, memory forms, storage-pressure behavior, and sensory-pool reallocation signals.
- Expanded `05_inner_world_model.md` with the mind's world-building role, possible visual/video-game-like imagination representation, decision-tuning pressures, resource body state, and relationship to the importance gate.
- Populated `06_habit_builder.md` with a first-pass habit shape, habit promotion rules, context requirements, and relationship to the efficiency enhancer.
- Populated `07_efficiency_enhancer_model.md` with mature-habit compression targets, resource-pressure behavior, and a safety rule for reopening failed shortcuts.
- Next work: review the filled architecture notes for consistency, then decide whether to refine the spreadsheet prototype or start the `03` decision-table workbook.
