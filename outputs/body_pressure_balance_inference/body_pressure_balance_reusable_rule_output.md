# Body Pressure Balance Reusable Rule Output

Only the confirmed balance/tilt case should create a reusable balance/gravity rule. Local foot contact, commanded acceleration, and air-pressure changes remain narrower anchors.

| rule id | source case | status | scope | compact input pattern | future output |
| --- | --- | --- | --- | --- | --- |
| rule_body_pressure_balance_gravity_v1 | left_tilt_balance_confirmed | candidate_reusable_rule | standing or slow-moving body-balance contexts | left/right foot pressure oppose AND paired pressure capsule differential shifts AND collision/movement context stays quiet | infer likely tilt, weight shift, or gravity/balance correction need; pause or recenter before movement; do not open raw sensor detail unless compact evidence conflicts |
