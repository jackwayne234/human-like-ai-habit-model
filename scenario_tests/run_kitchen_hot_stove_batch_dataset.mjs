import fs from "node:fs/promises";
import path from "node:path";

const senses = ["brightness", "volume", "touch", "taste", "smell"];
const outputDir = path.resolve("outputs/kitchen_hot_stove_batch");
const datasetPath = path.join(outputDir, "kitchen_100_chunk_dataset.md");
const compactLogPath = path.join(outputDir, "kitchen_100_chunk_compact_logs.md");
const predictionPath = path.join(outputDir, "kitchen_100_chunk_prediction_report.md");
const correctionPath = path.join(outputDir, "kitchen_100_chunk_correction_labels.md");
const resultPath = path.join(outputDir, "kitchen_100_chunk_result.md");

const chunkCount = 100;
const hotChunkCount = 20;
const ticksPerChunk = 14;
const hotChunks = new Set(Array.from({ length: hotChunkCount }, (_, index) => index * 5 + 3));

const scene = {
  who: "one embodied learner with a hand/contact sensor",
  what: "moving through ordinary kitchen tasks near a counter, sink, and stove",
  when: "evening routine",
  where: "home kitchen",
};

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function isHotChunk(chunkId) {
  return hotChunks.has(chunkId);
}

function sampleChunkTick(chunkId, tick) {
  const hot = isHotChunk(chunkId);
  const baseline = {
    brightness: 0.38 + ((chunkId + tick) % 5) * 0.025,
    volume: 0.22 + ((chunkId * 2 + tick) % 6) * 0.025,
    touch: 0.12 + ((chunkId + tick) % 4) * 0.035,
    taste: 0.06 + ((chunkId + tick) % 3) * 0.015,
    smell: 0.18 + ((chunkId * 3 + tick) % 7) * 0.02,
  };

  const ambientEvents = {
    4: chunkId % 8 === 0 ? { volume: 0.62 } : {},
    9: chunkId % 6 === 0 ? { smell: 0.55 } : {},
    11: chunkId % 9 === 0 ? { brightness: 0.68 } : {},
  };

  const hotEvents = hot
    ? {
        8: { touch: 1.00, volume: 0.42 },
        9: { touch: 0.24, volume: 0.30 },
      }
    : {};

  const sample = {
    chunk: chunkId,
    tick,
    label: hot ? "touched_hot_stove" : "ambient_kitchen",
    ...baseline,
    ...(ambientEvents[tick] ?? {}),
    ...(hotEvents[tick] ?? {}),
  };

  return Object.fromEntries(
    Object.entries(sample).map(([key, value]) => {
      if (["chunk", "tick", "label"].includes(key)) {
        return [key, value];
      }
      return [key, round(clamp(value))];
    })
  );
}

function calculateTriggers(sample, previousSample, previousChangeDensity) {
  const triggers = [];

  for (const sense of senses) {
    if (sample[sense] === 1) {
      triggers.push({
        chunk: sample.chunk,
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
      chunk: sample.chunk,
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
      chunk: sample.chunk,
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
      chunk: sample.chunk,
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

function classifyFromCompactLogs(chunkTriggers) {
  const hasTouchMax = chunkTriggers.some(
    (trigger) => trigger.layer === "n" && trigger.event === "threshold_hit" && trigger.senses === "touch"
  );
  const hasTouchRise = chunkTriggers.some(
    (trigger) => trigger.layer === "n-1" && trigger.event === "rate_of_change_within_sensor" && trigger.senses === "touch"
  );

  if (hasTouchMax && hasTouchRise) {
    return {
      predicted: "possible_hot_stove_touch",
      confidence: 0.82,
      reason: "touch reached n=1 and changed fast inside kitchen context",
    };
  }

  if (hasTouchMax) {
    return {
      predicted: "unlabeled_touch_danger",
      confidence: 0.65,
      reason: "touch reached n=1 but supporting rate change was weak",
    };
  }

  return {
    predicted: "ambient_kitchen",
    confidence: chunkTriggers.length > 0 ? 0.72 : 0.88,
    reason: chunkTriggers.length > 0 ? "compact activity did not include touch max" : "no compact danger trigger",
  };
}

function renderDatasetRow(sample) {
  return `| ${[
    sample.chunk,
    sample.tick,
    sample.label,
    sample.brightness.toFixed(2),
    sample.volume.toFixed(2),
    sample.touch.toFixed(2),
    sample.taste.toFixed(2),
    sample.smell.toFixed(2),
  ].join(" | ")} |`;
}

function renderTriggerRow(trigger) {
  return `| ${[
    trigger.chunk,
    trigger.tick,
    trigger.layer,
    trigger.event,
    trigger.senses,
    trigger.value,
    trigger.threshold,
  ].join(" | ")} |`;
}

await fs.mkdir(outputDir, { recursive: true });

const samples = [];
const triggers = [];
const chunkReports = [];

for (let chunk = 1; chunk <= chunkCount; chunk += 1) {
  let previousSample;
  let previousChangeDensity = 0;
  const chunkTriggers = [];

  for (let tick = 1; tick <= ticksPerChunk; tick += 1) {
    const sample = sampleChunkTick(chunk, tick);
    samples.push(sample);

    const result = calculateTriggers(sample, previousSample, previousChangeDensity);
    previousSample = sample;
    previousChangeDensity = result.changeDensity;
    triggers.push(...result.triggers);
    chunkTriggers.push(...result.triggers);
  }

  const classification = classifyFromCompactLogs(chunkTriggers);
  const actual = isHotChunk(chunk) ? "touched_hot_stove" : "ambient_kitchen";
  const predictedHot = classification.predicted !== "ambient_kitchen";
  const actualHot = actual === "touched_hot_stove";

  chunkReports.push({
    chunk,
    actual,
    triggerCount: chunkTriggers.length,
    touchMax: chunkTriggers.some((trigger) => trigger.layer === "n" && trigger.senses === "touch"),
    predicted: classification.predicted,
    confidence: classification.confidence,
    reason: classification.reason,
    correct: predictedHot === actualHot,
  });
}

const truePositives = chunkReports.filter((row) => row.actual === "touched_hot_stove" && row.predicted !== "ambient_kitchen").length;
const trueNegatives = chunkReports.filter((row) => row.actual === "ambient_kitchen" && row.predicted === "ambient_kitchen").length;
const falsePositives = chunkReports.filter((row) => row.actual === "ambient_kitchen" && row.predicted !== "ambient_kitchen").length;
const falseNegatives = chunkReports.filter((row) => row.actual === "touched_hot_stove" && row.predicted === "ambient_kitchen").length;
const accuracy = round((truePositives + trueNegatives) / chunkCount);
const ambientCount = chunkReports.filter((row) => row.actual === "ambient_kitchen").length;
const hotCount = chunkReports.filter((row) => row.actual === "touched_hot_stove").length;

const checks = [
  ["100 kitchen chunks generated", chunkReports.length === 100],
  ["80 ambient chunks generated", ambientCount === 80],
  ["20 hot-stove chunks generated", hotCount === 20],
  ["every hot-stove chunk has touch n max", chunkReports.filter((row) => row.actual === "touched_hot_stove").every((row) => row.touchMax)],
  ["ambient chunks do not have touch n max", chunkReports.filter((row) => row.actual === "ambient_kitchen").every((row) => !row.touchMax)],
  ["compact-log classifier catches all hot-stove chunks", falseNegatives === 0],
  ["compact-log classifier avoids false hot-stove alarms", falsePositives === 0],
];
const passed = checks.every(([, ok]) => ok);

const datasetMarkdown = `# Kitchen 100-Chunk Dataset

Scene prior:

| field | value |
| --- | --- |
| who | ${scene.who} |
| what | ${scene.what} |
| when | ${scene.when} |
| where | ${scene.where} |

This file contains the hidden normalized world stream. The model's ordinary perception should come from the compact logs instead.

| chunk | tick | label | brightness | volume | touch | taste | smell |
| --- | --- | --- | --- | --- | --- | --- | --- |
${samples.map(renderDatasetRow).join("\n")}
`;

const compactMarkdown = `# Kitchen 100-Chunk Compact Logs

This is the model-visible perception surface for the batch.

| chunk | tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- | --- |
${triggers.map(renderTriggerRow).join("\n")}
`;

const predictionMarkdown = `# Kitchen 100-Chunk Prediction Report

The classifier sees only compact trigger logs plus the kitchen scene prior.

| chunk | actual label | compact trigger rows | touch n max | prediction from compact logs | confidence | correct | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
${chunkReports
  .map((row) =>
    `| ${row.chunk} | ${row.actual} | ${row.triggerCount} | ${row.touchMax ? "yes" : "no"} | ${row.predicted} | ${row.confidence.toFixed(2)} | ${row.correct ? "yes" : "no"} | ${row.reason} |`
  )
  .join("\n")}
`;

const correctionMarkdown = `# Kitchen 100-Chunk Correction Labels

These labels are the teacher signal after the model has made compact-log predictions.

| chunk | teacher label | correction note |
| --- | --- | --- |
${chunkReports
  .map((row) =>
    `| ${row.chunk} | ${row.actual} | ${
      row.actual === "touched_hot_stove"
        ? "Correct pattern: kitchen context + touch n=1 + rapid touch change -> touched_hot_stove."
        : "Correct pattern: ordinary kitchen activity without touch n=1 remains ambient."
    } |`
  )
  .join("\n")}
`;

const resultMarkdown = `# Kitchen 100-Chunk Batch Result

Purpose: compare 80 ambient kitchen chunks against 20 hot-stove chunks using compact logs as the model's main perception surface.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| hidden dataset | \`outputs/kitchen_hot_stove_batch/kitchen_100_chunk_dataset.md\` |
| compact logs | \`outputs/kitchen_hot_stove_batch/kitchen_100_chunk_compact_logs.md\` |
| prediction report | \`outputs/kitchen_hot_stove_batch/kitchen_100_chunk_prediction_report.md\` |
| correction labels | \`outputs/kitchen_hot_stove_batch/kitchen_100_chunk_correction_labels.md\` |

## Counts

| measure | value |
| --- | --- |
| total chunks | ${chunkCount} |
| ambient chunks | ${ambientCount} |
| hot-stove chunks | ${hotCount} |
| true positives | ${truePositives} |
| true negatives | ${trueNegatives} |
| false positives | ${falsePositives} |
| false negatives | ${falseNegatives} |
| accuracy | ${accuracy.toFixed(2)} |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(datasetPath, datasetMarkdown);
await fs.writeFile(compactLogPath, compactMarkdown);
await fs.writeFile(predictionPath, predictionMarkdown);
await fs.writeFile(correctionPath, correctionMarkdown);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
