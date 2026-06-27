import fs from "node:fs/promises";
import path from "node:path";

const senses = ["brightness", "volume", "touch", "taste", "smell"];
const sessionId = "session_001";
const bufferLimit = 10;
const outputDir = path.resolve("outputs/streaming_world");
const streamLogPath = path.join(outputDir, `${sessionId}_stream_log.md`);
const rollingBufferPath = path.join(outputDir, `${sessionId}_rolling_buffer.md`);
const triggerLogPath = path.join(outputDir, `${sessionId}_compact_trigger_log.md`);
const resultPath = path.join(outputDir, "streaming_layer_test_result.md");

const recordingDir = path.resolve("sensor_recordings");
const rawRecordingPaths = Object.fromEntries(
  senses.map((sense) => [sense, path.join(recordingDir, sense, `${sessionId}_raw.md`)])
);

const buttonPresses = new Map([
  [5, "record_volume"],
  [11, "record_volume"],
  [8, "record_touch"],
  [14, "record_touch"],
]);

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function sampleWorldTick(tick) {
  const base = {
    brightness: 0.38 + ((tick % 4) * 0.02),
    volume: 0.32 + ((tick % 3) * 0.03),
    touch: 0.18 + ((tick % 5) * 0.02),
    taste: 0.12 + ((tick % 4) * 0.01),
    smell: 0.20 + ((tick % 6) * 0.02),
  };

  const events = {
    4: { volume: 0.92 },
    6: { volume: 0.30 },
    8: { touch: 0.86, brightness: 0.94 },
    9: { brightness: 0.40, touch: 0.26 },
    12: { taste: 1.00 },
    13: { taste: 0.15 },
    16: { smell: 0.88, volume: 0.84 },
    17: { smell: 0.22, volume: 0.34 },
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
    sensor: sense,
    normalized: value,
    raw_a: round(clamp(value + ((sample.tick % 2 === 0 ? 0.03 : -0.02)))),
    raw_b: round(clamp(value + ((sample.tick % 3 === 0 ? 0.05 : -0.01)))),
    raw_c: round(clamp(value + ((sample.tick % 4 === 0 ? -0.04 : 0.02)))),
    raw_d: round(clamp(value + ((sample.tick % 5 === 0 ? 0.04 : -0.03)))),
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

function renderStreamRow(sample, recording, button) {
  return `| ${[
    sample.tick,
    sample.brightness.toFixed(2),
    sample.volume.toFixed(2),
    sample.touch.toFixed(2),
    sample.taste.toFixed(2),
    sample.smell.toFixed(2),
    button || "-",
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
  `# Streaming World Log: ${sessionId}

This log is appended one artificial world tick at a time. Values are normalized from \`0.0\` to \`1.0\`.

| tick | brightness | volume | touch | taste | smell | button pressed | raw recording on |
| --- | --- | --- | --- | --- | --- | --- | --- |
`
);

await fs.writeFile(
  triggerLogPath,
  `# Compact Trigger Log: ${sessionId}

Compact threshold monitoring stays on for every tick. Raw recording buttons do not affect \`n\`, \`n^-1\`, or \`n^-2\`.

| tick | layer | event type | involved senses | detected value or rate | threshold |
| --- | --- | --- | --- | --- | --- |
`
);

const recording = Object.fromEntries(senses.map((sense) => [sense, false]));
const streamRows = [];
const triggerRows = [];
const rawRowsBySense = Object.fromEntries(senses.map((sense) => [sense, []]));
const rollingBuffer = [];
let previousSample;
let previousChangeDensity = 0;

for (let tick = 1; tick <= 20; tick += 1) {
  const sample = sampleWorldTick(tick);
  rollingBuffer.push(sample);
  while (rollingBuffer.length > bufferLimit) {
    rollingBuffer.shift();
  }
  await writeRollingBuffer(rollingBuffer);

  const button = buttonPresses.get(tick) ?? "";
  if (button) {
    const sense = button.replace("record_", "");
    recording[sense] = !recording[sense];

    if (recording[sense]) {
      rawRowsBySense[sense].push(...rollingBuffer.map((bufferedSample) => rawDetailFor(sense, bufferedSample)));
    }
  }

  const streamRow = renderStreamRow(sample, recording, button);
  streamRows.push({ sample, recording: { ...recording }, button });
  await fs.appendFile(streamLogPath, `${streamRow}\n`);

  const { triggers, changeDensity } = calculateTriggers(sample, previousSample, previousChangeDensity);
  previousSample = sample;
  previousChangeDensity = changeDensity;

  for (const trigger of triggers) {
    triggerRows.push({ ...trigger, recording: { ...recording } });
    await fs.appendFile(triggerLogPath, `${renderTriggerRow(trigger)}\n`);
  }

  for (const sense of senses) {
    if (recording[sense] && button !== `record_${sense}`) {
      rawRowsBySense[sense].push(rawDetailFor(sense, sample));
    }
  }
}

for (const sense of senses) {
  const rows = rawRowsBySense[sense];
  if (rows.length === 0) {
    continue;
  }

  const markdown = `# Raw ${sense} Recording: ${sessionId}

Button: \`record_${sense}\`

This file stores higher-detail artificial raw values copied from the rolling buffer when recording turns on, then appended while this sensor's recording button stays on.

| tick | normalized | raw_a | raw_b | raw_c | raw_d |
| --- | --- | --- | --- | --- | --- |
${rows.map(renderRawRow).join("\n")}
`;

  await fs.writeFile(rawRecordingPaths[sense], markdown);
}

const compactLayers = new Set(triggerRows.map((row) => row.layer));
const rawFilesWritten = senses.filter((sense) => rawRowsBySense[sense].length > 0);
const n2WhileNoRawRecording = triggerRows.some(
  (row) => row.layer === "n-2" && senses.every((sense) => !row.recording[sense])
);
const n2WhileVolumeRecording = triggerRows.some((row) => row.layer === "n-2" && row.recording.volume);
const volumeRawTicks = rawRowsBySense.volume.map((row) => row.tick);
const touchRawTicks = rawRowsBySense.touch.map((row) => row.tick);
const finalBufferTicks = rollingBuffer.map((row) => row.tick);

const checks = [
  ["20 artificial world ticks were appended", streamRows.length === 20],
  ["rolling buffer keeps only the latest 10 ticks", rollingBuffer.length === 10],
  ["old rolling buffer rows disappear by the final tick", finalBufferTicks[0] === 11 && finalBufferTicks.at(-1) === 20],
  ["compact trigger log contains n rows", compactLayers.has("n")],
  ["compact trigger log contains n^-1 rows", compactLayers.has("n-1")],
  ["compact trigger log contains n^-2 rows", compactLayers.has("n-2")],
  ["n^-2 fires while all raw recording buttons are off", n2WhileNoRawRecording],
  ["n^-2 fires while volume raw recording is on", n2WhileVolumeRecording],
  ["record_volume copies the current buffer when it turns on", volumeRawTicks[0] === 1 && volumeRawTicks.includes(5)],
  ["volume raw detail stops after record_volume turns off", volumeRawTicks.at(-1) === 10],
  ["record_touch copies the current buffer when it turns on", touchRawTicks[0] === 1 && touchRawTicks.includes(8)],
  ["touch raw detail stops after record_touch turns off", touchRawTicks.at(-1) === 13],
];

const passed = checks.every(([, ok]) => ok);
const checkRows = checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n");
const rawFileRows = senses
  .map((sense) => {
    const pathLabel =
      rawRowsBySense[sense].length > 0 ? `\`sensor_recordings/${sense}/${sessionId}_raw.md\`` : "-";
    return `| ${sense} | ${rawRowsBySense[sense].length} | ${pathLabel} |`;
  })
  .join("\n");

const resultMarkdown = `# Streaming Layer Test Result

Purpose: prove the model can populate deterministic artificial sensory input over time, keep a capped rolling buffer, keep compact threshold monitors running, and write high-detail raw sensor rows only when a sensor recording button copies or appends them.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| normalized stream log | \`outputs/streaming_world/${sessionId}_stream_log.md\` |
| rolling sensory buffer | \`outputs/streaming_world/${sessionId}_rolling_buffer.md\` |
| compact trigger log | \`outputs/streaming_world/${sessionId}_compact_trigger_log.md\` |

## Raw Recording Files

| sensor | raw rows written | file |
| --- | --- | --- |
${rawFileRows}

## Checks

| check | result |
| --- | --- |
${checkRows}
`;

await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
