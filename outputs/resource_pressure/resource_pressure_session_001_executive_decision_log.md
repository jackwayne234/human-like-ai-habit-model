# Executive Decision Log: resource_pressure_session_001

This log compares two policies on the same 60-tick stream. Both can read compact `n`, `n^-1`, and `n^-2` output. Raw recording, raw inspection, and raw analysis add physical resource cost.

| policy | tick | action | compact trigger rows | raw senses opened | pressure | reason |
| --- | --- | --- | --- | --- | --- | --- |
| compact_first_executive | 1 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 2 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 3 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 4 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 5 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 6 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 7 | compact_read | 0 | 0 | 24% | quiet compact tick |
| compact_first_executive | 8 | compact_read | 2 | 0 | 24.04% | n-1, n-2 noticed for volume |
| compact_first_executive | 9 | compact_read | 1 | 0 | 24.06% | n-2 noticed |
| compact_first_executive | 10 | compact_read | 0 | 0 | 24.06% | quiet compact tick |
| compact_first_executive | 11 | compact_read | 0 | 0 | 24.06% | quiet compact tick |
| compact_first_executive | 12 | compact_read | 0 | 0 | 24.06% | quiet compact tick |
| compact_first_executive | 13 | compact_read | 0 | 0 | 24.06% | quiet compact tick |
| compact_first_executive | 14 | selective_raw_window | 3 | 1 | 25.62% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 15 | compact_read | 1 | 0 | 25.64% | n-1 noticed for brightness |
| compact_first_executive | 16 | compact_read | 1 | 0 | 25.66% | n-2 noticed |
| compact_first_executive | 17 | compact_read | 0 | 0 | 25.66% | quiet compact tick |
| compact_first_executive | 18 | compact_read | 0 | 0 | 25.66% | quiet compact tick |
| compact_first_executive | 19 | compact_read | 0 | 0 | 25.66% | quiet compact tick |
| compact_first_executive | 20 | compact_read | 0 | 0 | 25.66% | quiet compact tick |
| compact_first_executive | 21 | compact_read | 2 | 0 | 25.7% | n-1, n-2 noticed for touch |
| compact_first_executive | 22 | selective_raw_window | 4 | 2 | 29.82% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 23 | compact_read | 1 | 0 | 29.96% | n-2 noticed |
| compact_first_executive | 24 | compact_read | 0 | 0 | 30.08% | quiet compact tick |
| compact_first_executive | 25 | compact_read | 0 | 0 | 30.2% | quiet compact tick |
| compact_first_executive | 26 | compact_read | 0 | 0 | 30.32% | quiet compact tick |
| compact_first_executive | 27 | compact_read | 0 | 0 | 30.44% | quiet compact tick |
| compact_first_executive | 28 | compact_read | 0 | 0 | 30.56% | quiet compact tick |
| compact_first_executive | 29 | compact_read | 0 | 0 | 30.68% | quiet compact tick |
| compact_first_executive | 30 | compact_read | 0 | 0 | 30.8% | quiet compact tick |
| compact_first_executive | 31 | selective_raw_window | 3 | 1 | 33.28% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 32 | selective_raw_window | 4 | 2 | 38.08% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 33 | compact_read | 1 | 0 | 38.22% | n-2 noticed |
| compact_first_executive | 34 | compact_read | 0 | 0 | 38.34% | quiet compact tick |
| compact_first_executive | 35 | compact_read | 0 | 0 | 38.46% | quiet compact tick |
| compact_first_executive | 36 | compact_read | 0 | 0 | 38.58% | quiet compact tick |
| compact_first_executive | 37 | compact_read | 0 | 0 | 38.7% | quiet compact tick |
| compact_first_executive | 38 | compact_read | 0 | 0 | 38.82% | quiet compact tick |
| compact_first_executive | 39 | compact_read | 0 | 0 | 38.94% | quiet compact tick |
| compact_first_executive | 40 | compact_read | 0 | 0 | 39.06% | quiet compact tick |
| compact_first_executive | 41 | compact_read | 0 | 0 | 39.18% | quiet compact tick |
| compact_first_executive | 42 | compact_read | 0 | 0 | 39.3% | quiet compact tick |
| compact_first_executive | 43 | selective_raw_window | 4 | 2 | 44.1% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 44 | selective_raw_window | 5 | 3 | 51.22% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 45 | compact_read | 1 | 0 | 51.36% | n-2 noticed |
| compact_first_executive | 46 | compact_read | 0 | 0 | 51.48% | quiet compact tick |
| compact_first_executive | 47 | compact_read | 0 | 0 | 51.6% | quiet compact tick |
| compact_first_executive | 48 | compact_read | 0 | 0 | 51.72% | quiet compact tick |
| compact_first_executive | 49 | compact_read | 0 | 0 | 51.84% | quiet compact tick |
| compact_first_executive | 50 | compact_read | 0 | 0 | 51.96% | quiet compact tick |
| compact_first_executive | 51 | compact_read | 0 | 0 | 52.08% | quiet compact tick |
| compact_first_executive | 52 | compact_read | 0 | 0 | 52.2% | quiet compact tick |
| compact_first_executive | 53 | compact_read | 0 | 0 | 52.32% | quiet compact tick |
| compact_first_executive | 54 | compact_read | 0 | 0 | 52.44% | quiet compact tick |
| compact_first_executive | 55 | selective_raw_window | 3 | 1 | 54.92% | compact trigger was strong enough to justify raw detail |
| compact_first_executive | 56 | compact_read | 1 | 0 | 55.06% | n-1 noticed for smell |
| compact_first_executive | 57 | compact_read | 1 | 0 | 55.2% | n-2 noticed |
| compact_first_executive | 58 | compact_read | 0 | 0 | 55.32% | quiet compact tick |
| compact_first_executive | 59 | compact_read | 0 | 0 | 55.44% | quiet compact tick |
| compact_first_executive | 60 | compact_read | 0 | 0 | 55.56% | quiet compact tick |
| raw_hungry_executive | 1 | raw_inspect_analyze_all | 0 | 5 | 44.6% | raw-heavy policy opened all sensors without compact need |
| raw_hungry_executive | 2 | raw_inspect_analyze_all | 0 | 5 | 69.2% | raw-heavy policy opened all sensors without compact need |
| raw_hungry_executive | 3 | raw_inspect_analyze_all_then_pressure_fallback | 0 | 5 | 93.8% | raw-heavy policy opened all sensors without compact need |
| raw_hungry_executive | 4 | forced_compact_fallback | 0 | 0 | 89.65% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 5 | forced_compact_fallback | 0 | 0 | 85.5% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 6 | forced_compact_fallback | 0 | 0 | 81.35% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 7 | forced_compact_fallback | 0 | 0 | 77.2% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 8 | forced_compact_fallback | 2 | 0 | 73.15% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 9 | forced_compact_fallback | 1 | 0 | 69.05% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 10 | forced_compact_fallback | 0 | 0 | 64.9% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 11 | raw_inspect_analyze_all_then_pressure_fallback | 0 | 5 | 89.5% | raw-heavy policy opened all sensors without compact need |
| raw_hungry_executive | 12 | forced_compact_fallback | 0 | 0 | 85.35% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 13 | forced_compact_fallback | 0 | 0 | 81.2% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 14 | forced_compact_fallback | 3 | 0 | 77.2% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 15 | forced_compact_fallback | 1 | 0 | 73.1% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 16 | forced_compact_fallback | 1 | 0 | 69% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 17 | forced_compact_fallback | 0 | 0 | 68.2% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 18 | raw_inspect_analyze_all_then_pressure_fallback | 0 | 5 | 89.45% | raw-heavy policy opened all sensors without compact need |
| raw_hungry_executive | 19 | forced_compact_fallback | 0 | 0 | 85.3% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 20 | forced_compact_fallback | 0 | 0 | 81.15% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 21 | forced_compact_fallback | 2 | 0 | 80.22% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 22 | forced_compact_fallback | 4 | 0 | 80.42% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 23 | forced_compact_fallback | 1 | 0 | 80.56% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 24 | forced_compact_fallback | 0 | 0 | 80.68% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 25 | forced_compact_fallback | 0 | 0 | 80.8% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 26 | forced_compact_fallback | 0 | 0 | 80.92% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 27 | forced_compact_fallback | 0 | 0 | 81.04% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 28 | forced_compact_fallback | 0 | 0 | 81.16% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 29 | forced_compact_fallback | 0 | 0 | 81.28% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 30 | forced_compact_fallback | 0 | 0 | 81.4% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 31 | forced_compact_fallback | 3 | 0 | 81.58% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 32 | forced_compact_fallback | 4 | 0 | 81.78% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 33 | forced_compact_fallback | 1 | 0 | 81.92% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 34 | forced_compact_fallback | 0 | 0 | 82.04% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 35 | forced_compact_fallback | 0 | 0 | 82.16% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 36 | forced_compact_fallback | 0 | 0 | 82.28% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 37 | forced_compact_fallback | 0 | 0 | 82.4% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 38 | forced_compact_fallback | 0 | 0 | 82.52% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 39 | forced_compact_fallback | 0 | 0 | 82.64% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 40 | forced_compact_fallback | 0 | 0 | 82.76% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 41 | forced_compact_fallback | 0 | 0 | 82.88% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 42 | forced_compact_fallback | 0 | 0 | 83% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 43 | forced_compact_fallback | 4 | 0 | 83.2% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 44 | forced_compact_fallback | 5 | 0 | 83.42% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 45 | forced_compact_fallback | 1 | 0 | 83.56% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 46 | forced_compact_fallback | 0 | 0 | 83.68% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 47 | forced_compact_fallback | 0 | 0 | 83.8% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 48 | forced_compact_fallback | 0 | 0 | 83.92% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 49 | forced_compact_fallback | 0 | 0 | 84.04% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 50 | forced_compact_fallback | 0 | 0 | 84.16% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 51 | forced_compact_fallback | 0 | 0 | 84.28% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 52 | forced_compact_fallback | 0 | 0 | 84.4% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 53 | forced_compact_fallback | 0 | 0 | 84.52% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 54 | forced_compact_fallback | 0 | 0 | 84.64% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 55 | forced_compact_fallback | 3 | 0 | 84.82% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 56 | forced_compact_fallback | 1 | 0 | 84.96% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 57 | forced_compact_fallback | 1 | 0 | 85.1% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 58 | forced_compact_fallback | 0 | 0 | 85.22% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 59 | forced_compact_fallback | 0 | 0 | 85.34% | resource pressure locked raw access; compact logs remain available |
| raw_hungry_executive | 60 | forced_compact_fallback | 0 | 0 | 85.46% | resource pressure locked raw access; compact logs remain available |
