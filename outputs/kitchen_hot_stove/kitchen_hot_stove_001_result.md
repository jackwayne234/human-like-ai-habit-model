# Kitchen Hot Stove Prediction Scenario Result

Purpose: give the model a kitchen scene prior, ask for five possible events, feed it a compact touch-max event, ask what it thought happened from logs only, then correct it with the true label.

Verdict: PASS

| artifact | path |
| --- | --- |
| hidden world stream | `outputs/kitchen_hot_stove/kitchen_hot_stove_001_stream_log.md` |
| compact trigger log | `outputs/kitchen_hot_stove/kitchen_hot_stove_001_compact_trigger_log.md` |
| prediction log | `outputs/kitchen_hot_stove/kitchen_hot_stove_001_prediction_log.md` |
| correction log | `outputs/kitchen_hot_stove/kitchen_hot_stove_001_correction_log.md` |

## Checks

| check | result |
| --- | --- |
| scene has who/what/when/where | PASS |
| five kitchen predictions were generated | PASS |
| touch reaches n max at tick 8 | PASS |
| compact log is the model-visible perception surface | PASS |
| model gives an uncertain pre-correction explanation | PASS |
| teacher correction labels the event as touched_hot_stove | PASS |
| corrected hot-stove confidence is high | PASS |
