# Tiny 2.5D Nursery Lesson Candidates

One event can create a hypothesis. Reusable candidates require repeated compact evidence or strong cross-sensor agreement.

## Hypotheses

| run | tick | status | lesson | compact evidence |
| --- | --- | --- | --- | --- |
| run_1 | 9 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n at_threshold; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| run_2 | 6 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold; foot_drop_warning n^-1 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising; compact trigger stream n^-2 rising |
| run_2 | 7 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold; compact trigger stream n^-2 falling; ramp_load_shift n^-1 falling; compact trigger stream n^-2 falling; pressure_capsule_left n^-1 falling |
| run_2 | 8 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising |
| run_2 | 9 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n^-1 rising; compact trigger stream n^-2 rising; foot_drop_warning n at_threshold; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement |
| run_2 | 10 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n at_threshold; foot_drop_warning n at_threshold |
| run_2 | 11 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; foot_drop_warning n at_threshold; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| run_2 | 12 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | compact trigger stream n^-2 rising; foot_drop_warning n^-1 falling; compact trigger stream n^-2 falling; height_pressure n^-1 falling; compact trigger stream n^-2 falling |

## Candidate Reusable Rules

| rule id | status | evidence count | lesson |
| --- | --- | --- | --- |
| tiny_2_5d_rule_1 | candidate_reusable_rule | 5 | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height |
| tiny_2_5d_rule_2 | candidate_reusable_rule | 3 | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight |
