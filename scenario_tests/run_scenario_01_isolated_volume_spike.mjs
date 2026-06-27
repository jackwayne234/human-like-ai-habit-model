import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("outputs/scenario_tests");
const outputPath = path.join(outputDir, "scenario_01_isolated_volume_spike_result.md");
const trialsOutputPath = path.join(outputDir, "gate_formula_trial_results.md");

const senses = ["brightness", "volume", "touch", "taste", "smell"];

const modes = {
  curious: {
    name: "curious",
    novelty: 0.70,
    emergencySensitivity: 0.50,
    emergencyWindow: 10,
    resourceDiscipline: 0.40,
    curiosityBudget: 0.70,
    crossSenseWeight: 0.50,
    accelerationWeight: 0.70,
    promotionBase: 0.55,
  },
  danger: {
    name: "danger",
    novelty: 0.65,
    emergencySensitivity: 0.90,
    emergencyWindow: 5,
    resourceDiscipline: 0.65,
    curiosityBudget: 0.20,
    crossSenseWeight: 0.75,
    accelerationWeight: 0.85,
    promotionBase: 0.45,
  },
};

const healthyResources = {
  storage: 0.62,
  ram: 0.48,
  heat: 0.35,
  pressure: 0,
};

const trials = [
  {
    id: "scenario_01_isolated_volume_spike",
    title: "Scenario 1: Isolated Volume Spike",
    mode: modes.curious,
    resources: healthyResources,
    description: "Volume rises from 0.41 to 1.00 at tick 8. Other senses stay quiet.",
    rows: [
      { tick: 1, brightness: 0.30, volume: 0.40, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 2, brightness: 0.30, volume: 0.42, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 3, brightness: 0.30, volume: 0.41, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 4, brightness: 0.30, volume: 0.43, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 5, brightness: 0.30, volume: 0.40, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 6, brightness: 0.30, volume: 0.42, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 7, brightness: 0.30, volume: 0.41, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 8, brightness: 0.30, volume: 1.00, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 9, brightness: 0.30, volume: 0.42, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 10, brightness: 0.30, volume: 0.41, touch: 0.20, taste: 0.10, smell: 0.20 },
    ],
    expect(results) {
      const spike = results.find((row) => row.tick === 8);
      const fall = results.find((row) => row.tick === 9);
      return [
        ["spike is watched", spike.watch === 1],
        ["spike sends compact report upward", spike.sendUpward === 1],
        ["spike does not become episode", spike.episode === 0],
        ["spike does not trigger emergency", spike.emergency === 0],
        ["falling edge does not become episode", fall.episode === 0],
      ];
    },
  },
  {
    id: "scenario_02_cross_sense_impact",
    title: "Scenario 2: Cross-Sense Impact",
    mode: modes.curious,
    resources: healthyResources,
    description: "Volume, brightness, and touch change together at tick 8.",
    rows: [
      { tick: 1, brightness: 0.30, volume: 0.40, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 2, brightness: 0.30, volume: 0.41, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 3, brightness: 0.30, volume: 0.42, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 4, brightness: 0.30, volume: 0.40, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 5, brightness: 0.30, volume: 0.41, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 6, brightness: 0.30, volume: 0.42, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 7, brightness: 0.30, volume: 0.41, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 8, brightness: 0.92, volume: 1.00, touch: 0.82, taste: 0.10, smell: 0.20 },
      { tick: 9, brightness: 0.55, volume: 0.62, touch: 0.45, taste: 0.10, smell: 0.20 },
      { tick: 10, brightness: 0.40, volume: 0.45, touch: 0.25, taste: 0.10, smell: 0.20 },
    ],
    expect(results) {
      const impact = results.find((row) => row.tick === 8);
      return [
        ["impact has cross-sense support", impact.x === 1],
        ["impact sends upward", impact.sendUpward === 1],
        ["impact can become episode", impact.episode === 1],
        ["impact does not need emergency", impact.emergency === 0],
      ];
    },
  },
  {
    id: "scenario_03_repeated_touch_danger",
    title: "Scenario 3: Repeated Touch Danger",
    mode: modes.danger,
    resources: healthyResources,
    description: "Touch repeatedly hits 1.00, enough to open the protective route.",
    rows: [
      { tick: 1, brightness: 0.30, volume: 0.30, touch: 0.20, taste: 0.10, smell: 0.20 },
      { tick: 2, brightness: 0.30, volume: 0.30, touch: 1.00, taste: 0.10, smell: 0.20 },
      { tick: 3, brightness: 0.30, volume: 0.30, touch: 1.00, taste: 0.10, smell: 0.20 },
      { tick: 4, brightness: 0.30, volume: 0.30, touch: 1.00, taste: 0.10, smell: 0.20 },
      { tick: 5, brightness: 0.30, volume: 0.30, touch: 0.85, taste: 0.10, smell: 0.20 },
      { tick: 6, brightness: 0.30, volume: 0.30, touch: 0.45, taste: 0.10, smell: 0.20 },
    ],
    expect(results) {
      const trigger = results.find((row) => row.emergency === 1);
      return [
        ["emergency route opens", Boolean(trigger)],
        ["emergency opens by tick 3", Boolean(trigger && trigger.tick <= 3)],
        ["emergency sends upward", Boolean(trigger && trigger.sendUpward === 1)],
        ["touch danger can become episode", Boolean(trigger && trigger.episode === 1)],
      ];
    },
  },
];

function round(value) {
  return Math.round(value * 100) / 100;
}

function hitsInEmergencyWindow(results, tick, sense, mode) {
  const start = tick - mode.emergencyWindow + 1;
  return results
    .filter((row) => row.tick >= start && row.tick <= tick)
    .reduce((sum, row) => sum + row.n[sense], 0);
}

function runTrial(trial) {
  const results = [];

  for (let index = 0; index < trial.rows.length; index += 1) {
    const current = trial.rows[index];
    const previous = trial.rows[index - 1];

    const n = Object.fromEntries(senses.map((sense) => [sense, current[sense] === 1 ? 1 : 0]));
    const d = Object.fromEntries(
      senses.map((sense) => [
        sense,
        previous && Math.abs(current[sense] - previous[sense]) >= 0.5 ? 1 : 0,
      ])
    );

    const nDensity = senses.reduce((sum, sense) => sum + n[sense], 0) / senses.length;
    const dDensity = senses.reduce((sum, sense) => sum + d[sense], 0) / senses.length;
    const activeSenseChanges = senses.reduce((sum, sense) => sum + d[sense], 0);
    const x = activeSenseChanges >= 2 ? 1 : 0;
    const changeDensity = (activeSenseChanges + x) / 6;
    const previousChangeDensity = results[index - 1]?.changeDensity ?? 0;
    const a = index > 0 && Math.abs(changeDensity - previousChangeDensity) > 0 ? 1 : 0;

    const routeScore = Math.min(
      1,
      nDensity +
        dDensity +
        x * trial.mode.crossSenseWeight +
        a * trial.mode.accelerationWeight +
        trial.mode.novelty * a
    );

    const watchThreshold = Math.max(
      0.15,
      0.35 +
        trial.resources.pressure * trial.mode.resourceDiscipline -
        trial.mode.curiosityBudget * 0.15
    );
    const promoteThreshold = Math.min(
      0.95,
      trial.mode.promotionBase +
        trial.resources.pressure * trial.mode.resourceDiscipline -
        trial.mode.curiosityBudget * 0.10
    );
    const emergencyRequiredHits = Math.max(
      1,
      Math.ceil(trial.mode.emergencyWindow * (1 - trial.mode.emergencySensitivity))
    );

    const emergency = senses.some(
      (sense) =>
        hitsInEmergencyWindow(results, current.tick, sense, trial.mode) + n[sense] >=
        emergencyRequiredHits
    )
      ? 1
      : 0;
    const watch = routeScore >= watchThreshold ? 1 : 0;
    const promote = routeScore >= promoteThreshold ? 1 : 0;

    const repeatedEvidence = activeSenseChanges >= 1 && a === 0 && results[index - 1]?.watch === 1;
    const executiveConfirm = 0;
    const episode =
      promote && (x === 1 || repeatedEvidence || emergency === 1 || executiveConfirm === 1) ? 1 : 0;
    const sendUpward = watch || promote || episode || emergency ? 1 : 0;
    const ignore = sendUpward ? 0 : 1;

    results.push({
      tick: current.tick,
      volume: current.volume,
      touch: current.touch,
      n,
      d,
      nDensity,
      dDensity,
      x,
      changeDensity,
      a,
      routeScore,
      ignore,
      watch,
      promote,
      episode,
      emergency,
      sendUpward,
    });
  }

  const checks = trial.expect(results);
  return {
    trial,
    results,
    checks,
    passed: checks.every(([, passed]) => passed),
  };
}

function renderTrial(result) {
  const tableRows = result.results
    .map((row) =>
      [
        row.tick,
        row.volume.toFixed(2),
        row.touch.toFixed(2),
        row.n.volume,
        row.n.touch,
        row.d.volume,
        row.d.touch,
        row.x,
        row.a,
        round(row.routeScore).toFixed(2),
        row.ignore,
        row.watch,
        row.promote,
        row.episode,
        row.emergency,
        row.sendUpward,
      ].join(" | ")
    )
    .map((row) => `| ${row} |`)
    .join("\n");

  const checkRows = result.checks
    .map(([name, passed]) => `| ${name} | ${passed ? "PASS" : "FAIL"} |`)
    .join("\n");

  return `## ${result.trial.title}

${result.trial.description}

| field | value |
| --- | --- |
| mode | \`${result.trial.mode.name}\` |
| resources | storage ${result.trial.resources.storage}, RAM ${result.trial.resources.ram}, heat ${result.trial.resources.heat}, pressure ${result.trial.resources.pressure} |
| verdict | ${result.passed ? "PASS" : "FAIL"} |

| check | result |
| --- | --- |
${checkRows}

| tick | volume | touch | n_v | n_to | d_v | d_to | x | a | score | ignore | watch | promote | episode | emerg | up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${tableRows}
`;
}

const trialResults = trials.map(runTrial);
const allPassed = trialResults.every((result) => result.passed);

const markdown = `# Gate Formula Trial Results

Purpose: test the adjusted deterministic gate formula after Scenario 1 showed that isolated \`n^-2\` acceleration was creating episodes too easily.

Adjusted episode rule:

\`\`\`text
episode = promote AND (
  cross-sense support
  OR repeated evidence
  OR emergency/protective relevance
  OR explicit Builder / Critic confirmation
)
\`\`\`

This lets \`n^-2\` acceleration produce \`watch\` or \`send_upward\` without allowing one unsupported sensory spike to become an episode by itself.

Overall verdict: ${allPassed ? "PASS" : "FAIL"}

${trialResults.map(renderTrial).join("\n")}
`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(trialsOutputPath, markdown);
await fs.writeFile(outputPath, markdown);
console.log(trialsOutputPath);
console.log(allPassed ? "PASS" : "FAIL");
