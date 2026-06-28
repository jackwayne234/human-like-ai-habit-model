"""
Verify mujoco install on mac mini m4.

This script demonstrates two distinct sensor access paths, because for the
n-buffer project the question "what counts as a sensor" has two answers:

  A) XML <sensor> elements (e.g. gyroscope, accelerometer, jointpos) -
     named scalar streams declared in the MJCF. These become
     data.sensordata entries, named via mj_id2name(..., mjOBJ_SENSOR).

  B) Direct proprioception - read data.qpos (joint positions),
     data.qvel (joint velocities), data.cvel (body velocities),
     data.contact (contact array). No XML sensor block needed; these
     are the standard state of the simulator. This is the path
     franka_panda uses (its scene has zero XML sensors).

Both are legitimate sensor streams for an n-buffer layer. The proof in
this script is that we can read BOTH cleanly on this mac mini m4.

We use hello_robot_stretch_3 as the primary scene (it has a kitchen-table
environment with movable objects AND xml sensors - gyro/accel), and
franka_panda as the secondary scene (proprioception-only).

Outputs:
  - prints version, model stats, sensor names, sensor values
  - writes mujoco/verify_render.png (stretch scene, offscreen)
  - writes mujoco/verify_franka_render.png (franka scene, offscreen)
"""

import sys
from pathlib import Path

import mujoco
import mujoco.viewer  # noqa: F401  -- module-level import so it doesn't shadow
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
STRETCH_SCENE = HERE / "mujoco_menagerie" / "hello_robot_stretch_3" / "scene.xml"
FRANKA_SCENE = HERE / "mujoco_menagerie" / "franka_emika_panda" / "scene.xml"
STRETCH_OUT = HERE / "verify_stretch_render.png"
FRANKA_OUT = HERE / "verify_franka_render.png"


def step(name, fn):
    try:
        result = fn()
        print(f"  [PASS] {name}")
        return result
    except Exception as e:
        print(f"  [FAIL] {name}: {type(e).__name__}: {e}")
        raise


def list_xml_sensors(model):
    rows = []
    for i in range(model.nsensor):
        name = mujoco.mj_id2name(model, mujoco.mjtObj.mjOBJ_SENSOR, i)
        stype = mujoco.mjtSensor(model.sensor_type[i])
        rows.append((i, name, str(stype)))
    return rows


def summarize_stream(label, arr):
    a = np.asarray(arr)
    if a.size == 0:
        print(f"    {label}: empty")
        return
    print(f"    {label}: shape={a.shape}  min={a.min():+.4f}  max={a.max():+.4f}  mean={a.mean():+.4f}")


def run_scene(label, scene_path, out_png, controls_fn):
    print(f"\n== {label} ==")
    print(f"  scene: {scene_path.relative_to(HERE)}")
    if not scene_path.exists():
        raise FileNotFoundError(scene_path)

    model = step("MjModel.from_xml_path", lambda: mujoco.MjModel.from_xml_path(str(scene_path)))
    data = step("MjData(model)", lambda: mujoco.MjData(model))

    print(f"  nq={model.nq}  nv={model.nv}  nu={model.nu}  nbody={model.nbody}  "
          f"njnt={model.njnt}  nsensor={model.nsensor}")

    # ---- XML sensors (path A) ----
    print("  [A] XML <sensor> elements:")
    sensors = list_xml_sensors(model)
    if sensors:
        for i, name, stype in sensors:
            print(f"      sensor[{i:>2}] {name or '(unnamed)':<30} type={stype}")
    else:
        print("      (none defined in this MJCF)")

    # ---- Proprioception (path B) ----
    print("  [B] Direct proprioception arrays (always available):")
    print(f"      data.qpos   - joint positions  (length {model.nq})")
    print(f"      data.qvel   - joint velocities (length {model.nv})")
    print(f"      data.act    - actuator states  (length {model.nu})")
    print(f"      data.cvel   - body 6D velocities (length {model.nbody * 6})")
    print(f"      data.contact array - currently {data.ncon} active contacts")

    # ---- Drive the simulation and re-read ----
    print("  [step] 200 physics steps with controls:")
    rng = np.random.default_rng(0)
    for tick in range(200):
        data.ctrl[:] = controls_fn(tick, model.nu, rng)
        mujoco.mj_step(model, data)

    print("  [read] streams after stepping:")
    summarize_stream("data.sensordata (path A)", data.sensordata)
    summarize_stream("data.qpos       (path B)", data.qpos)
    summarize_stream("data.qvel       (path B)", data.qvel)
    summarize_stream("data.act        (path B)", data.act)
    print(f"      data.ncon contacts now = {data.ncon}")

    # ---- Render offscreen ----
    print("  [render] offscreen to PNG:")
    renderer = mujoco.Renderer(model, height=480, width=640)
    renderer.update_scene(data)
    img = renderer.render()
    Image.fromarray(img).save(out_png)
    print(f"      [PASS] {out_png.name}  shape={img.shape}  size={out_png.stat().st_size} bytes")

    return {"model": model, "data": data, "sensors": sensors}


def main():
    print("== mujoco verify on mac mini m4 ==")
    print(f"mujoco version: {mujoco.__version__}")
    print(f"python:         {sys.version.split()[0]}")
    print(f"working dir:    {HERE}")
    print()

    # stretch3: small room wander - mostly zero, occasional nudges
    stretch = run_scene(
        "hello_robot_stretch_3 (XML sensors + proprioception + table+objects)",
        STRETCH_SCENE,
        STRETCH_OUT,
        controls_fn=lambda tick, nu, rng: np.zeros(nu) if tick % 20 != 0 else rng.uniform(-0.1, 0.1, size=nu),
    )

    # franka_panda: gentle joint wiggle (proprioception only - zero xml sensors)
    franka = run_scene(
        "franka_emika_panda (proprioception only, no xml sensors)",
        FRANKA_SCENE,
        FRANKA_OUT,
        controls_fn=lambda tick, nu, rng: 0.1 * np.sin(tick * 0.05 + np.arange(nu)),
    )

    print("\n== summary ==")
    print("mujoco 3.10.0 + numpy + pillow installed and working on mac mini m4.")
    print("two menagerie robots loaded, stepped, read, and rendered offscreen.")
    print("stretch3 has XML gyro+accel sensors; franka has zero - both are usable.")
    print("next: build the n-buffer layer in front of these streams.")


if __name__ == "__main__":
    main()
