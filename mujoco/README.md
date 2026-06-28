# Mujoco workstream

This directory exists to test the n-buffer thesis against a real,
open source, instrumented 3D physics world on this Mac mini M4.

## What is verified (as of this commit)

`verify_install.py` proves, on this exact machine:

- mujoco 3.10.0 imports and reports a version
- hello_robot_stretch_3 scene.xml loads (mobile manipulator, table + 2 free objects, IMU sensors)
- franka_emika_panda scene.xml loads (research arm, proprioception-only)
- both scenes step 200 physics ticks under randomized controls without crashing
- both sensor access paths are readable:
  - **path A**: data.sensordata (XML `<sensor>` blocks: gyro, accelerometer)
  - **path B**: data.qpos, data.qvel, data.act, data.cvel, data.contact (direct proprioception)
- both scenes render offscreen to PNG via `mujoco.Renderer`
- interactive `mujoco.viewer` module imports cleanly

## Why this matters for the n-buffer thesis

Two robot streams are used on purpose:

- **stretch3** is the proof that an XML `<sensor>`-defined stream (gyro, accel)
  can be tapped as a labeled n-buffer source. The `n` row for `base_accel`
  would fire when |a - g| crosses a labeled threshold; `n^-1` when the
  acceleration vector changes fast enough between ticks; `n^-2` when the
  acceleration itself is accelerating (e.g. collision onset).
- **franka** is the proof that a model with zero XML sensors is still
  fully streamable. The buffer layer reads joint position deltas,
  joint velocity spikes, and contact onset as the labeled events.
  This is the "menagerie without sensors" path - which most of the
  menagerie robots actually take.

Both paths are legitimate n-buffer sources. The architecture question
is which to standardize on, or whether to accept both.

## Reproducing on this machine

```bash
cd /Users/tempaccout/Desktop/custom\ ai\ model\ topics
python3 -m venv .mujoco-venv
source .mujoco-venv/bin/activate
pip install mujoco numpy pillow
cd mujoco
git clone --depth 1 https://github.com/google-deepmind/mujoco_menagerie.git
python verify_install.py
```

The script writes two preview PNGs:
- `verify_stretch_render.png`
- `verify_franka_render.png`

The interactive window (separate from offscreen render) requires
`mjpython`, not `python`, because of Apple's main-thread-render rule:

```bash
mjpython -m mujoco.viewer --mjcf=mujoco_menagerie/hello_robot_stretch_3/scene.xml
```

## Hardware confirmed

- macOS 26.5.1 on Mac mini M4 (10-core CPU, 10-core GPU, 16-core Neural Engine)
- Python 3.14.5 (system python at /usr/local/bin/python3)
- mujoco wheel installed cleanly via pip - no source build, no conda, no manual steps
- render is offscreen via OSMesa-style fallback (Renderer class); the
  `mujoco.viewer` window path uses OpenGL through Metal

## Next step

Define the n-buffer schema (n, n^-1, n^-2) in code once, and write a
thin Node-or-Python module that taps into either path A or path B
streams and emits the compact rows. This will become the "before/after"
comparison prototype called for in step 4 of the near-term path in
PROJECT_PROGRESS.md.
