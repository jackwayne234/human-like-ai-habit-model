# Efficiency Enhancer Model

The efficiency enhancer model receives mature habits and tries to compress them into cheaper routines, shortcuts, tools, or deterministic processes.

## Purpose

The efficiency enhancer reduces the cost of behavior that has already become reliable.

It should not invent brand-new goals. It receives mature habits and asks:

- Can this be done with less attention?
- Can this be done with less memory?
- Can this be done with less compute?
- Can this be turned into a deterministic shortcut?
- Can this become a tool, cached plan, or automatic routine?

## Inputs

The efficiency enhancer can read:

| input | source |
| --- | --- |
| mature habits | Habit builder |
| success and failure history | Habit builder / memory |
| cost data | Resource monitor |
| world-model constraints | Inner world model |
| storage pressure | Memory promotion / resource monitor |

## Compression Targets

Mature habits can be compressed into:

| compressed form | meaning |
| --- | --- |
| shortcut | A faster path through a known decision sequence. |
| cached routine | A repeatable process that avoids rethinking each step. |
| deterministic rule | A simple rule that replaces expensive deliberation. |
| tool | A reusable procedure or external helper. |
| summary memory | A compressed memory that replaces bulky repeated episodes. |

## Example

If the system repeatedly learns:

1. touch threshold stays high
2. emergency gate fires
3. withdrawal reduces touch danger
4. the result succeeds reliably

Then the efficiency enhancer can compress that into a low-cost reflex routine:

`repeated touch danger -> withdraw`

That routine should be cheaper than sending every event to the full inner world model.

## Resource Role

The efficiency enhancer is especially important under resource pressure.

| pressure | efficiency response |
| --- | --- |
| storage above 80% | Compress old repeated episodes into summaries. |
| memory above 80% | Replace active deliberation with cheaper routines. |
| compute or thermal pressure | Prefer mature shortcuts over expensive interpretation. |
| survival pressure | Keep fast protective routines available even when compute is limited. |

## Safety Rule

Efficiency should not override survival or reality correction.

If a shortcut starts failing, or if the inner world model detects that the context changed, the habit should be reopened for attention instead of staying automatic.

## v1 Boundary

The efficiency enhancer does not:

- create raw habits
- decide which sensory data is important
- replace the inner world model
- delete memory blindly

It compresses behavior only after the habit builder has enough evidence that the behavior works.
