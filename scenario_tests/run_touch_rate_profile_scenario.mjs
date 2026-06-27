import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/touch_rate_profiles");
const profileLogPath = path.join(outputDir, "touch_rate_profile_log.md");
const interpretationPath = path.join(outputDir, "touch_rate_profile_interpretation.md");
const resultPath = path.join(outputDir, "touch_rate_profile_result.md");

const profiles = [
  {
    id: "gradual_warm_surface",
    label: "something gradually becoming hot",
    touch: [0.12, 0.18, 0.26, 0.36, 0.48, 0.60, 0.72, 0.84, 0.92, 1.00],
  },
  {
    id: "hot_stove_contact",
    label: "touching a hot stove",
    touch: [0.14, 0.16, 0.18, 0.20, 0.22, 1.00, 0.30, 0.20, 0.16, 0.14],
  },
  {
    id: "sharp_object_contact",
    label: "touching a sharp object",
    touch: [0.12, 0.13, 0.14, 0.15, 0.16, 1.00, 0.10, 0.08, 0.08, 0.08],
  },
];

function round(value) {
  return Math.round(value * 100) / 100;
}

function calculateTouchFeatures(profile) {
  const rows = [];
  let previousChange = 0;

  for (let index = 0; index < profile.touch.length; index += 1) {
    const tick = index + 1;
    const value = profile.touch[index];
    const previous = profile.touch[index - 1];
    const change = previous === undefined ? 0 : round(value - previous);
    const absoluteChange = Math.abs(change);
    const n = value === 1 ? 1 : 0;
    const n1 = absoluteChange >= 0.5 ? 1 : 0;
    const n2 = index > 0 && Math.abs(absoluteChange - previousChange) > 0.4 ? 1 : 0;

    rows.push({
      profile: profile.id,
      tick,
      touch: value,
      change,
      absoluteChange: round(absoluteChange),
      n,
      n1,
      n2,
    });

    previousChange = absoluteChange;
  }

  const maxRise = Math.max(...rows.map((row) => row.change));
  const maxFall = Math.abs(Math.min(...rows.map((row) => row.change)));
  const maxAbsoluteChange = Math.max(...rows.map((row) => row.absoluteChange));
  const n1Hits = rows.filter((row) => row.n1 === 1).length;
  const n2Hits = rows.filter((row) => row.n2 === 1).length;
  const maxTick = rows.find((row) => row.n === 1)?.tick ?? "-";

  let interpretation;
  if (maxRise < 0.5 && rows.some((row) => row.n === 1)) {
    interpretation = "gradual heat or pressure buildup";
  } else if (maxRise >= 0.75 && maxFall >= 0.75) {
    interpretation = "sharp object or very brief painful contact";
  } else if (maxRise >= 0.7 && maxFall < 0.75) {
    interpretation = "hot stove or sudden hot-surface contact";
  } else {
    interpretation = "unlabeled touch event";
  }

  return {
    rows,
    summary: {
      profile: profile.id,
      label: profile.label,
      maxTick,
      maxRise: round(maxRise),
      maxFall: round(maxFall),
      maxAbsoluteChange: round(maxAbsoluteChange),
      n1Hits,
      n2Hits,
      interpretation,
    },
  };
}

function renderProfileRow(row) {
  return `| ${[
    row.profile,
    row.tick,
    row.touch.toFixed(2),
    row.change.toFixed(2),
    row.absoluteChange.toFixed(2),
    row.n,
    row.n1,
    row.n2,
  ].join(" | ")} |`;
}

function renderSummaryRow(summary) {
  return `| ${[
    summary.profile,
    summary.label,
    summary.maxTick,
    summary.maxRise.toFixed(2),
    summary.maxFall.toFixed(2),
    summary.n1Hits,
    summary.n2Hits,
    summary.interpretation,
  ].join(" | ")} |`;
}

await fs.mkdir(outputDir, { recursive: true });

const results = profiles.map(calculateTouchFeatures);
const rows = results.flatMap((result) => result.rows);
const summaries = results.map((result) => result.summary);

const checks = [
  [
    "gradual profile reaches max touch without n^-1 spike",
    summaries.find((summary) => summary.profile === "gradual_warm_surface").n1Hits === 0,
  ],
  [
    "hot stove profile has sudden rise but smaller fall than sharp object",
    summaries.find((summary) => summary.profile === "hot_stove_contact").maxRise >= 0.7 &&
      summaries.find((summary) => summary.profile === "hot_stove_contact").maxFall < 0.75,
  ],
  [
    "sharp object profile has sudden rise and sudden fall",
    summaries.find((summary) => summary.profile === "sharp_object_contact").maxRise >= 0.75 &&
      summaries.find((summary) => summary.profile === "sharp_object_contact").maxFall >= 0.75,
  ],
  [
    "rate profile separates the three interpretations",
    new Set(summaries.map((summary) => summary.interpretation)).size === 3,
  ],
];
const passed = checks.every(([, ok]) => ok);

const profileMarkdown = `# Touch Rate Profile Log

Purpose: show how the rate of touch change can separate gradual heat, hot-stove contact, and sharp-object contact even when touch eventually reaches max.

| profile | tick | touch | signed change | absolute change | n | n^-1 | n^-2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.map(renderProfileRow).join("\n")}
`;

const interpretationMarkdown = `# Touch Rate Profile Interpretation

| profile | teacher label | tick at n max | max rise | max fall | n^-1 hits | n^-2 hits | compact interpretation |
| --- | --- | --- | --- | --- | --- | --- | --- |
${summaries.map(renderSummaryRow).join("\n")}

## Rule Sketch

| pattern | likely meaning |
| --- | --- |
| touch rises slowly toward max with no one-tick n^-1 spike | gradual heat or pressure buildup |
| touch jumps rapidly upward to max, then drops but not instantly below baseline | hot stove or sudden hot-surface contact |
| touch jumps rapidly upward and rapidly falls away | sharp object or very brief painful contact |
`;

const resultMarkdown = `# Touch Rate Profile Result

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| profile log | \`outputs/touch_rate_profiles/touch_rate_profile_log.md\` |
| interpretation | \`outputs/touch_rate_profiles/touch_rate_profile_interpretation.md\` |

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}
`;

await fs.writeFile(profileLogPath, profileMarkdown);
await fs.writeFile(interpretationPath, interpretationMarkdown);
await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
