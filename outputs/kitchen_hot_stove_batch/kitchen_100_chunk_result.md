# Kitchen 100-Chunk Batch Result

Purpose: compare 80 ambient kitchen chunks against 20 hot-stove chunks using compact logs as the model's main perception surface.

Verdict: PASS

| artifact | path |
| --- | --- |
| hidden dataset | `outputs/kitchen_hot_stove_batch/kitchen_100_chunk_dataset.md` |
| compact logs | `outputs/kitchen_hot_stove_batch/kitchen_100_chunk_compact_logs.md` |
| prediction report | `outputs/kitchen_hot_stove_batch/kitchen_100_chunk_prediction_report.md` |
| correction labels | `outputs/kitchen_hot_stove_batch/kitchen_100_chunk_correction_labels.md` |

## Counts

| measure | value |
| --- | --- |
| total chunks | 100 |
| ambient chunks | 80 |
| hot-stove chunks | 20 |
| true positives | 20 |
| true negatives | 80 |
| false positives | 0 |
| false negatives | 0 |
| accuracy | 1.00 |

## Checks

| check | result |
| --- | --- |
| 100 kitchen chunks generated | PASS |
| 80 ambient chunks generated | PASS |
| 20 hot-stove chunks generated | PASS |
| every hot-stove chunk has touch n max | PASS |
| ambient chunks do not have touch n max | PASS |
| compact-log classifier catches all hot-stove chunks | PASS |
| compact-log classifier avoids false hot-stove alarms | PASS |
