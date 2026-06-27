# Layered 2.5D Nursery Lesson Candidates

## Hypotheses

| run | tick | status | lesson | compact evidence |
| --- | --- | --- | --- | --- |
| training_room | 9 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n at_threshold; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| layered_naive | 3 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 falling; compact trigger stream n^-2 falling; body_pitch_pressure n^-1 falling |
| layered_naive | 9 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n at_threshold; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| layered_transfer | 4 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold; foot_drop_warning n^-1 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising |
| layered_transfer | 5 | hypothesis | height-load and pitch pressure can mark ramp or raised surface changes before they become collisions | compact trigger stream n^-2 falling; height_pressure n^-1 falling; compact trigger stream n^-2 falling; body_pitch_pressure n^-1 falling; compact trigger stream n^-2 falling |
| layered_transfer | 6 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold; compact trigger stream n^-2 rising; height_pressure n^-1 rising; compact trigger stream n^-2 rising; body_pitch_pressure n^-1 rising |
| layered_transfer | 7 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling; compact trigger stream n^-2 falling |
| layered_transfer | 8 | hypothesis | foot warning plus pitch pressure may mean a drop or ledge, so probe before committing body weight | foot_drop_warning n at_threshold |
| layered_transfer | 9 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n^-1 rising; compact trigger stream n^-2 rising; height_pressure n^-1 falling; compact trigger stream n^-2 falling; vertical_echo n^-1 rising |
| layered_transfer | 10 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n at_threshold; compact trigger stream n^-2 rising; compact trigger stream n^-2 rising; movement_result n^-1 rising; compact trigger stream n^-2 rising |
| layered_transfer | 11 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | overhead_clearance n^-1 falling; compact trigger stream n^-2 falling; movement_result n^-1 falling; compact trigger stream n^-2 falling |
| layered_transfer | 12 | hypothesis | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height | compact trigger stream n^-2 rising; foot_drop_warning n^-1 falling; compact trigger stream n^-2 falling; ultrasonic_echo n^-1 falling; compact trigger stream n^-2 falling |

## Candidate Reusable Rules

| rule id | status | evidence count | lesson |
| --- | --- | --- | --- |
| layered_2_5d_rule_1 | candidate_reusable_rule | 1 | overhead clearance plus vertical echo pressure means duck or probe before committing upper body height |
