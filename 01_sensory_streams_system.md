# Sensory Streams System

Raw sight, hearing, taste, touch, and smell flow into the model as continuous streams, not memory.

## 30-Question Design Interview

This section records design choices for the sensory streams system.

### Q1. What should the first sensory-stream prototype prove?

Answer: Synthetic flow first.

Use fake sight/hearing/taste/touch/smell streams so the architecture can be tested before real sensors.

### Q2. What should count as a sensory stream in the first prototype?

Answer: Five classic senses only.

The first prototype uses sight, hearing, taste, touch, and smell only, matching the original colored-stream sketch. Body state and action state are later expansion streams, not part of the v1 sensory-stream core.

### Q3. How should each sensory stream be represented in v1?

Answer: One simple value per stream.

The first prototype represents the five senses as brightness, volume, touch, taste, and smell. This keeps the stream layer simple enough to simulate before adding richer feature vectors. Temperature can become a touch subfeature later instead of replacing the touch stream.

### Q4. What numeric range should each stream use?

Answer: `0.0` to `1.0` normalized values.

Every stream uses the same simple range, where `0.0` means absent/low and `1.0` means maximum/high. This keeps the first threshold calculations comparable across senses.

### Q5. How often should the synthetic sensory streams update in the first prototype?

Answer: Fixed ticks.

All five streams update together once per simulation tick. This gives the prototype simple before/after comparisons for threshold and delta monitoring.

### Q6. What should one tick produce?

Answer: One bundled sample for all senses.

Each tick returns one object containing brightness, volume, touch, taste, and smell together. All five values share the same timestamp.

### Q7. What should the bundled tick sample look like?

Answer: Flat object.

Example: `{ "tick": 12, "brightness": 0.4, "volume": 0.2, "touch": 0.0, "taste": 0.1, "smell": 0.3 }`. This keeps logs readable by eye.

### Q8. Should the sensory stream layer store history?

Answer: Short rolling buffer only.

The sensory stream layer keeps a small recent window for deltas and thresholds, but does not treat that buffer as memory. The buffer exists for calculation, not remembrance.

### Q9. How large should the first rolling buffer be?

Answer: 10 ticks.

The first rolling buffer keeps the most recent 10 ticks. This is small enough to remain temporary and large enough to calculate recent change.

### Q10. Should the sensory stream system add random noise to the synthetic values?

Answer: Small noise by default.

The synthetic streams eventually include tiny variation so later threshold monitors can learn to ignore normal wiggle instead of treating every small movement as meaningful. Before randomness is added, the first prototype will use hand-created sample data sheets.

### Q11. Should each synthetic scenario be deterministic and replayable?

Answer: Yes, deterministic first.

The first synthetic scenarios should be hand-created with no randomness. Seeded randomness can be added later after the baseline sheets prove the data shape.

### Q12. What should the default boring world baseline look like?

Answer: Medium active world.

All senses sit around a medium active baseline so the later `n-1` and `n-2` layers have ordinary sensory flow to dilute and compress. The first version should use 10 hand-created sample data sheets, not random generation.

### Q13. What should the 10 hand-created sample data sheets represent?

Answer: A controlled noise ramp for testing the filter.

The first sample sheet should be quieter, but not silent. Each later sheet increases sensory activity/noise until the tenth sheet is very noisy. The purpose is to test how much data gets saved as important and whether the sensory-stream plus threshold model is filtering correctly or needs adjustment.

### Q14. How should the 10 sample sheets be stored when created?

Answer: One file per sheet.

Create one separate file for each sample sheet, such as `sample_01_quiet.md` through `sample_10_noisy.md`. This makes each test case easy to inspect and compare.

### Q15. How many ticks should each sample sheet contain?

Answer: 20 ticks.

Each sample sheet should contain 20 ticks. This is long enough to show patterns and changes, but short enough to review by hand.

### Q16. What format should each sample sheet use inside the Markdown file?

Answer: Markdown table.

Each sample sheet uses a Markdown table with columns: `tick`, `brightness`, `volume`, `touch`, `taste`, and `smell`.

### Q17. Should the sensory stream file define what noise means?

Answer: No, it should only monitor the noise.

The sensory stream system should emit the active sensory flow and sample data. It should not decide whether the flow is meaningful, important, bad, or irrelevant. The threshold monitor and later layers determine the rest.

### Q18. What should the sensory stream layer be responsible for?

Answer: Emit values only.

The sensory stream layer produces `tick`, `brightness`, `volume`, `touch`, `taste`, and `smell`, and keeps the short rolling buffer. It does not label events, calculate importance, or decide memory candidates.

### Q19. Should the sensory stream layer calculate basic deltas, or should that start in the threshold monitor file?

Answer: No deltas in the sensory stream layer.

The sensory stream layer does not calculate change. Its only decision-like behavior is keeping values inside the valid range: `0` when something is too quiet/absent and `1` when something is too loud/maximum. All change, threshold, and importance logic belongs to later layers.

### Q20. When a hand-created sample value goes outside the `0.0` to `1.0` range, what should the sensory stream system do?

Answer: Clamp it to the boundary.

Values below `0.0` become `0.0`; values above `1.0` become `1.0`. This keeps the sensory signal valid without interpreting what the value means.

### Q21. Should the sample sheets include notes about the intended noise level?

Answer: Yes, simple label only.

Each sheet gets a simple label such as `quiet`, `mild`, `moderate`, `busy`, or `very noisy`. The label describes the input level without deciding what later layers should treat as important.

### Q22. Should the sensory stream system know the names/colors from the original sketch?

Answer: Yes, keep names and colors as documentation.

Record the sketch mapping as blue = brightness/sight, green = volume/hearing, red = touch, orange = taste, and purple = smell. The colors are documentation and visualization aids, not extra logic.

### Q23. Should the sensory stream layer include source information for each value?

Answer: No source in v1.

Each tick stays limited to the five values. Source metadata can wait until real sensors or multiple data sources exist.

### Q24. Should the sample sheets include a scenario name, or only a noise level?

Answer: Noise level only.

Each sheet should include only a simple noise level label, such as `quiet`, `mild`, `moderate`, `busy`, or `very noisy`. This label is descriptive only and does not determine what later layers should treat as important.

### Q25. Should sample sheets include expected results from the threshold monitor?

Answer: No, keep expected results out of sensory sheets.

The sensory sheets only contain input data. Expected threshold results belong in `02_threshold_monitors.md` or separate test files, not in the sensory-stream sheets.

### Q26. Should the sensory stream file say anything about memory?

Answer: Yes, raw streams are not memory.

The sensory stream values and rolling buffer are temporary input, not stored memory. Later, the threshold manager may decide when to open the gate for the mind to start recording inputs and inspect recent buffer history, but that decision does not belong to the sensory stream system.

### Q27. When the threshold manager later asks for recent input history, what should the sensory stream system provide?

Answer: The current rolling buffer only.

The sensory stream system returns the last 10 ticks exactly as temporary recent input. It does not return the whole sample sheet or a compressed meaning summary.

### Q28. Should the sensory stream system reset its rolling buffer between sample sheets?

Answer: Yes, reset between sheets.

Each sample sheet is an independent test, so the rolling buffer starts fresh for each sheet.

### Q29. What should count as success for `01_sensory_streams_system.md`?

Answer: 10 Markdown sample files with 20x5 sets of data.

The first sensory-stream deliverable is 10 Markdown files. Each file contains 20 ticks, and each tick has five sensory values: brightness, volume, touch, taste, and smell. That is the whole success target for this first area.

### Q30. Where should the 10 sensory sample Markdown files live?

Answer: Dedicated folder beside `01`.

Create a folder like `sensory_stream_samples/` and put the 10 sample files there. This keeps the sensory data sheets grouped without cluttering the main theory files.

## Connected Spreadsheet Test

For the first practical test, the sensory stream does not need to run as a live data stream. The same idea can be represented as rows in a spreadsheet.

The first connected workbook can use a sensory input sheet as the source of truth. Each row is one tick, with `brightness`, `volume`, `touch`, `taste`, and `smell` values clamped between `0.0` and `1.0`. Later sheets can reference these rows with formulas.

This preserves the boundary of `01`: the sensory layer still only provides temporary input values. The spreadsheet format just makes those values easier to inspect and edit by hand.

## Streaming Layer Test

The first stream-style prototype is session-based and deterministic, not a background daemon.

`scenario_tests/run_streaming_layer_test.mjs` generates 20 artificial world ticks and appends them one tick at a time to `outputs/streaming_world/session_001_stream_log.md`.

The same run rewrites `outputs/streaming_world/session_001_rolling_buffer.md` on every tick. That file keeps only the latest 10 ticks. Older rows disappear from the buffer as new ticks arrive.

The same run keeps compact threshold monitoring active for every tick and writes `outputs/streaming_world/session_001_compact_trigger_log.md`. This applies the current constant compact recorder rules:

- `n`: current sensory value equals `1.0`.
- `n^-1`: one-tick absolute change is at least `0.5`.
- `n^-1` between-sensor: two or more senses change by at least `0.5` on the same tick.
- `n^-2`: the compact `n^-1` trigger pattern shifts.

Raw sensor recording remains separate. The stream test presses `record_volume` and `record_touch` during the session. When a recording button turns on, the recorder copies that sensor's current rolling-buffer rows into the sensor's raw file. While the button stays on, the recorder appends new raw rows for that sensor. When the button turns off, it stops appending:

- `sensor_recordings/volume/session_001_raw.md`
- `sensor_recordings/touch/session_001_raw.md`

The generated result report is `outputs/streaming_world/streaming_layer_test_result.md`.

## Constant Stream Experience

`scenario_tests/run_constant_stream_experience.mjs` is the first longer "model experience" run.

It runs 60 deterministic world ticks, turns on all five raw sensor recording buttons at tick 1, keeps rewriting a 10-tick rolling buffer, and applies the compact `n`, `n^-1`, and `n^-2` formulas as the stream grows.

The main outputs are:

- `outputs/model_experience/experience_session_001_stream_log.md`: continuous normalized sensory input.
- `outputs/model_experience/experience_session_001_rolling_buffer.md`: temporary latest-10-tick buffer.
- `outputs/model_experience/experience_session_001_compact_trigger_log.md`: formula outputs.
- `outputs/model_experience/experience_session_001_noticed_log.md`: readable summary of what the formulas made visible.
- `outputs/model_experience/experience_session_001_summary.md`: counts and checks from the run.

Because all five recording buttons are on, the run also writes one raw file per sensor:

- `sensor_recordings/brightness/experience_session_001_raw.md`
- `sensor_recordings/volume/experience_session_001_raw.md`
- `sensor_recordings/touch/experience_session_001_raw.md`
- `sensor_recordings/taste/experience_session_001_raw.md`
- `sensor_recordings/smell/experience_session_001_raw.md`

This is still artificial and deterministic. It is not a real sensor daemon yet. The point is to inspect what the architecture experiences when constant input, temporary buffer rollover, raw recording, and compact trigger formulas are all active together.

## Monocular Sight And Visual Anchors

The v1 sight stream is a single brightness/sight input, so the model is effectively monocular. It should not assume stereo vision or two-eye parallax.

That means depth and location should come from active sensing over time:

- movement parallax from taking sight samples while moving
- optic-flow-like sight rate changes from moving, turning, or approaching objects
- touch anchors such as counter edge, stove surface, wall, or object contact
- volume or echo changes while moving through a space
- smell gradients that get stronger or weaker with movement
- action history such as moved forward, turned left, stopped, touched surface

The system can periodically create visual anchor snapshots when it moves a certain distance, turns, or sees a strong sight `n^-1` / `n^-2` change. It can also create anchors when another sense confirms a place-relevant event, such as touch contact or a smell gradient.

These visual anchors should be selective, not continuous raw visual recording. Normal perception still comes from compact logs, while visual snapshots become occasional breadcrumbs for building a rough world position.
