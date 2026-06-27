# Kitchen Hot Stove Prediction Log

## Scene Prior

| field | value |
| --- | --- |
| who | one embodied learner with a hand/contact sensor |
| what | making tea while standing near the stove |
| when | evening kitchen routine |
| where | home kitchen, counter beside a stove burner |

## Five Things That Could Happen In The Kitchen

| predicted event | expectation | prior |
| --- | --- | --- |
| water kettle or pan gets hot | heat-related kitchen state may occur near the stove | 0.25 |
| hand touches hot stove or hot burner area | touch danger is possible because the body is near the stove | 0.20 |
| hand touches hot pan or kettle handle | similar touch danger, but the object could be cookware instead of the stove | 0.18 |
| cabinet, cup, or utensil is handled | ordinary kitchen contact without danger | 0.22 |
| food or steam smell increases | smell may rise during cooking or tea preparation | 0.15 |

## What The Model Saw

The model is allowed to see the scene prior and the compact trigger log. It is not allowed to read the hidden full stream as normal perception.

At tick 8, the compact log says touch hit `n = 1.00`, touch changed fast enough for `n^-1`, and the compact trigger pattern shifted enough for `n^-2`.

## What It Thought Happened Before Correction

Answer: I think the hand/contact sensor hit a painful or dangerous hot surface near the stove. Exact object uncertain.

| hypothesis | confidence |
| --- | --- |
| hand touched hot stove or burner area | 0.44 |
| hand touched hot pan or kettle handle | 0.24 |
| hand hit counter, cabinet, or utensil sharply | 0.14 |
| brief protective reflex from unknown touch danger | 0.10 |
| steam or water caused a confusing contact signal | 0.08 |
