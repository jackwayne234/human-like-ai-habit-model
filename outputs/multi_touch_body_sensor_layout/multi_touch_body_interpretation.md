# Multi-Touch Body Interpretation

Purpose: show why a robot needs location-specific touch streams before inner-world map updates.

| tick | compact pattern | likely map question | expected map use |
| --- | --- | --- | --- |
| 2 | left fingertip max with fast rise/withdrawal | What surface did the left hand contact, and is this hand-area surface dangerous? | hand contact risk near object or stove anchor |
| 3 | left fingertip max with fast rise/withdrawal | What surface did the left hand contact, and is this hand-area surface dangerous? | hand contact risk near object or stove anchor |
| 4 | unlabeled multi-touch event | Which body contact mattered here? | unknown touch anchor |
| 5 | left foot/base max with fast change | Did the foot/base hit an obstacle, step edge, or uneven ground? | ground or obstacle contact anchor |
| 6 | front torso max | Did the body collide with a wall, counter, or person? | front-body obstacle anchor |
| 7 | both palms change together | Is the robot gripping or supporting an object? | held-object or grip-action anchor |
| 8 | both palms change together | Is the robot gripping or supporting an object? | held-object or grip-action anchor |
