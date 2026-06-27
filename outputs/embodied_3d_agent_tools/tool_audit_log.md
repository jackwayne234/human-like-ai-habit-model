# Embodied 3D Agent Tool Boundary Tool Audit Log

| tick | tool | result | detail |
| --- | --- | --- | --- |
| 0 | requestRawDetail | denied | check exact 3d shape before acting |
| 0 | readCompactSensors3D | ok | compact 3d stream quiet |
| 0 | readRiskMemory3D | ok | none |
| 0 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 0 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 1 | chooseAction3D | ok | step_forward: matched_or_explained |
| 1 | readCompactSensors3D | ok | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement |
| 1 | writeMapBelief3D | ok | upper_body_space: possible_compact_clearance_constraint |
| 1 | readCompactSensors3D | ok | overhead_clearance n^-1 rising; vertical_echo n^-1 rising; overhead_clearance, vertical_echo n^-1 agreement |
| 1 | readRiskMemory3D | ok | overheadAhead |
| 1 | suggestActionFromRiskMemory3D | ok | probe_forward: compact upper-volume risk asks for a probe before upper-body commitment |
| 1 | predictAction3D | ok | probe_forward: compact probe should reveal upper or floor-height risk before body commitment |
| 2 | chooseAction3D | ok | probe_forward: matched_or_explained |
| 2 | readCompactSensors3D | ok | overhead_clearance n at_threshold; body_top_pressure n at_threshold; body_top_pressure n^-1 rising; movement_result n^-1 rising |
| 2 | writeMapBelief3D | ok | upper_body_space: possible_compact_clearance_constraint |
| 2 | readCompactSensors3D | ok | overhead_clearance n at_threshold; body_top_pressure n at_threshold; body_top_pressure n^-1 rising; movement_result n^-1 rising |
| 2 | readRiskMemory3D | ok | overheadAhead |
| 2 | suggestActionFromRiskMemory3D | ok | crouch_body: compact upper-volume warning was probed, so lower the body before committing |
| 2 | predictAction3D | ok | crouch_body: body top pressure should reduce before forward movement |
| 3 | chooseAction3D | ok | crouch_body: matched_or_explained |
| 3 | readCompactSensors3D | ok | overhead_clearance n^-1 falling; compact 3d trigger stream n^-2 falling; body_top_pressure n^-1 falling; compact 3d trigger stream n^-2 falling; base_height_shift n^-1 rising; compact 3d trigger stream n^-2 rising |
| 3 | writeMapBelief3D | ok | upper_body_space: possible_compact_clearance_constraint |
| 3 | readCompactSensors3D | ok | overhead_clearance n^-1 falling; compact 3d trigger stream n^-2 falling; body_top_pressure n^-1 falling; compact 3d trigger stream n^-2 falling; base_height_shift n^-1 rising; compact 3d trigger stream n^-2 rising |
| 3 | readRiskMemory3D | ok | overheadAhead, loweredForClearance |
| 3 | suggestActionFromRiskMemory3D | ok | probe_forward: body is lowered but compact upper-volume risk still asks for a probe before moving |
| 3 | predictAction3D | ok | probe_forward: compact probe should reveal upper or floor-height risk before body commitment |
| 4 | chooseAction3D | ok | probe_forward: matched_or_explained |
| 4 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising; base_height_shift n^-1 falling; compact 3d trigger stream n^-2 falling; compact 3d trigger stream n^-2 rising |
| 4 | writeMapBelief3D | ok | self_body: vertical_body_height_changed |
| 4 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising; base_height_shift n^-1 falling; compact 3d trigger stream n^-2 falling; compact 3d trigger stream n^-2 rising |
| 4 | readRiskMemory3D | ok | loweredForClearance |
| 4 | suggestActionFromRiskMemory3D | ok | step_forward: crouched probe did not keep upper-volume risk active, so cross while lowered |
| 4 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 5 | chooseAction3D | ok | step_forward: matched_or_explained |
| 5 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 rising |
| 5 | writeMapBelief3D | ok | local_3d_passage: compact evidence supports one more small sample |
| 5 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 rising |
| 5 | readRiskMemory3D | ok | loweredForClearance |
| 5 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 5 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 6 | chooseAction3D | ok | step_forward: matched_or_explained |
| 6 | readCompactSensors3D | ok | foot_step_warning n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising |
| 6 | writeMapBelief3D | ok | floor_support: possible_raised_support |
| 6 | readCompactSensors3D | ok | foot_step_warning n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising |
| 6 | readRiskMemory3D | ok | stepUpAhead, loweredForClearance |
| 6 | suggestActionFromRiskMemory3D | ok | probe_forward: compact foot support says the next floor support may be higher |
| 6 | predictAction3D | ok | probe_forward: compact probe should reveal upper or floor-height risk before body commitment |
| 7 | chooseAction3D | ok | probe_forward: matched_or_explained |
| 7 | readCompactSensors3D | ok | foot_step_warning n at_threshold; body_pitch_pressure n^-1 rising; compact 3d trigger stream n^-2 rising; pressure_capsule_left n^-1 rising; movement_result n^-1 rising |
| 7 | writeMapBelief3D | ok | floor_support: possible_raised_support |
| 7 | readCompactSensors3D | ok | foot_step_warning n at_threshold; body_pitch_pressure n^-1 rising; compact 3d trigger stream n^-2 rising; pressure_capsule_left n^-1 rising; movement_result n^-1 rising |
| 7 | readRiskMemory3D | ok | stepUpAhead, loweredForClearance |
| 7 | suggestActionFromRiskMemory3D | ok | step_up: compact raised-support warning was probed, so lift base height before crossing |
| 7 | predictAction3D | ok | step_up: base height shift should rise toward raised support |
| 8 | chooseAction3D | ok | step_up: matched_or_explained |
| 8 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 falling; compact 3d trigger stream n^-2 falling; base_height_shift n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling; pressure_capsule_left n^-1 falling |
| 8 | writeMapBelief3D | ok | self_body: vertical_body_height_changed |
| 8 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 falling; compact 3d trigger stream n^-2 falling; base_height_shift n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling; pressure_capsule_left n^-1 falling |
| 8 | readRiskMemory3D | ok | loweredForClearance, raisedForStep |
| 8 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 8 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 9 | chooseAction3D | ok | step_forward: matched_or_explained |
| 9 | readCompactSensors3D | ok | vertical_echo n^-1 falling; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling; pressure_capsule_left n^-1 rising; compact 3d trigger stream n^-2 rising; ultrasonic_echo n^-1 falling |
| 9 | writeMapBelief3D | ok | upper_body_space: possible_compact_clearance_constraint |
| 9 | readCompactSensors3D | ok | vertical_echo n^-1 falling; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling; pressure_capsule_left n^-1 rising; compact 3d trigger stream n^-2 rising; ultrasonic_echo n^-1 falling |
| 9 | readRiskMemory3D | ok | stepUpAhead, loweredForClearance, raisedForStep |
| 9 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 9 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 10 | chooseAction3D | ok | step_forward: matched_or_explained |
| 10 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 rising |
| 10 | writeMapBelief3D | ok | local_3d_passage: compact evidence supports one more small sample |
| 10 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 rising |
| 10 | readRiskMemory3D | ok | stepUpAhead, loweredForClearance, raisedForStep |
| 10 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 10 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 11 | chooseAction3D | ok | step_forward: matched_or_explained |
| 11 | readCompactSensors3D | ok | foot_drop_warning n^-1 rising; compact 3d trigger stream n^-2 rising; base_height_shift n^-1 falling; compact 3d trigger stream n^-2 falling; body_pitch_pressure n^-1 falling; compact 3d trigger stream n^-2 falling |
| 11 | writeMapBelief3D | ok | floor_support: possible_lower_support |
| 11 | readCompactSensors3D | ok | foot_drop_warning n^-1 rising; compact 3d trigger stream n^-2 rising; base_height_shift n^-1 falling; compact 3d trigger stream n^-2 falling; body_pitch_pressure n^-1 falling; compact 3d trigger stream n^-2 falling |
| 11 | readRiskMemory3D | ok | stepUpAhead, dropAhead, loweredForClearance, raisedForStep |
| 11 | suggestActionFromRiskMemory3D | ok | probe_forward: compact foot support says the next floor support may be lower |
| 11 | predictAction3D | ok | probe_forward: compact probe should reveal upper or floor-height risk before body commitment |
| 12 | chooseAction3D | ok | probe_forward: matched_or_explained |
| 12 | readCompactSensors3D | ok | foot_drop_warning n at_threshold; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising; body_pitch_pressure n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising |
| 12 | writeMapBelief3D | ok | floor_support: possible_lower_support |
| 12 | readCompactSensors3D | ok | foot_drop_warning n at_threshold; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising; body_pitch_pressure n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising |
| 12 | readRiskMemory3D | ok | stepUpAhead, dropAhead, loweredForClearance, raisedForStep |
| 12 | suggestActionFromRiskMemory3D | ok | step_down: compact lower-support warning was probed, so lower base height before crossing |
| 12 | predictAction3D | ok | step_down: base height shift should fall toward lower support |
| 13 | chooseAction3D | ok | step_down: matched_or_explained |
| 13 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 falling; compact 3d trigger stream n^-2 falling; base_height_shift n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling; pressure_capsule_right n^-1 falling |
| 13 | writeMapBelief3D | ok | self_body: vertical_body_height_changed |
| 13 | readCompactSensors3D | ok | compact 3d trigger stream n^-2 falling; compact 3d trigger stream n^-2 falling; base_height_shift n^-1 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling; pressure_capsule_right n^-1 falling |
| 13 | readRiskMemory3D | ok | stepUpAhead, loweredForClearance, raisedForStep, loweredForDrop |
| 13 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 13 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 14 | chooseAction3D | ok | step_forward: matched_or_explained |
| 14 | readCompactSensors3D | ok | foot_step_warning n^-1 falling; compact 3d trigger stream n^-2 falling; foot_drop_warning n at_threshold; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling |
| 14 | writeMapBelief3D | ok | floor_support: possible_raised_support |
| 14 | readCompactSensors3D | ok | foot_step_warning n^-1 falling; compact 3d trigger stream n^-2 falling; foot_drop_warning n at_threshold; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 rising; compact 3d trigger stream n^-2 falling |
| 14 | readRiskMemory3D | ok | dropAhead, loweredForClearance, loweredForDrop |
| 14 | suggestActionFromRiskMemory3D | ok | step_forward: no compact 3d risk memory asks for probe, height change, or posture change |
| 14 | predictAction3D | ok | step_forward: forward movement should gather compact 3d evidence without hidden geometry |
| 15 | chooseAction3D | ok | step_forward: matched_or_explained |
| 15 | readCompactSensors3D | ok | vertical_echo n^-1 rising; compact 3d trigger stream n^-2 rising; foot_drop_warning n at_threshold; compact 3d trigger stream n^-2 rising |
| 15 | writeMapBelief3D | ok | upper_body_space: possible_compact_clearance_constraint |
| 15 | readCompactSensors3D | ok | vertical_echo n^-1 rising; compact 3d trigger stream n^-2 rising; foot_drop_warning n at_threshold; compact 3d trigger stream n^-2 rising |
| 15 | readRiskMemory3D | ok | overheadAhead, dropAhead, loweredForClearance, loweredForDrop |
| 15 | suggestActionFromRiskMemory3D | ok | probe_forward: body is lowered but compact upper-volume risk still asks for a probe before moving |
| 15 | predictAction3D | ok | probe_forward: compact probe should reveal upper or floor-height risk before body commitment |
| 16 | chooseAction3D | ok | probe_forward: matched_or_explained |
| 16 | readCompactSensors3D | ok | overhead_clearance n at_threshold; overhead_clearance n^-1 rising; foot_drop_warning n at_threshold; body_top_pressure n at_threshold; body_top_pressure n^-1 rising; movement_result n at_threshold |
| 16 | writeMapBelief3D | ok | upper_body_space: possible_compact_clearance_constraint |
