# Gate Formula Trial Results

Purpose: test the simplified deterministic gate formula where all compact trigger layers can record and any promoted trigger can become an episode.

Simplified episode rule:

```text
episode = promote
```

This keeps the first gate simple. `n`, `n^-1`, and `n^-2` can all produce compact trigger records, and a promoted `n^-2` acceleration event can become an episode without requiring cross-sense support, repeated evidence, emergency relevance, or executive confirmation.

Overall verdict: PASS

## Scenario 1: Isolated Volume Spike

Volume rises from 0.41 to 1.00 at tick 8. Other senses stay quiet.

| field | value |
| --- | --- |
| mode | `curious` |
| resources | storage 0.62, RAM 0.48, heat 0.35, pressure 0 |
| verdict | PASS |

| check | result |
| --- | --- |
| spike is watched | PASS |
| spike sends compact report upward | PASS |
| spike can become episode | PASS |
| spike does not trigger emergency | PASS |
| falling edge stays below episode threshold | PASS |

| tick | volume | touch | n_v | n_to | d_v | d_to | x | a | score | ignore | watch | promote | episode | emerg | up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.40 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0.42 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 3 | 0.41 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 4 | 0.43 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 5 | 0.40 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 6 | 0.42 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 7 | 0.41 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 8 | 1.00 | 0.20 | 1 | 0 | 1 | 0 | 0 | 1 | 1.00 | 0 | 1 | 1 | 1 | 0 | 1 |
| 9 | 0.42 | 0.20 | 0 | 0 | 1 | 0 | 0 | 0 | 0.20 | 1 | 0 | 0 | 0 | 0 | 0 |
| 10 | 0.41 | 0.20 | 0 | 0 | 0 | 0 | 0 | 1 | 1.00 | 0 | 1 | 1 | 1 | 0 | 1 |

## Scenario 2: Cross-Sense Impact

Volume, brightness, and touch change together at tick 8.

| field | value |
| --- | --- |
| mode | `curious` |
| resources | storage 0.62, RAM 0.48, heat 0.35, pressure 0 |
| verdict | PASS |

| check | result |
| --- | --- |
| impact has cross-sense support | PASS |
| impact sends upward | PASS |
| impact can become episode | PASS |
| impact does not need emergency | PASS |

| tick | volume | touch | n_v | n_to | d_v | d_to | x | a | score | ignore | watch | promote | episode | emerg | up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.40 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0.41 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 3 | 0.42 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 4 | 0.40 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 5 | 0.41 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 6 | 0.42 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 7 | 0.41 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 8 | 1.00 | 0.82 | 1 | 0 | 1 | 1 | 1 | 1 | 1.00 | 0 | 1 | 1 | 1 | 0 | 1 |
| 9 | 0.62 | 0.45 | 0 | 0 | 0 | 0 | 0 | 1 | 1.00 | 0 | 1 | 1 | 1 | 0 | 1 |
| 10 | 0.45 | 0.25 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |

## Scenario 3: Repeated Touch Danger

Touch repeatedly hits 1.00, enough to open the protective route.

| field | value |
| --- | --- |
| mode | `danger` |
| resources | storage 0.62, RAM 0.48, heat 0.35, pressure 0 |
| verdict | PASS |

| check | result |
| --- | --- |
| emergency route opens | PASS |
| emergency opens by tick 3 | PASS |
| emergency sends upward | PASS |
| touch danger can become episode | PASS |

| tick | volume | touch | n_v | n_to | d_v | d_to | x | a | score | ignore | watch | promote | episode | emerg | up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.30 | 0.20 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 1 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0.30 | 1.00 | 0 | 1 | 0 | 1 | 0 | 1 | 1.00 | 0 | 1 | 1 | 1 | 1 | 1 |
| 3 | 0.30 | 1.00 | 0 | 1 | 0 | 0 | 0 | 1 | 1.00 | 0 | 1 | 1 | 1 | 1 | 1 |
| 4 | 0.30 | 1.00 | 0 | 1 | 0 | 0 | 0 | 0 | 0.20 | 0 | 0 | 0 | 0 | 1 | 1 |
| 5 | 0.30 | 0.85 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 0 | 0 | 0 | 0 | 1 | 1 |
| 6 | 0.30 | 0.45 | 0 | 0 | 0 | 0 | 0 | 0 | 0.00 | 0 | 0 | 0 | 0 | 1 | 1 |

