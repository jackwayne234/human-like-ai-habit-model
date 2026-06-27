# Road-Crossing Caregiver Rule Result

Purpose: test a caregiver-style road-crossing bootstrap routine using compact logs and the multi-location touch layout.

Verdict: PASS

| artifact | path |
| --- | --- |
| compact log | `outputs/road_crossing_caregiver_rule/road_crossing_compact_log.md` |
| caregiver routine log | `outputs/road_crossing_caregiver_rule/road_crossing_caregiver_routine_log.md` |
| teacher correction log | `outputs/road_crossing_caregiver_rule/road_crossing_teacher_correction_log.md` |
| delayed consolidation log | `outputs/road_crossing_caregiver_rule/road_crossing_delayed_consolidation_log.md` |
| reusable rule output | `outputs/road_crossing_caregiver_rule/road_crossing_reusable_rule_output.md` |
| inner-world map state | `outputs/road_crossing_caregiver_rule/road_crossing_inner_world_map_state.json` |

## Checks

| check | result |
| --- | --- |
| ten touch location streams are available to the scenario | PASS |
| compact log contains no raw stream fields | PASS |
| street edge case uses compact sight, volume, and foot location evidence | PASS |
| caregiver routine asks road map and clearance questions | PASS |
| teacher correction and compact evidence must agree before consolidation | PASS |
| non-road cases do not create crossing rules | PASS |
| exactly one reusable crossing rule is proposed | PASS |
| all cases become labeled examples | PASS |
| all delayed consolidation rows run 60 seconds after correction | PASS |
| map state separates crossing, obstacle, and caution anchors | PASS |
