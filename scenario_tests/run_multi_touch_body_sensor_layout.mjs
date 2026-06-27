import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/multi_touch_body_sensor_layout");
const streamLogPath = path.join(outputDir, "multi_touch_body_stream_log.md");
const compactLogPath = path.join(outputDir, "multi_touch_body_compact_log.md");
const interpretationPath = path.join(outputDir, "multi_touch_body_interpretation.md");
const resultPath = path.join(outputDir, "multi_touch_body_sensor_layout_result.md");

const touchSensors = [
  "touch_left_fingertips",
  "touch_right_fingertips",
  "touch_left_palm",
  "touch_right_palm",
  "touch_left_forearm",
  "touch_right_forearm",
  "touch_torso_front",
  "touch_torso_back",
  "touch_left_foot",
  "touch_right_foot",
];

const ticks = [
  {
    tick: 1,
    label: "baseline",
    brightness: 0.42,
    volume: 0.22,
    taste: 0.02,
    smell: 0.18,
  },
  {
    tick: 2,
    label: "left fingertips touch hot stove",
    brightness: 0.43,
    volume: 0.25,
    taste: 0.02,
    smell: 0.19,
    touch_left_fingertips: 1.0,
  },
  {
    tick: 3,
    label: "left hand withdraws",
    brightness: 0.42,
    volume: 0.24,
    taste: 0.02,
    smell: 0.2,
    touch_left_fingertips: 0.12,
  },
  {
    tick: 4,
    label: "walking baseline",
    brightness: 0.44,
    volume: 0.28,
    taste: 0.02,
    smell: 0.2,
    touch_left_foot: 0.26,
    touch_right_foot: 0.24,
  },
  {
    tick: 5,
    label: "left foot hits low obstacle",
    brightness: 0.46,
    volume: 0.32,
    taste: 0.02,
    smell: 0.21,
    touch_left_foot: 1.0,
    touch_right_foot: 0.28,
  },
  {
    tick: 6,
    label: "front torso bumps counter",
    brightness: 0.47,
    volume: 0.34,
    taste: 0.02,
    smell: 0.21,
    touch_left_foot: 0.22,
    touch_right_foot: 0.26,
    touch_torso_front: 1.0,
  },
  {
    tick: 7,
    label: "both palms grip box",
    brightness: 0.45,
    volume: 0.3,
    taste: 0.02,
    smell: 0.22,
    touch_left_palm: 0.88,
    touch_right_palm: 0.9,
    touch_torso_front: 0.18,
  },
  {
    tick: 8,
    label: "box released",
    brightness: 0.44,
    volume: 0.26,
    taste: 0.02,
    smell: 0.22,
    touch_left_palm: 0.18,
    touch_right_palm: 0.2,
  },
];

function round(value) {
  return Math.round(value * 100) / 100;
}

function normalizeTick(tick) {
  const normalized = { ...tick };
  for (const sensor of touchSensors) {
    normalized[sensor] = normalized[sensor] ?? 0.08;
  }
  return normalized;
}

function calculateTriggers(samples) {
  const triggers = [];
  let previousChangeDensity = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    const previous = samples[index - 1];

    for (const sensor of touchSensors) {
      if (sample[sensor] === 1) {
        triggers.push({
          tick: sample.tick,
          layer: "n",
          event: "threshold_hit",
          involved: sensor,
          value: sample[sensor],
          signedChange: 0,
          threshold: "1.0",
        });
      }
    }

    const changedSensors = [];
    if (previous) {
      for (const sensor of touchSensors) {
        const signedChange = round(sample[sensor] - previous[sensor]);
        const absoluteChange = Math.abs(signedChange);
        if (absoluteChange >= 0.5) {
          changedSensors.push({ sensor, signedChange, absoluteChange });
          triggers.push({
            tick: sample.tick,
            layer: "n^-1",
            event: "rate_of_change_within_touch_location",
            involved: sensor,
            value: absoluteChange,
            signedChange,
            threshold: "0.5",
          });
        }
      }
    }

    if (changedSensors.length >= 2) {
      triggers.push({
        tick: sample.tick,
        layer: "n^-1",
        event: "rate_of_change_between_touch_locations",
        involved: changedSensors.map((change) => change.sensor).join(", "),
        value: changedSensors.length,
        signedChange: 0,
        threshold: "2 touch locations >= 0.5",
      });
    }

    const changeDensity = round(changedSensors.length / touchSensors.length);
    if (previous && Math.abs(changeDensity - previousChangeDensity) > 0) {
      triggers.push({
        tick: sample.tick,
        layer: "n^-2",
        event: "touch_location_pattern_shift",
        involved: "multi-touch trigger stream",
        value: round(Math.abs(changeDensity - previousChangeDensity)),
        signedChange: 0,
        threshold: "> 0 shift",
      });
    }

    previousChangeDensity = changeDensity;
  }

  return triggers;
}

function interpretTriggerGroup(tick, triggers) {
  const involved = triggers.map((trigger) => trigger.involved).join(", ");
  const hasNHit = (sensor) =>
    triggers.some(
      (trigger) => trigger.layer === "n" && trigger.event === "threshold_hit" && trigger.involved === sensor
    );

  if (hasNHit("touch_left_fingertips") || involved.includes("touch_left_fingertips")) {
    return {
      tick,
      compactPattern: "left fingertip max with fast rise/withdrawal",
      likelyQuestion: "What surface did the left hand contact, and is this hand-area surface dangerous?",
      expectedMapUse: "hand contact risk near object or stove anchor",
    };
  }

  if (hasNHit("touch_torso_front")) {
    return {
      tick,
      compactPattern: "front torso max",
      likelyQuestion: "Did the body collide with a wall, counter, or person?",
      expectedMapUse: "front-body obstacle anchor",
    };
  }

  if (hasNHit("touch_left_foot") || involved.includes("touch_left_foot")) {
    return {
      tick,
      compactPattern: "left foot/base max with fast change",
      likelyQuestion: "Did the foot/base hit an obstacle, step edge, or uneven ground?",
      expectedMapUse: "ground or obstacle contact anchor",
    };
  }

  if (involved.includes("touch_left_palm") && involved.includes("touch_right_palm")) {
    return {
      tick,
      compactPattern: "both palms change together",
      likelyQuestion: "Is the robot gripping or supporting an object?",
      expectedMapUse: "held-object or grip-action anchor",
    };
  }

  if (involved.includes("touch_torso_front")) {
    return {
      tick,
      compactPattern: "front torso max",
      likelyQuestion: "Did the body collide with a wall, counter, or person?",
      expectedMapUse: "front-body obstacle anchor",
    };
  }

  return {
    tick,
    compactPattern: "unlabeled multi-touch event",
    likelyQuestion: "Which body contact mattered here?",
    expectedMapUse: "unknown touch anchor",
  };
}

function renderStreamRow(sample) {
  return `| ${[
    sample.tick,
    sample.label,
    sample.brightness.toFixed(2),
    sample.volume.toFixed(2),
    sample.taste.toFixed(2),
    sample.smell.toFixed(2),
    ...touchSensors.map((sensor) => sample[sensor].toFixed(2)),
  ].join(" | ")} |`;
}

function renderTriggerRow(trigger) {
  return `| ${[
    trigger.tick,
    trigger.layer,
    trigger.event,
    trigger.involved,
    Number(trigger.value).toFixed(2),
    Number(trigger.signedChange).toFixed(2),
    trigger.threshold,
  ].join(" | ")} |`;
}

function renderInterpretationRow(row) {
  return `| ${[
    row.tick,
    row.compactPattern,
    row.likelyQuestion,
    row.expectedMapUse,
  ].join(" | ")} |`;
}

await fs.mkdir(outputDir, { recursive: true });

const samples = ticks.map(normalizeTick);
const triggers = calculateTriggers(samples);
const triggerGroups = new Map();
for (const trigger of triggers) {
  if (!triggerGroups.has(trigger.tick)) {
    triggerGroups.set(trigger.tick, []);
  }
  triggerGroups.get(trigger.tick).push(trigger);
}
const interpretations = [...triggerGroups.entries()].map(([tick, tickTriggers]) =>
  interpretTriggerGroup(tick, tickTriggers)
);

const checks = [
  ["ten touch location streams are defined", touchSensors.length === 10],
  ["single coarse streams remain for brightness, volume, taste, and smell", samples.every((sample) => ["brightness", "volume", "taste", "smell"].every((sense) => typeof sample[sense] === "number"))],
  ["compact log preserves touch body location names", triggers.some((trigger) => trigger.involved === "touch_left_fingertips") && triggers.some((trigger) => trigger.involved === "touch_left_foot")],
  ["foot contact is distinguishable from fingertip contact", interpretations.some((row) => row.expectedMapUse.includes("ground")) && interpretations.some((row) => row.expectedMapUse.includes("hand"))],
  ["torso contact becomes a different map question", interpretations.some((row) => row.expectedMapUse === "front-body obstacle anchor")],
  ["two-palm grip creates a between-touch-location event", triggers.some((trigger) => trigger.event === "rate_of_change_between_touch_locations" && trigger.involved.includes("touch_left_palm") && trigger.involved.includes("touch_right_palm"))],
];
const passed = checks.every(([, ok]) => ok);

const streamMarkdown = `# Multi-Touch Body Stream Log

Purpose: show one robot tick row with coarse sight/hearing/taste/smell streams plus 10 body-location touch streams.

| tick | label | brightness | volume | taste | smell | ${touchSensors.join(" | ")} |
| --- | --- | --- | --- | --- | --- | ${touchSensors.map(() => "---").join(" | ")} |
${samples.map(renderStreamRow).join("\n")}
`;

const compactMarkdown = `# Multi-Touch Body Compact Log

Purpose: prove that compact touch logs can preserve body location without exposing full raw tactile detail.

| tick | layer | event type | involved touch location | detected value or rate | signed touch change | threshold |
| --- | --- | --- | --- | --- | --- | --- |
${triggers.map(renderTriggerRow).join("\n")}
`;

const interpretationMarkdown = `# Multi-Touch Body Interpretation

Purpose: show why a robot needs location-specific touch streams before inner-world map updates.

| tick | compact pattern | likely map question | expected map use |
| --- | --- | --- | --- |
${interpretations.map(renderInterpretationRow).join("\n")}
`;

const resultMarkdown = `# Multi-Touch Body Sensor Layout Result

Purpose: test a more realistic robot touch input organization while keeping the shared compact n-log event language.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| stream log | \`outputs/multi_touch_body_sensor_layout/multi_touch_body_stream_log.md\` |
| compact log | \`outputs/multi_touch_body_sensor_layout/multi_touch_body_compact_log.md\` |
| interpretation | \`outputs/multi_touch_body_sensor_layout/multi_touch_body_interpretation.md\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(streamLogPath, streamMarkdown);
await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(interpretationPath, interpretationMarkdown);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
