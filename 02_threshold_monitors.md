# Threshold Monitors

The `n`, `n-1`, and `n-2` monitor layers detect local thresholds, cross-sense change, and second-order salience.

## 30-Question Design Interview

This section records design choices for the threshold monitor layer.

### Q1. What should the threshold monitor layer be responsible for first?

Answer: Detect when sensory values cross simple fixed thresholds.

The first threshold monitor layer watches the temporary sensory stream values and detects simple boundary crossings. It does not decide memory importance, build emotional meaning, or compress long-term history.

### Q2. Which sensory values should the first threshold monitors watch?

Answer: The five values from `01`: `brightness`, `volume`, `touch`, `taste`, and `smell`.

The first threshold monitors watch the same five normalized sensory values produced by the sensory stream system. They do not introduce memory signals, emotion signals, or a richer replacement feature set in v1.

### Q3. What kind of threshold should v1 detect first?

Answer: High-value thresholds, where a sense rises above a set level.

The first version detects when a sensory value becomes high enough to cross a configured boundary. Low-value thresholds and learned thresholds can be added later, after simple high-value detection is clear.

### Q4. Should each sense use the same high threshold at first, or have its own threshold?

Answer: One shared threshold for all five senses.

The first shared high threshold is `1.0`. In v1, any of the five sensory values can trigger the same monitor when it reaches maximum strength. Sense-specific thresholds can wait until the simple shared rule is understood.

### Q5. Should reaching exactly `1.0` count as crossing the threshold?

Answer: Yes, `1.0` counts as a threshold hit.

Because sensory stream values are clamped to the `0.0` to `1.0` range, the first high-threshold rule treats `1.0` as a hit. The monitor does not require an impossible value above `1.0`.

### Q6. When a sensory value hits `1.0`, what should the threshold monitor output?

Answer: A simple threshold event with tick, sense name, value, and threshold.

The threshold monitor emits a plain event record such as tick, sense name, observed value, and threshold value. It does not turn the event into a memory candidate, explain why it matters, or rewrite the source sensory sheet.

### Q7. If multiple senses hit `1.0` on the same tick, how should v1 report that?

Answer: Emit one separate threshold event per sense.

When more than one sensory value hits `1.0` on the same tick, the monitor reports each hit as its own event. It does not merge, rank, or discard same-tick hits.

### Q8. Should the threshold monitor remember whether the same sense was already at `1.0` on the previous tick?

Answer: No.

The `n` threshold monitor watches only the current tick. It does not compare against the previous tick or distinguish new hits from continuing hits.

### Q9. How should v1 label threshold events?

Answer: `threshold_hit`.

The v1 threshold monitor uses one plain event label. If a sensory value reaches `1.0`, the monitor records a `threshold_hit`. It does not label the event as new, continuing, important, a memory candidate, or discard.

### Q10. Given that simplification, should the monitor still compare against the previous tick at all?

Answer: No, v1 should only check whether the current value equals `1.0`.

This is `n` threshold monitoring: it checks the current tick only. Previous-tick comparison belongs outside the instant `n` monitor.

### Q11. What should the `n-1` monitor layer do later, if `n` only checks the current tick?

Answer: Detect rate of change in two ways: within the same sensor and between different sensors.

The `n-1` layer does not replace the `n` monitor. It watches change over time, with two separate detections: rate of change inside a single sensory stream, and rate of change across different sensory streams. It still does not make memory-storage decisions or decide emotional meaning.

### Q12. For within-sensor rate of change, what should count as a hit first?

Answer: A value changes by at least `0.5` from the previous tick.

The first within-sensor `n-1` rule compares a sensor's current value to that same sensor's previous value. If the absolute change is `0.5` or greater in one tick, the monitor records a rate-of-change hit.

### Q13. Should within-sensor rate-of-change hits care whether the value went up or down?

Answer: No, any absolute change of `0.5` or more counts, up or down.

The first within-sensor rate-of-change detector uses absolute change. A sudden rise and a sudden fall are both hits when the difference from the previous tick is `0.5` or greater.

### Q14. What should the within-sensor rate-of-change event include?

Answer: Tick, sense name, rate of change, and threshold `0.5`.

The within-sensor rate-of-change event stays compact. It records the tick, the sense name, the detected rate of change, and the `0.5` threshold used for the hit.

### Q15. For between-sensor rate of change, what should the monitor compare first?

Answer: The size of each sensor's one-tick change against the other sensors' one-tick changes.

The between-sensor `n-1` detector compares rate of change across sensors. It looks at how much each sensory stream changed over one tick, then compares those change amounts against the other streams' change amounts.

### Q16. What should count as a between-sensor rate-of-change hit first?

Answer: Two or more sensors each change by at least `0.5` on the same tick.

The first between-sensor `n-1` rule detects same-tick multi-sensor change. If at least two sensory streams each have an absolute one-tick change of `0.5` or greater, the monitor records a between-sensor rate-of-change hit.

### Q17. What should the between-sensor rate-of-change event include?

Answer: Tick, involved sense names, the rate of change between them, and threshold.

The between-sensor rate-of-change event records the tick, the senses involved, the detected rate of change between those senses, and the threshold used to identify the hit.

### Q18. Should `n` threshold hits and `n-1` rate-of-change hits be reported in the same event list?

Answer: Yes, one ordered event list per tick.

For now, the threshold monitor behaves like a threshold trigger recorder. It can report `n` threshold hits and `n-1` rate-of-change hits in one ordered per-tick event list. This output shape may change later after the `n-2` layer is defined and its measurement target is clearer.

### Q19. What should `n-2` try to measure first?

Answer: Acceleration of change: whether rate of change itself is changing.

The `n-2` layer measures second-order movement in the sensory streams. It asks whether the rate of change is itself changing, rather than deciding importance or memory storage.

### Q20. Should `n-2` acceleration detection apply first to within-sensor change, between-sensor change, or both?

Answer: It looks at the populated `n-1` rate-of-change trigger sheet, which contains both within-sensor and between-sensor rate-of-change triggers.

The `n-2` layer does not go back to the raw sensory stream first. It reads the `n-1` trigger sheet after that sheet has been populated with both kinds of rate-of-change detections, then measures acceleration of change from those recorded `n-1` triggers.

### Q21. What should the `n-1` rate-of-change trigger sheet look like?

Answer: Already covered by the ordered trigger recorder design.

The project already established that threshold monitor output is essentially a trigger recorder. The `n-1` rate-of-change trigger sheet is populated with both within-sensor and between-sensor rate-of-change triggers, and `n-2` reads that populated trigger sheet.

### Q22. Should the threshold monitor create separate output files/sheets for each input sample sheet?

Answer: Yes, one threshold trigger sheet per sensory sample sheet.

Each sensory sample sheet gets its own corresponding threshold trigger sheet. This keeps the path from temporary sensory input to threshold-trigger output easy to inspect and compare.

### Q23. Where should the threshold trigger sheets live?

Answer: A dedicated folder beside `02`, such as `threshold_trigger_sheets/`.

Threshold trigger sheets should live in their own folder instead of inside the sensory input folder or inside the architecture note. This keeps raw sensory samples separate from monitor output.

### Q24. What file format should each threshold trigger sheet use first?

Answer: Markdown table.

Each threshold trigger sheet should use a Markdown table. This matches the sensory sample format and keeps the trigger output easy to inspect by hand.

### Q25. What columns should the first threshold trigger Markdown table include?

Answer: Already covered for the trigger event contents.

The table columns should preserve the event contents already chosen: tick, layer, event type, involved sense name or names, the detected value or rate of change, and the threshold used. For `n-1`, this matches the earlier choices for within-sensor and between-sensor rate-of-change events.

### Q26. Should the threshold monitor output include rows for ticks where nothing triggered?

Answer: No, only write rows when a threshold trigger happens.

Threshold trigger sheets are event logs, not full copies of the sensory input sheets. If nothing triggers on a tick, that tick does not need a row in the threshold output.

### Q27. Should the threshold monitor decide whether a trigger opens the later importance gate?

Answer: No, it only records triggers; the importance gate decides what to do with them.

The threshold monitor is basically a deterministic trigger sheet, like an Excel sheet with formulas. It records when formulas detect threshold hits. The model or later gate decides what to report upward and what to do with those triggers, and that later decision can also be deterministic if designed that way.

### Q28. Should the threshold monitor formulas be hand-set constants first, or learned/adaptive?

Answer: Hand-set constants first: `1.0` for `n`, `0.5` for `n-1`.

The first threshold monitor uses fixed constants so the output is stable and easy to inspect. Adaptive or learned thresholds can come later after the deterministic baseline is understood.

### Q29. What should count as success for `02_threshold_monitors.md`?

Answer: A clear deterministic trigger-recorder design for `n`, `n-1`, and initial `n-2`.

This file succeeds when it defines the first deterministic trigger-recorder behavior for instant threshold hits, rate-of-change hits, and initial acceleration-of-change measurement. It does not need to define a full importance system, memory storage rules, or trained adaptive thresholds.

### Q30. After this interview, what should the next concrete deliverable for `02` be?

Answer: Create example threshold trigger sheets from the 10 sensory sample sheets once those exist.

After the sensory sample sheets exist, the next concrete `02` deliverable is to create matching example threshold trigger sheets. These should show the deterministic trigger-recorder formulas applied to the sample inputs before moving on to adaptive thresholds or later architecture layers.

## Connected Spreadsheet Test

For the first practical test, the threshold monitor can be represented as connected workbook sheets instead of a separate live process.

The threshold workbook should keep the monitor layers visible as separate sheets:

- `n`: reference the sensory input sheet and record a threshold hit when a current sensory value equals `1.0`.
- `n^-1`: reference the sensory input sheet and record rate-of-change hits when a one-tick absolute change is at least `0.5`.
- `n^-1` between-sensor: mark a same-tick cross-sense hit when two or more senses pass the `0.5` change rule.
- `n^-2`: reference the populated `n^-1` sheet and measure whether the rate-change signal itself is changing.

This keeps `02` deterministic and spreadsheet-like. It still does not decide importance, gate opening, memory storage, or emotional meaning.

The workbook view should stay compact and numeric. Sensory values remain `0.0` to `1.0`; monitor outputs should use `0` or `1` wherever possible instead of long text labels. Short headers such as `b`, `v`, `to`, `ta`, `s`, `x`, `c`, and `a` are preferred for the test workbook because they make the full signal stack visible without long horizontal scrolling.
