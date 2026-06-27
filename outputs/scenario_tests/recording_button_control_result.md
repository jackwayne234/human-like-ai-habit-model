# Recording Button Control Test

Purpose: verify that raw sensor recording buttons only toggle full raw recording, while compact threshold monitoring keeps running.

Control surface under test:

| button | behavior |
| --- | --- |
| `record_brightness` | Toggle brightness raw recording. |
| `record_volume` | Toggle volume raw recording. |
| `record_touch` | Toggle touch raw recording. |
| `record_taste` | Toggle taste raw recording. |
| `record_smell` | Toggle smell raw recording. |

Expected behavior:

- Pressing `record_volume` at tick 3 turns volume raw recording on.
- Pressing `record_volume` again at tick 5 turns volume raw recording off.
- `n^-2` still fires from compact threshold changes whether volume raw recording is on or off.

Verdict: PASS

| tick | volume | button pressed | volume recording | d_volume | n^-2 |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.30 | - | 0 | 0 | 0 |
| 2 | 0.30 | - | 0 | 0 | 0 |
| 3 | 0.95 | record_volume | 1 | 1 | 1 |
| 4 | 0.35 | - | 1 | 1 | 0 |
| 5 | 0.35 | record_volume | 0 | 0 | 1 |
| 6 | 0.35 | - | 0 | 0 | 0 |
| 7 | 0.92 | - | 0 | 1 | 1 |
| 8 | 0.34 | - | 0 | 1 | 0 |

## Checks

| check | result |
| --- | --- |
| volume toggled on at tick 3 | PASS |
| volume toggled off at tick 5 | PASS |
| `n^-2` fired while raw recording was on | PASS |
| `n^-2` fired while raw recording was off | PASS |
