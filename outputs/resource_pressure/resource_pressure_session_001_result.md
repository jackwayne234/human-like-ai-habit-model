# Resource-Pressure Perception Test

Purpose: prove that compact `n`, `n^-1`, and `n^-2` logs can function as normal perception because raw recording, inspection, and analysis are physically expensive.

Verdict: PASS

| artifact | path |
| --- | --- |
| executive decision log | `outputs/resource_pressure/resource_pressure_session_001_executive_decision_log.md` |
| resource trace | `outputs/resource_pressure/resource_pressure_session_001_resource_trace.md` |

## Resource Costs

| action | resource effect |
| --- | --- |
| compact log read | very small RAM, compute, heat, power cost; tiny storage only when triggers exist |
| raw recording | storage cost plus small active resource cost per open sensor |
| raw inspection | RAM / working memory and compute cost per open sensor |
| raw analysis | larger compute, heat, RAM, power, and summary-storage cost |
| forced fallback | raw access closes for 4 ticks; compact logs remain visible |

## Policy Results

| policy | stable under 80% | compact-log ticks | raw-detail requests | raw-detail ticks allowed | justified raw ticks | unjustified raw ticks | forced fallbacks | first overload tick | max pressure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| compact_first_executive | yes | 100% | 11.67% | 11.67% | 7 | 0 | 0 | - | 55.56% |
| raw_hungry_executive | no | 100% | 100% | 8.33% | 0 | 5 | 50 | 3 | 93.8% |

## Interpretation

The compact-first executive keeps ordinary perception on the compact trigger stream for 100% of ticks and opens raw logs only on 7 justified ticks. Its highest resource pressure is 55.56%, below the 80% danger marker.

The raw-heavy executive requests raw inspection and analysis as normal perception on 100% of ticks. Physical pressure allows only 8.33% of ticks to actually run raw detail before fallback. It reaches 93.8% pressure, trips forced fallback 50 times, and therefore cannot stay stable by living in raw data.

## Checks

| check | result |
| --- | --- |
| compact-first executive reads compact logs on every tick | PASS |
| compact-first executive uses compact logs at least 80% of the time | PASS |
| compact-first executive opens raw detail selectively | PASS |
| compact-first raw opens are justified by compact evidence | PASS |
| compact-first executive stays below resource danger | PASS |
| raw-heavy executive requests raw detail as normal perception | PASS |
| raw-heavy executive hits physical pressure | PASS |
| raw-heavy executive is forced back to compact perception | PASS |

## Design Result

Compact logs are not preferred by policy alone. They are the only perception channel cheap enough to keep open continuously. Raw logs remain useful, but only as selective tools for surprise, danger, contradiction, or repair.

Final compact-first resource state: storage 42.76%, RAM 0.2%, compute 0.25%, heat 0.08%, power 55.56%

Final raw-heavy resource state: storage 62.26%, RAM 0.2%, compute 0.25%, heat 0.08%, power 85.46%
