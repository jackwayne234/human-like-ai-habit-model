# Digital Embodied World Physics Interview

This interview records the design decisions for the first tiny physics-based digital embodied world.

The goal is to define a small hidden simulator where the robot has a body, receives only compact logs, and learns an inner body/world map through movement, prediction, correction, and caregiver-style cron routines.

## Interview Rules

- 25 questions total.
- One question at a time.
- Multiple choice.
- The recommended answer is marked in the conversation before selection.
- Answers should be recorded here as the interview proceeds.
- After the interview, use these answers together with the existing architecture notes to write the first implementation plan.

## Answers

| question | selected answer | notes |
| --- | --- | --- |
| 1. What should the first physics world be? | A. Tiny 2D physics nursery | A small room with a body, walls, low block, slope, fan, and edge; chosen for the best balance of physics, body-learning, and simplicity. |
| 2. What kind of physics should the first version use? | A. Simple custom felt physics | Write a small deterministic simulator ourselves: movement, blocked steps, pressure shifts, airflow push, slope tilt, and low-obstacle contact. |
| 3. What should the robot's first body be like? | A. Small box-body with base/feet sensors | Simple robot body with front/back/left/right, two base or foot pressure zones, torso-front contact, and pressure capsules. |
| 4. How should the first world be laid out? | A. One small room with a few physical features | Single nursery room with wall boundaries, one low obstacle, one slope/pressure patch, one fan/airflow source, and one edge/curb. |
| 5. What should the first world's size/scale be? | A. Small continuous 2D room, roughly 10 x 10 units | Not a grid, but still tiny; supports movement, collisions, airflow distance, slope zones, partial movement, and physics-like effects. |
| 6. What should be the robot's first movement style? | A. Discrete intention, continuous consequence | Robot chooses simple actions, while simulator resolves them as continuous movement, partial movement, sliding, bumping, or pressure shift. |
| 7. What should the initial action set include? | A. Minimal safe action set | `turn_left`, `turn_right`, `step_forward`, `pause`, `recenter_body`, and `probe_forward`. |
| 8. Which physical feature should the robot meet first? | A. Wall boundary | Teaches the basic body/world lesson that intended movement can fail because the outside world pushes back. |
| 9. How should the world teach low obstacles? | A. Foot/base contact without torso contact | Low block causes foot/base pressure and partial movement, but little or no torso-front collision, teaching body-location meaning. |
| 10. How should the slope or uneven floor work? | A. Pressure differential without hard collision | Robot can move onto it, but left/right base pressure and capsule values shift, teaching balance/leaning without treating terrain as collision. |
| 11. How should the fan or airflow source work? | A. External pressure/airflow without foot-load change | Airflow and pressure capsules change while foot/base pressure stays mostly stable, teaching outside pressure separate from posture or floor load. |
| 12. How should the edge or curb work? | A. Foot/base warning before danger | Robot detects a foot/base pressure drop or edge contact before a harmful fall, teaching caution, prediction, and probing. |
| 13. What compact sensor streams should the first physics world expose? | A. Body plus spatial basics | `touch_torso_front`, `touch_left_base`, `touch_right_base`, `pressure_capsule_left/right/front/back`, `airflow`, `ultrasonic_echo`, `reflection_volume`, and `movement_result`. |
| 14. Should the robot receive any direct position or map coordinates? | A. No direct coordinates | Simulator knows true position, but robot only gets compact evidence and must build its own approximate map. |
| 15. How should we handle hidden simulator truth for testing? | A. Keep hidden truth in a separate debug/evaluation log | Simulator records true position, feature contact, and body state for evaluation, but robot perception never reads it. |
| 16. How often should the body-noticing cron run in the first world? | A. Every 3 ticks, plus after surprise/collision | Frequent enough to teach self-map learning while leaving room for ordinary perception and action. |
| 17. What should the body-noticing cron write? | A. Both self-map and world-map updates | Body and world must be separated together, such as "I am leaning left" plus "this floor patch may be sloped." |
| 18. When should the movement-urge cron speak up? | A. Only when stuck, looping, under-exploring, or after sudden compact surprise | Movement urge nudges small safe actions when waiting too long or not gathering evidence, but sudden `n`, `n^-1`, or `n^-2` surprise should trigger body/map review before more movement. |
| 19. Should we add a separate sudden compact-surprise cron for spikes in `n`, `n^-1`, and `n^-2`? | A. Yes, add a compact-surprise cron | Runs when threshold hits, rate jumps, acceleration shifts, or cross-sensor changes appear; can call body-noticing, pause movement, update the map, or ask for clarification. |
| 20. What should the compact-surprise/prediction crons do around action? | Custom answer: prediction-before-action, comparison-after-action, then general lesson | Before action, predict what should happen if the robot moves or probes. After action, compare compact evidence to the prediction and ask what general reusable rule may apply going forward. |
| 21. How explicit should the prediction-before-action cron be? | A. Every intentional action gets a tiny prediction | Before `step_forward`, `probe_forward`, `turn_left`, or `recenter_body`, the robot writes one compact expectation for early cause/effect learning. |
| 22. When should the comparison-after-action cron run? | A. Immediately after every intentional action, then again after delayed settling if needed | Compare first compact result right away, then check again after 1-2 ticks for airflow, pressure, or balance settling. |
| 23. When should a general lesson learned become a reusable rule? | A. After repeated evidence or trusted teacher confirmation | One event can create a hypothesis, but reusable rules need repetition, correction, or strong cross-sensor agreement. |
| 24. What should count as improvement between run 1 and run 2? | A. Better predictions and safer movement | Second run should show fewer collisions, better `probe_forward` use, better body-state predictions, and more accurate obstacle/terrain/airflow expectations. |
| 25. After this interview, what should I create first? | A. A written implementation plan for the tiny physics nursery | Update the architecture docs with the chosen design, define files/modules/logs/tests, and outline the first implementation steps before coding. |
