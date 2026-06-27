import fs from "node:fs/promises";
import path from "node:path";

const senses = ["brightness", "volume", "touch", "taste", "smell"];
const sessionId = "experience_session_001";
const totalTicks = 60;
const bufferLimit = 10;
const outputDir = path.resolve("outputs/model_experience");
const streamLogPath = path.join(outputDir, `${sessionId}_stream_log.md`);
const rollingBufferPath = path.join(outputDir, `${sessionId}_rolling_buffer.md`);
const triggerLogPath = path.join(outputDir, `${sessionId}_compact_trigger_log.md`);
const noticedLogPath = path.join(outputDir, `${sessionId}_noticed_log.md`);
const summaryPath = path.join(outputDir, `${sessionId}_summary.md`);
const recordingDir = path.resolve("sensor_recordings");

const rawRecordingPaths = Object.fromEntries(
  senses.map((sense) => [sense, path.join(recordingDir, sense, `${sessionId}_raw.md`)])
);

const buttonPresses = new Map([[1, senses.map((sense) => `record_${sense}`)]]);

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function wave(tick, cycle, low, high) {
  const phase = (tick % cycle) / cycle;
  const rising = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  return low + (high - low) * rising;
}

function sampleWorldTick(tick) {
  const base = {
    brightness: wave(tick, 18, 0.30, 0.58),
    volume: wave(tick + 3, 16, 0.24, 0.52),
    touch: wave(tick + 5, 22, 0.12, 0.36),
    taste: wave(tick + 1, 30, 0.08, 0.22),
    smell: wave(tick + 8, 26, 0.16, 0.42),
  };

  const events = {
    7: { volume: 0.95 },
    8: { volume: 0.35 },
    14: { brightness: 1.00 },
    15: { brightness: 0.42 },
    21: { touch: 0.86, volume: 0.88 },
    22: { touch: 0.26, volume: 0.32 },
    31: { taste: 1.00, smell: 0.80 },
    32: { taste: 0.12, smell: 0.24 },
    43: { brightness: 0.92, volume: 0.91, touch: 0.84 },
    44: { brightness: 0.38, volume: 0.36, touch: 0.24 },
    55: { smell: 1.00 },
    56: { smell: 0.22 },
  };

  const sample = { tick, ...base, ...(events[tick] ?? {}) };
  return Object.fromEntries(
    Object.entries(sample).map(([key, value]) => [key, key === "tick" ? value : round(clamp(value))])
  );
}

function rawDetailFor(sense, sample) {
  const value = sample[sense];
  return {
    tick: sample.tick,
    normalized: value,
    raw_a: round(clamp(value + (sample.tick % 2 === 0 ? 0.03 : -0.02))),
    raw_b: round(clamp(value + (sample.tick % 3 === 0 ? 0.05 : -0.01))),
    raw_c: round(clamp(value + (sample.tick % 4 === 0 ? -0.04 : 0.02))),
    raw_d: round(clamp(value + (sample.tick % 5 === 0 ? 0.04 : -0.03))),
  };
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

function renderStreamRow(sample, recording, buttons) {
  return `| ${[
    sample.tick,
    sample.brightness.toFixed(2),
    sample.volume.toFixed(2),
    sample.touch.toFixed(2),
    sample.taste.toFixed(2),
    sample.smell.toFixed(2),
    buttons.length ? buttons.join(", ") : "-",
    senses.filter((sense) => recording[sense]).join(", ") || "-",
  ].join(" | ")} |`;
}

function renderBufferRow(sample) {
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

function renderRawRow(row) {
  return `| ${[
    row.tick,
    row.normalized.toFixed(2),
    row.raw_a.toFixed(2),
    row.raw_b.toFixed(2),
    row.raw_c.toFixed(2),
    row.raw_d.toFixed(2),
  ].join(" | ")} |`;
}

function renderNoticeRow(row) {
  return `| ${[
    row.tick,
    row.triggerCount,
    row.layers.join(", "),
    row.senses.join(", "),
    row.summary,
  ].join(" | ")} |`;
}

async function writeRollingBuffer(buffer) {
  const markdown = `# Rolling Sensory Buffer: ${sessionId}

This is temporary working input only. It keeps the latest ${bufferLimit} ticks and rewrites the file each tick, so older rows disappear from the buffer.

| tick | brightness | volume | touch | taste | smell |
| --- | --- | --- | --- | --- | --- |
${buffer.map(renderBufferRow).join("\n")}
`;

  await fs.writeFile(rollingBufferPath, markdown);
}

await fs.mkdir(outputDir, { recursive: true });
for (const sense of senses) {
  await fs.mkdir(path.dirname(rawRecordingPaths[sense]), { recursive: true });
  await fs.rm(rawRecordingPaths[sense], { force: true });
}

await fs.writeFile(
  streamLogPath,
  `# Constant Stream Log: ${sessionId}

This log represents the continuous normalized input reaching the model.

| tick | brightness | volume | touch | taste | smell | button pressed | raw recording on |
| --- | --- | --- | --- | --- | --- | --- | --- |
`
);

await fs.writeFile(
  triggerLogPath,
  `# Compact Trigger Log: ${sessionId}

These are the formula outputs the model can notice from the stream. Compact monitoring stays on every tick.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
`
);

const recording = Object.fromEntries(senses.map((sense) => [sense, false]));
const rollingBuffer = [];
const rawRowsBySense = Object.fromEntries(senses.map((sense) => [sense, []]));
const streamRows = [];
const triggerRows = [];
const noticeRows = [];
let previousSample;
let previousChangeDensity = 0;

for (let tick = 1; tick <= totalTicks; tick += 1) {
  const sample = sampleWorldTick(tick);
  rollingBuffer.push(sample);
  while (rollingBuffer.length > bufferLimit) {
    rollingBuffer.shift();
  }
  await writeRollingBuffer(rollingBuffer);

  const buttons = buttonPresses.get(tick) ?? [];
  for (const button of buttons) {
    const sense = button.replace("record_", "");
    recording[sense] = !recording[sense];

    if (recording[sense]) {
      rawRowsBySense[sense].push(...rollingBuffer.map((bufferedSample) => rawDetailFor(sense, bufferedSample)));
    }
  }

  streamRows.push({ sample, recording: { ...recording }, buttons });
  await fs.appendFile(streamLogPath, `${renderStreamRow(sample, recording, buttons)}\n`);

  const { triggers, changeDensity } = calculateTriggers(sample, previousSample, previousChangeDensity);
  previousSample = sample;
  previousChangeDensity = changeDensity;

  for (const trigger of triggers) {
    triggerRows.push(trigger);
    await fs.appendFile(triggerLogPath, `${renderTriggerRow(trigger)}\n`);
  }

  if (triggers.length > 0) {
    const layers = [...new Set(triggers.map((trigger) => trigger.layer))];
    const involvedSenses = [
      ...new Set(
        triggers
          .flatMap((trigger) => trigger.senses.split(",").map((sense) => sense.trim()))
          .filter((sense) => senses.includes(sense))
      ),
    ];
    noticeRows.push({
      tick,
      triggerCount: triggers.length,
      layers,
      senses: involvedSenses,
      summary:
        involvedSenses.length > 0
          ? `${involvedSenses.join(", ")} changed enough to reach compact attention`
          : "compact change pattern shifted",
    });
  }

  for (const sense of senses) {
    if (recording[sense] && !buttons.includes(`record_${sense}`)) {
      rawRowsBySense[sense].push(rawDetailFor(sense, sample));
    }
  }
}

for (const sense of senses) {
  const rows = rawRowsBySense[sense];
  const markdown = `# Raw ${sense} Recording: ${sessionId}

Button: \`record_${sense}\`

This file stores higher-detail artificial raw values copied from the rolling buffer when recording turns on, then appended while this sensor's recording button stays on.

| tick | normalized | raw_a | raw_b | raw_c | raw_d |
| --- | --- | --- | --- | --- | --- |
${rows.map(renderRawRow).join("\n")}
`;

  await fs.writeFile(rawRecordingPaths[sense], markdown);
}

await fs.writeFile(
  noticedLogPath,
  `# Noticed Log: ${sessionId}

This is a compact readable view of what the formula stack made visible to the model.

| tick | trigger count | layers | senses | summary |
| --- | --- | --- | --- | --- |
${noticeRows.map(renderNoticeRow).join("\n")}
`
);

const triggersByLayer = Object.fromEntries(["n", "n-1", "n-2"].map((layer) => [layer, 0]));
for (const trigger of triggerRows) {
  triggersByLayer[trigger.layer] += 1;
}

const triggersBySense = Object.fromEntries(senses.map((sense) => [sense, 0]));
for (const trigger of triggerRows) {
  for (const sense of senses) {
    if (trigger.senses.split(",").map((item) => item.trim()).includes(sense)) {
      triggersBySense[sense] += 1;
    }
  }
}

const denseNoticeRows = noticeRows
  .filter((row) => row.triggerCount >= 3)
  .map((row) => `| ${row.tick} | ${row.triggerCount} | ${row.layers.join(", ")} | ${row.senses.join(", ")} |`)
  .join("\n");

const checks = [
  ["60 ticks reached the stream log", streamRows.length === totalTicks],
  ["all five recording buttons are on", senses.every((sense) => recording[sense])],
  ["rolling buffer keeps only 10 ticks", rollingBuffer.length === bufferLimit],
  ["old buffer ticks disappeared", rollingBuffer[0].tick === 51 && rollingBuffer.at(-1).tick === 60],
  ["compact n triggers were recorded", triggersByLayer.n > 0],
  ["compact n^-1 triggers were recorded", triggersByLayer["n-1"] > 0],
  ["compact n^-2 triggers were recorded", triggersByLayer["n-2"] > 0],
  ["noticed log has model-visible events", noticeRows.length > 0],
  ["each sensor raw recording has 60 rows", senses.every((sense) => rawRowsBySense[sense].length === totalTicks)],
];
const passed = checks.every(([, ok]) => ok);

const summaryMarkdown = `# Constant Stream Experience Summary

Purpose: turn on continuous artificial sensory input, turn on all five raw recording logs, run compact formulas, and inspect what the logs show as the model's first stream experience.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| normalized stream | \`outputs/model_experience/${sessionId}_stream_log.md\` |
| rolling buffer | \`outputs/model_experience/${sessionId}_rolling_buffer.md\` |
| compact trigger log | \`outputs/model_experience/${sessionId}_compact_trigger_log.md\` |
| noticed log | \`outputs/model_experience/${sessionId}_noticed_log.md\` |

## What The Logs Show

| measure | value |
| --- | --- |
| total ticks | ${totalTicks} |
| final rolling buffer ticks | ${rollingBuffer[0].tick}-${rollingBuffer.at(-1).tick} |
| noticed ticks | ${noticeRows.length} |
| n triggers | ${triggersByLayer.n} |
| n^-1 triggers | ${triggersByLayer["n-1"]} |
| n^-2 triggers | ${triggersByLayer["n-2"]} |

## Trigger Counts By Sense

| sense | compact trigger rows |
| --- | --- |
${senses.map((sense) => `| ${sense} | ${triggersBySense[sense]} |`).join("\n")}

## Dense Notice Moments

| tick | trigger count | layers | senses |
| --- | --- | --- | --- |
${denseNoticeRows || "| - | - | - | - |"}

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(summaryPath, summaryMarkdown);

console.log(summaryPath);
console.log(passed ? "PASS" : "FAIL");
