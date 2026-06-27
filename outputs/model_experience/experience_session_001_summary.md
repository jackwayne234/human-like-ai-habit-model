# Constant Stream Experience Summary

Purpose: turn on continuous artificial sensory input, turn on all five raw recording logs, run compact formulas, and inspect what the logs show as the model's first stream experience.

Verdict: PASS

| artifact | path |
| --- | --- |
| normalized stream | `outputs/model_experience/experience_session_001_stream_log.md` |
| rolling buffer | `outputs/model_experience/experience_session_001_rolling_buffer.md` |
| compact trigger log | `outputs/model_experience/experience_session_001_compact_trigger_log.md` |
| noticed log | `outputs/model_experience/experience_session_001_noticed_log.md` |

## What The Logs Show

| measure | value |
| --- | --- |
| total ticks | 60 |
| final rolling buffer ticks | 51-60 |
| noticed ticks | 17 |
| n triggers | 3 |
| n^-1 triggers | 20 |
| n^-2 triggers | 15 |

## Trigger Counts By Sense

| sense | compact trigger rows |
| --- | --- |
| brightness | 5 |
| volume | 7 |
| touch | 7 |
| taste | 4 |
| smell | 5 |

## Dense Notice Moments

| tick | trigger count | layers | senses |
| --- | --- | --- | --- |
| 14 | 3 | n, n-1, n-2 | brightness |
| 22 | 4 | n-1, n-2 | volume, touch |
| 31 | 3 | n, n-1, n-2 | taste |
| 32 | 4 | n-1, n-2 | taste, smell |
| 43 | 4 | n-1, n-2 | volume, touch |
| 44 | 5 | n-1, n-2 | brightness, volume, touch |
| 55 | 3 | n, n-1, n-2 | smell |

## Checks

| check | result |
| --- | --- |
| 60 ticks reached the stream log | PASS |
| all five recording buttons are on | PASS |
| rolling buffer keeps only 10 ticks | PASS |
| old buffer ticks disappeared | PASS |
| compact n triggers were recorded | PASS |
| compact n^-1 triggers were recorded | PASS |
| compact n^-2 triggers were recorded | PASS |
| noticed log has model-visible events | PASS |
| each sensor raw recording has 60 rows | PASS |
