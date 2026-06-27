# Road-Crossing Teacher Correction Log

| case | second | source | prediction before correction | teacher label | correction note |
| --- | --- | --- | --- | --- | --- |
| street_edge_confirmed_crossing | 16 | trusted_teacher | possible_road_crossing_context | road_crossing_area_confirmed | This is a street edge. Stop at the curb, look left and right, listen for cars, and cross only after the path is clear. |
| sidewalk_obstacle_not_crossing | 34 | trusted_teacher | possible_ground_obstacle | sidewalk_obstacle_not_crossing | This foot contact is a sidewalk obstacle. Step carefully, but do not create the road-crossing rule from this case. |
| driveway_vehicle_sound_caution | 48 | trusted_teacher | possible_vehicle_nearby | vehicle_nearby_caution_not_crossing_rule | A vehicle sound near a driveway means pause and watch, but this example alone is not the full public-road crossing rule. |
