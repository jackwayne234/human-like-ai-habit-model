# Streaming Layer Test Result

Purpose: prove the model can populate deterministic artificial sensory input over time, keep a capped rolling buffer, keep compact threshold monitors running, and write high-detail raw sensor rows only when a sensor recording button copies or appends them.

Verdict: PASS

| artifact | path |
| --- | --- |
| normalized stream log | `outputs/streaming_world/session_001_stream_log.md` |
| rolling sensory buffer | `outputs/streaming_world/session_001_rolling_buffer.md` |
| compact trigger log | `outputs/streaming_world/session_001_compact_trigger_log.md` |

## Raw Recording Files

| sensor | raw rows written | file |
| --- | --- | --- |
| brightness | 0 | - |
| volume | 10 | `sensor_recordings/volume/session_001_raw.md` |
| touch | 13 | `sensor_recordings/touch/session_001_raw.md` |
| taste | 0 | - |
| smell | 0 | - |

## Checks

| check | result |
| --- | --- |
| 20 artificial world ticks were appended | PASS |
| rolling buffer keeps only the latest 10 ticks | PASS |
| old rolling buffer rows disappear by the final tick | PASS |
| compact trigger log contains n rows | PASS |
| compact trigger log contains n^-1 rows | PASS |
| compact trigger log contains n^-2 rows | PASS |
| n^-2 fires while all raw recording buttons are off | PASS |
| n^-2 fires while volume raw recording is on | PASS |
| record_volume copies the current buffer when it turns on | PASS |
| volume raw detail stops after record_volume turns off | PASS |
| record_touch copies the current buffer when it turns on | PASS |
| touch raw detail stops after record_touch turns off | PASS |
