import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/scenario_tests");
const outputPath = path.join(outputDir, "recording_button_control_result.md");

const senses = ["brightness", "volume", "touch", "taste", "smell"];

const rows = [
  { tick: 1, brightness: 0.30, volume: 0.30, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 2, brightness: 0.30, volume: 0.30, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 3, brightness: 0.30, volume: 0.95, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 4, brightness: 0.30, volume: 0.35, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 5, brightness: 0.30, volume: 0.35, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 6, brightness: 0.30, volume: 0.35, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 7, brightness: 0.30, volume: 0.92, touch: 0.20, taste: 0.10, smell: 0.20 },
  { tick: 8, brightness: 0.30, volume: 0.34, touch: 0.20, taste: 0.10, smell: 0.20 },
];

const buttonPresses = new Map([
  [3, "record_volume"],
  [5, "record_volume"],
]);

const recording = Object.fromEntries(senses.map((sense) => [sense, false]));
const outputRows = [];
let previousChangeDensity = 0;

for (let index = 0; index < rows.length; index += 1) {
  const current = rows[index];
  const previous = rows[index - 1];
  const pressed = buttonPresses.get(current.tick) ?? "";

  if (pressed === "record_volume") {
    recording.volume = !recording.volume;
  }

  const d = Object.fromEntries(
    senses.map((sense) => [
      sense,
      previous && Math.abs(current[sense] - previous[sense]) >= 0.5 ? 1 : 0,
    ])
  );
  const activeSenseChanges = senses.reduce((sum, sense) => sum + d[sense], 0);
  const x = activeSenseChanges >= 2 ? 1 : 0;
  const changeDensity = (activeSenseChanges + x) / 6;
  const n2 = index > 0 && Math.abs(changeDensity - previousChangeDensity) > 0 ? 1 : 0;
  previousChangeDensity = changeDensity;

  outputRows.push({
    tick: current.tick,
    volume: current.volume,
    pressed,
    volumeRecording: recording.volume ? 1 : 0,
    dVolume: d.volume,
    n2,
  });
}

const n2WhileRecordingOff = outputRows.some((row) => row.n2 === 1 && row.volumeRecording === 0);
const n2WhileRecordingOn = outputRows.some((row) => row.n2 === 1 && row.volumeRecording === 1);
const volumeToggledOn = outputRows.some((row) => row.tick === 3 && row.volumeRecording === 1);
const volumeToggledOff = outputRows.some((row) => row.tick === 5 && row.volumeRecording === 0);
const passed = n2WhileRecordingOff && n2WhileRecordingOn && volumeToggledOn && volumeToggledOff;

const tableRows = outputRows
  .map((row) =>
    [
      row.tick,
      row.volume.toFixed(2),
      row.pressed || "-",
      row.volumeRecording,
      row.dVolume,
      row.n2,
    ].join(" | ")
  )
  .map((row) => `| ${row} |`)
  .join("\n");

const markdown = `# Recording Button Control Test

Purpose: verify that raw sensor recording buttons only toggle full raw recording, while compact threshold monitoring keeps running.

Control surface under test:

| button | behavior |
| --- | --- |
| \`record_brightness\` | Toggle brightness raw recording. |
| \`record_volume\` | Toggle volume raw recording. |
| \`record_touch\` | Toggle touch raw recording. |
| \`record_taste\` | Toggle taste raw recording. |
| \`record_smell\` | Toggle smell raw recording. |

Expected behavior:

- Pressing \`record_volume\` at tick 3 turns volume raw recording on.
- Pressing \`record_volume\` again at tick 5 turns volume raw recording off.
- \`n^-2\` still fires from compact threshold changes whether volume raw recording is on or off.

Verdict: ${passed ? "PASS" : "FAIL"}

| tick | volume | button pressed | volume recording | d_volume | n^-2 |
| --- | --- | --- | --- | --- | --- |
${tableRows}

## Checks

| check | result |
| --- | --- |
| volume toggled on at tick 3 | ${volumeToggledOn ? "PASS" : "FAIL"} |
| volume toggled off at tick 5 | ${volumeToggledOff ? "PASS" : "FAIL"} |
| \`n^-2\` fired while raw recording was on | ${n2WhileRecordingOn ? "PASS" : "FAIL"} |
| \`n^-2\` fired while raw recording was off | ${n2WhileRecordingOff ? "PASS" : "FAIL"} |
`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(outputPath, markdown);
console.log(outputPath);
console.log(passed ? "PASS" : "FAIL");
