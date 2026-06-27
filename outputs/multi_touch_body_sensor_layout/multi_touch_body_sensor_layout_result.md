# Multi-Touch Body Sensor Layout Result

Purpose: test a more realistic robot touch input organization while keeping the shared compact n-log event language.

Verdict: PASS

| artifact | path |
| --- | --- |
| stream log | `outputs/multi_touch_body_sensor_layout/multi_touch_body_stream_log.md` |
| compact log | `outputs/multi_touch_body_sensor_layout/multi_touch_body_compact_log.md` |
| interpretation | `outputs/multi_touch_body_sensor_layout/multi_touch_body_interpretation.md` |

## Checks

| check | result |
| --- | --- |
| ten touch location streams are defined | PASS |
| single coarse streams remain for brightness, volume, taste, and smell | PASS |
| compact log preserves touch body location names | PASS |
| foot contact is distinguishable from fingertip contact | PASS |
| torso contact becomes a different map question | PASS |
| two-palm grip creates a between-touch-location event | PASS |
