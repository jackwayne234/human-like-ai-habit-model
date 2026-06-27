# Touch Rate Profile Result

Verdict: PASS

| artifact | path |
| --- | --- |
| profile log | `outputs/touch_rate_profiles/touch_rate_profile_log.md` |
| interpretation | `outputs/touch_rate_profiles/touch_rate_profile_interpretation.md` |

## Checks

| check | result |
| --- | --- |
| gradual profile reaches max touch without n^-1 spike | PASS |
| hot stove profile has sudden rise but smaller fall than sharp object | PASS |
| sharp object profile has sudden rise and sudden fall | PASS |
| rate profile separates the three interpretations | PASS |
