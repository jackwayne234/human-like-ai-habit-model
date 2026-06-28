# Human-Like AI Habit Model

## What This Project Is

5 senses streaming data to a robot.
Sensors → threshold monitors → rate of change monitors → rate of rate of change monitors → AI model.
The AI uses the `n` logs to guess what's going on in the world.
The labeled sensors, in the `n` logs, tell it what's going on without flooding storage with raw data.

The next concrete step is to take an existing 3D AI training world (Habitat-Lab, AI2-THOR, or the in-repo Planetary Researcher game) and put the `n` buffers in front of the AI, telling it to use the `n` buffers instead of the raw data.

Everything else in this repository — the importance gate, the memory promotion, the inner world model, the habit pipeline, the learned operation controls, the 2D → 2.5D → 3D nursery work — exists to make that buffer layer credible, inspectable, and reusable.

## Background

This repository contains a first-pass architecture skeleton for a human-like AI habit and attention system.

The core idea is that raw sensory input should not become memory directly. Sensory values are first compressed through threshold monitors, then passed through an importance gate, memory promotion, an inner world model, habit formation, and efficiency compression.

## Current Structure

| file | purpose |
| --- | --- |
| `01_sensory_streams_system.md` | Defines the first sensory input layer and synthetic sample shape. |
| `02_threshold_monitors.md` | Defines `n`, `n^-1`, and `n^-2` threshold monitors. |
| `03_importance_gate.md` | Defines emergency and attention gates with adjustable duration knobs. |
| `04_memory_promotion.md` | Defines promoted memory forms and sensory storage pools. |
| `05_inner_world_model.md` | Defines the mind's internal world model and separate mind storage. |
| `06_habit_builder.md` | Defines how repeated successful pathways become habits. |
| `07_efficiency_enhancer_model.md` | Defines how mature habits become cheaper routines or shortcuts. |
| `PROJECT_PROGRESS.md` | Current checkpoint and implementation notes. |

## Prototype Artifacts

- `sensory_stream_samples/`: 10 deterministic sensory sample sheets.
- `threshold_trigger_sheets/`: matching trigger sheets generated from the sensory samples.
- `outputs/streaming_world/`: deterministic session-style artificial world stream logs and compact trigger logs.
- `scenario_tests/run_streaming_layer_test.mjs`: generates a simple artificial world stream, rewrites a capped rolling buffer, applies compact trigger formulas, and writes raw sensor recordings when sensor recording buttons copy or append rows.
- `outputs/model_experience/`: a longer constant-stream run showing what the model notices from ongoing input.
- `scenario_tests/run_constant_stream_experience.mjs`: turns on all five raw recording logs, runs 60 artificial world ticks, applies compact formulas, and writes a noticed log.
- `outputs/resource_pressure/`: resource-pressure perception test comparing compact-first perception against raw-heavy perception.
- `scenario_tests/run_resource_pressure_perception_test.mjs`: models storage, RAM/working memory, compute, heat, and power costs so raw recording/inspection/analysis causes forced fallback while compact logs remain continuously usable.
- `outputs/kitchen_hot_stove_batch/`: 100 kitchen chunks showing compact `n` logs at about 7.9% of full stream size while preserving all hot-stove detections in the clean baseline.
- `outputs/connected_spreadsheet_test/connected_sensory_threshold_gate_test.xlsx`: compact workbook prototype for sensory input and threshold layers.
- `spreadsheet_build/build_connected_threshold_workbook.mjs`: workbook builder script.

## Run The 3D Nursery With Your API Key

Do not paste your API key into chat or commit it to git.

1. Copy `.env.local.example` to `.env.local`.
2. For Hermes, paste these lines into `.env.local`:

```bash
API_PROVIDER=hermes
HERMES_API_KEY=your_key_here
HERMES_BASE_URL=the_base_url_from_your_hermes_provider
HERMES_MODEL=the_model_name_from_your_hermes_provider
```

3. For OpenAI instead, use `OPENAI_API_KEY=...` and optionally `OPENAI_MODEL=gpt-4o-mini`.
4. Run a short smoke test:

```bash
/Users/tempaccout/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scenario_tests/run_openai_3d_agent_loop.mjs
```

Use `--full` for a longer behavior observation run, or `--turns=5` for a custom length.

The runner writes results to `outputs/api_3d_agent_loop/`.

Safety rules built into the runner:

- `.env.local` is ignored by git.
- The key is read locally and never printed.
- Hermes runs through the configured `HERMES_BASE_URL` using chat completions.
- The model receives compact 3D sensor/risk-memory context only.
- The model is given a compact mission goal: cross the nursery safely by making steady forward progress.
- Raw 3D detail is denied.
- Hidden coordinates, vertical truth, room geometry, and simulator feature objects stay in the human evaluator log only.
- `behavior_score.md` separates boundary/tool discipline from actual risk-response quality.

## Current Hypothesis

The skeleton starts with:

- five sensory streams: brightness, volume, touch, taste, smell
- three threshold monitor layers: `n`, `n^-1`, `n^-2`
- an importance gate with adjustable knobs
- 100 GB sensory storage split across five sensory pools
- 100 GB separate mind storage for inner-world modeling
- an initial 80% inner-world / 20% outside-world attention split
- a control-surface principle: thresholds, windows, route weights, attention split, and storage pressure should be exposed as mind-selectable knobs instead of hidden deterministic decisions

All numbers are starting parameters, not permanent rules.
