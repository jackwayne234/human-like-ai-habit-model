# Recording Controls

This is the v1 raw sensor recording control surface for Builder / Dreamer and Critic / Reality-Checker.

There are exactly five buttons, one per sensor. Each button toggles recording for its own sensor.

| button | sensor | current state | writes to |
| --- | --- | --- | --- |
| `record_brightness` | brightness / sight | `off` | `sensor_recordings/brightness/` |
| `record_volume` | volume / hearing | `off` | `sensor_recordings/volume/` |
| `record_touch` | touch | `off` | `sensor_recordings/touch/` |
| `record_taste` | taste | `off` | `sensor_recordings/taste/` |
| `record_smell` | smell | `off` | `sensor_recordings/smell/` |

Pressing a button while its sensor is `off` starts raw recording for that sensor.

Pressing the same button while its sensor is `on` stops raw recording for that sensor.

These buttons do not affect compact threshold monitoring. `n`, `n^-1`, and `n^-2` remain on whether every raw recording button is `off` or every raw recording button is `on`.
