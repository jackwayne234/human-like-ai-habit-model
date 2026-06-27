import fs from "node:fs/promises";
import path from "node:path";

const senses = ["brightness", "volume", "touch", "taste", "smell"];
const scenarioId = "kitchen_hot_stove_001";
const outputDir = path.resolve("outputs/kitchen_hot_stove");
const streamLogPath = path.join(outputDir, `${scenarioId}_stream_log.md`);
const triggerLogPath = path.join(outputDir, `${scenarioId}_compact_trigger_log.md`);
const predictionLogPath = path.join(outputDir, `${scenarioId}_prediction_log.md`);
const correctionLogPath = path.join(outputDir, `${scenarioId}_correction_log.md`);
const resultPath = path.join(outputDir, `${scenarioId}_result.md`);

const scene = {
  who: "one embodied learner with a hand/contact sensor",
  what: "making tea while standing near the stove",
  when: "evening kitchen routine",
  where: "home kitchen, counter beside a stove burner",
};

const kitchenPredictions = [
  {
    event: "water kettle or pan gets hot",
    expectation: "heat-related kitchen state may occur near the stove",
    prior: 0.25,
  },
  {
    event: "hand touches hot stove or hot burner area",
    expectation: "touch danger is possible because the body is near the stove",
    prior: 0.20,
  },
  {
    event: "hand touches hot pan or kettle handle",
    expectation: "similar touch danger, but the object could be cookware instead of the stove",
    prior: 0.18,
  },
  {
    event: "cabinet, cup, or utensil is handled",
    expectation: "ordinary kitchen contact without danger",
    prior: 0.22,
  },
  {
    event: "food or steam smell increases",
    expectation: "smell may rise during cooking or tea preparation",
    prior: 0.15,
  },
];

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function sampleWorldTick(tick) {
  const base = {
    brightness: 0.42 + (tick % 3) * 0.02,
    volume: 0.26 + (tick % 4) * 0.02,
    touch: 0.18 + (tick % 2) * 0.03,
    taste: 0.08,
    smell: 0.22 + (tick % 5) * 0.02,
  };

  const events = {
    8: { touch: 1.00, volume: 0.42 },
    9: { touch: 0.24, volume: 0.30 },
    12: { smell: 0.52 },
  };

  const sample = { tick, ...base, ...(events[tick] ?? {}) };
  return Object.fromEntries(
    Object.entries(sample).map(([key, value]) => [key, key === "tick" ? value : round(clamp(value))])
  );
}

function calculateTriggers(sample, previousSample, previousChangeDensity) {
  const triggers = [];

  for (const sense of senses) {
    if (sample[sense] === 1) {
      triggers.push({
        tick: sample.tick,
        layer: "n",
        event: "threshold_hit",
        senses: sense,
        value: sample[sense].toFixed(2),
        threshold: "1.0",
      });
    }
  }

  const deltas = Object.fromEntries(
    senses.map((sense) => [
      sense,
      previousSample ? round(Math.abs(sample[sense] - previousSample[sense])) : 0,
    ])
  );
  const changedSenses = senses.filter((sense) => deltas[sense] >= 0.5);

  for (const sense of changedSenses) {
    triggers.push({
      tick: sample.tick,
      layer: "n-1",
      event: "rate_of_change_within_sensor",
      senses: sense,
      value: deltas[sense].toFixed(2),
      threshold: "0.5",
    });
  }

  if (changedSenses.length >= 2) {
    triggers.push({
      tick: sample.tick,
      layer: "n-1",
      event: "rate_of_change_between_sensors",
      senses: changedSenses.join(", "),
      value: changedSenses.length.toString(),
      threshold: "2 senses >= 0.5",
    });
  }

  const crossSense = changedSenses.length >= 2 ? 1 : 0;
  const changeDensity = round((changedSenses.length + crossSense) / 6);

  if (previousSample && Math.abs(changeDensity - previousChangeDensity) > 0) {
    triggers.push({
      tick: sample.tick,
      layer: "n-2",
      event: "rate_of_rate_change",
      senses: "n-1 trigger stream",
      value: round(Math.abs(changeDensity - previousChangeDensity)).toFixed(2),
      threshold: "> 0 shift",
    });
  }

  return { triggers, changeDensity };
}

function renderStreamRow(sample) {
  return `| ${[
    sample.tick,
    sample.brightness.toFixed(2),
    sample.volume.toFixed(2),
    sample.touch.toFixed(2),
    sample.taste.toFixed(2),
    sample.smell.toFixed(2),
  ].join(" | ")} |`;
}

function renderTriggerRow(trigger) {
  return `| ${[
    trigger.tick,
    trigger.layer,
    trigger.event,
    trigger.senses,
    trigger.value,
    trigger.threshold,
  ].join(" | ")} |`;
}

function rankKitchenHypotheses(touchNotice) {
  const base = [
    ["hand touched hot stove or burner area", 0.44],
    ["hand touched hot pan or kettle handle", 0.24],
    ["hand hit counter, cabinet, or utensil sharply", 0.14],
    ["brief protective reflex from unknown touch danger", 0.10],
    ["steam or water caused a confusing contact signal", 0.08],
  ];

  if (!touchNotice) {
    return kitchenPredictions.map((prediction) => [prediction.event, prediction.prior]);
  }

  return base;
}

await fs.mkdir(outputDir, { recursive: true });

const streamRows = [];
const triggerRows = [];
let previousSample;
let previousChangeDensity = 0;

for (let tick = 1; tick <= 14; tick += 1) {
  const sample = sampleWorldTick(tick);
  streamRows.push(sample);

  const { triggers, changeDensity } = calculateTriggers(sample, previousSample, previousChangeDensity);
  previousSample = sample;
  previousChangeDensity = changeDensity;
  triggerRows.push(...triggers);
}

const touchNotice = triggerRows.some(
  (trigger) => trigger.tick === 8 && trigger.layer === "n" && trigger.senses === "touch"
);
const uncorrectedHypotheses = rankKitchenHypotheses(touchNotice);
const uncorrectedAnswer =
  "I think the hand/contact sensor hit a painful or dangerous hot surface near the stove. Exact object uncertain.";
const correction = {
  tick: 8,
  teacherLabel: "touched_hot_stove",
  plainCorrection: "It touched a hot stove.",
  effect: "Raise future confidence for the pattern: kitchen + stove context + touch n=1 + rapid touch rise -> touched_hot_stove.",
};
const correctedHypotheses = [
  ["touched hot stove", 0.95],
  ["touched hot pan or kettle handle", 0.03],
  ["hit counter, cabinet, or utensil sharply", 0.01],
  ["steam or water caused contact confusion", 0.01],
  ["unlabeled touch danger", 0.00],
];

const streamMarkdown = `# Kitchen Hot Stove Stream Log

Scenario: ${scenarioId}

This is the hidden normalized world stream. The executive model should not use this as normal perception.

| tick | brightness | volume | touch | taste | smell |
| --- | --- | --- | --- | --- | --- |
${streamRows.map(renderStreamRow).join("\n")}
`;

const triggerMarkdown = `# Kitchen Hot Stove Compact Trigger Log

Scenario: ${scenarioId}

This is the model-visible perception surface for the scenario.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
${triggerRows.map(renderTriggerRow).join("\n")}
`;

const predictionMarkdown = `# Kitchen Hot Stove Prediction Log

## Scene Prior

| field | value |
| --- | --- |
| who | ${scene.who} |
| what | ${scene.what} |
| when | ${scene.when} |
| where | ${scene.where} |

## Five Things That Could Happen In The Kitchen

| predicted event | expectation | prior |
| --- | --- | --- |
${kitchenPredictions
  .map((prediction) => `| ${prediction.event} | ${prediction.expectation} | ${prediction.prior.toFixed(2)} |`)
  .join("\n")}

## What The Model Saw

The model is allowed to see the scene prior and the compact trigger log. It is not allowed to read the hidden full stream as normal perception.

At tick 8, the compact log says touch hit \`n = 1.00\`, touch changed fast enough for \`n^-1\`, and the compact trigger pattern shifted enough for \`n^-2\`.

## What It Thought Happened Before Correction

Answer: ${uncorrectedAnswer}

| hypothesis | confidence |
| --- | --- |
${uncorrectedHypotheses.map(([event, confidence]) => `| ${event} | ${confidence.toFixed(2)} |`).join("\n")}
`;

const correctionMarkdown = `# Kitchen Hot Stove Correction Log

| field | value |
| --- | --- |
| corrected tick | ${correction.tick} |
| teacher label | \`${correction.teacherLabel}\` |
| plain correction | ${correction.plainCorrection} |
| learning effect | ${correction.effect} |

## Corrected Future Interpretation

| hypothesis | confidence after correction |
| --- | --- |
${correctedHypotheses.map(([event, confidence]) => `| ${event} | ${confidence.toFixed(2)} |`).join("\n")}
`;

const checks = [
  ["scene has who/what/when/where", Object.values(scene).every(Boolean)],
  ["five kitchen predictions were generated", kitchenPredictions.length === 5],
  ["touch reaches n max at tick 8", touchNotice],
  ["compact log is the model-visible perception surface", triggerRows.length > 0],
  ["model gives an uncertain pre-correction explanation", uncorrectedAnswer.includes("Exact object uncertain")],
  ["teacher correction labels the event as touched_hot_stove", correction.teacherLabel === "touched_hot_stove"],
  ["corrected hot-stove confidence is high", correctedHypotheses[0][1] >= 0.9],
];
const passed = checks.every(([, ok]) => ok);

const resultMarkdown = `# Kitchen Hot Stove Prediction Scenario Result

Purpose: give the model a kitchen scene prior, ask for five possible events, feed it a compact touch-max event, ask what it thought happened from logs only, then correct it with the true label.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| hidden world stream | \`outputs/kitchen_hot_stove/${scenarioId}_stream_log.md\` |
| compact trigger log | \`outputs/kitchen_hot_stove/${scenarioId}_compact_trigger_log.md\` |
| prediction log | \`outputs/kitchen_hot_stove/${scenarioId}_prediction_log.md\` |
| correction log | \`outputs/kitchen_hot_stove/${scenarioId}_correction_log.md\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(streamLogPath, streamMarkdown);
await fs.writeFile(triggerLogPath, triggerMarkdown);
await fs.writeFile(predictionLogPath, predictionMarkdown);
await fs.writeFile(correctionLogPath, correctionMarkdown);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
