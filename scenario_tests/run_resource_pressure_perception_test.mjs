import fs from "node:fs/promises";
import path from "node:path";

const senses = ["brightness", "volume", "touch", "taste", "smell"];
const sessionId = "resource_pressure_session_001";
const totalTicks = 60;
const outputDir = path.resolve("outputs/resource_pressure");
const decisionLogPath = path.join(outputDir, `${sessionId}_executive_decision_log.md`);
const resourceTracePath = path.join(outputDir, `${sessionId}_resource_trace.md`);
const resultPath = path.join(outputDir, `${sessionId}_result.md`);

const resourceLimit = 80;
const rawFallbackTicks = 4;

function clamp(value) {
  return Math.max(0, Math.min(100, value));
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
    14: { brightness: 1.0 },
    15: { brightness: 0.42 },
    21: { touch: 0.86, volume: 0.88 },
    22: { touch: 0.26, volume: 0.32 },
    31: { taste: 1.0, smell: 0.80 },
    32: { taste: 0.12, smell: 0.24 },
    43: { brightness: 0.92, volume: 0.91, touch: 0.84 },
    44: { brightness: 0.38, volume: 0.36, touch: 0.24 },
    55: { smell: 1.0 },
    56: { smell: 0.22 },
  };

  const sample = { tick, ...base, ...(events[tick] ?? {}) };
  return Object.fromEntries(
    Object.entries(sample).map(([key, value]) => [key, key === "tick" ? value : round(Math.max(0, Math.min(1, value)))])
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
        senses: [sense],
        value: sample[sense],
      });
    }
  }

  const deltas = Object.fromEntries(
    senses.map((sense) => [sense, previousSample ? round(Math.abs(sample[sense] - previousSample[sense])) : 0])
  );
  const changedSenses = senses.filter((sense) => deltas[sense] >= 0.5);

  for (const sense of changedSenses) {
    triggers.push({
      tick: sample.tick,
      layer: "n-1",
      event: "rate_of_change_within_sensor",
      senses: [sense],
      value: deltas[sense],
    });
  }

  if (changedSenses.length >= 2) {
    triggers.push({
      tick: sample.tick,
      layer: "n-1",
      event: "rate_of_change_between_sensors",
      senses: changedSenses,
      value: changedSenses.length,
    });
  }

  const crossSense = changedSenses.length >= 2 ? 1 : 0;
  const changeDensity = round((changedSenses.length + crossSense) / 6);

  if (previousSample && Math.abs(changeDensity - previousChangeDensity) > 0) {
    triggers.push({
      tick: sample.tick,
      layer: "n-2",
      event: "rate_of_rate_change",
      senses: ["compact_trigger_stream"],
      value: round(Math.abs(changeDensity - previousChangeDensity)),
    });
  }

  return { triggers, changeDensity };
}

function compactNotice(triggers) {
  if (triggers.length === 0) {
    return "quiet compact tick";
  }

  const layers = [...new Set(triggers.map((trigger) => trigger.layer))].join(", ");
  const involvedSenses = [
    ...new Set(triggers.flatMap((trigger) => trigger.senses).filter((sense) => senses.includes(sense))),
  ];
  return `${layers} noticed${involvedSenses.length ? ` for ${involvedSenses.join(", ")}` : ""}`;
}

function eventJustifiesRaw(triggers) {
  const hasDirectThreshold = triggers.some((trigger) => trigger.layer === "n");
  const hasCrossSense = triggers.some((trigger) => trigger.event === "rate_of_change_between_sensors");
  const changedSenseCount = new Set(triggers.flatMap((trigger) => trigger.senses).filter((sense) => senses.includes(sense))).size;
  const hasAcceleration = triggers.some((trigger) => trigger.layer === "n-2");

  return hasDirectThreshold || hasCrossSense || (hasAcceleration && changedSenseCount >= 2);
}

function createResources() {
  return {
    storage: 24,
    workingMemory: 22,
    computeLoad: 20,
    heat: 18,
    powerUsed: 20,
  };
}

function applyRecovery(resources) {
  resources.workingMemory = clamp(resources.workingMemory - 3.8);
  resources.computeLoad = clamp(resources.computeLoad - 4.4);
  resources.heat = clamp(resources.heat - 2.9);
}

function applyCompactRead(resources, triggerCount) {
  resources.storage = clamp(resources.storage + 0.02 * triggerCount);
  resources.workingMemory = clamp(resources.workingMemory + 0.2 + 0.04 * triggerCount);
  resources.computeLoad = clamp(resources.computeLoad + 0.25 + 0.05 * triggerCount);
  resources.heat = clamp(resources.heat + 0.08 + 0.03 * triggerCount);
  resources.powerUsed = clamp(resources.powerUsed + 0.12 + 0.02 * triggerCount);
}

function applyRawRecording(resources, senseCount) {
  resources.storage = clamp(resources.storage + 1.15 * senseCount);
  resources.workingMemory = clamp(resources.workingMemory + 0.7 * senseCount);
  resources.computeLoad = clamp(resources.computeLoad + 0.45 * senseCount);
  resources.heat = clamp(resources.heat + 0.35 * senseCount);
  resources.powerUsed = clamp(resources.powerUsed + 0.3 * senseCount);
}

function applyRawInspection(resources, senseCount) {
  resources.workingMemory = clamp(resources.workingMemory + 2.8 * senseCount);
  resources.computeLoad = clamp(resources.computeLoad + 2.2 * senseCount);
  resources.heat = clamp(resources.heat + 1.6 * senseCount);
  resources.powerUsed = clamp(resources.powerUsed + 0.9 * senseCount);
}

function applyRawAnalysis(resources, senseCount) {
  resources.storage = clamp(resources.storage + 0.35 * senseCount);
  resources.workingMemory = clamp(resources.workingMemory + 1.3 * senseCount);
  resources.computeLoad = clamp(resources.computeLoad + 3.1 * senseCount);
  resources.heat = clamp(resources.heat + 2.6 * senseCount);
  resources.powerUsed = clamp(resources.powerUsed + 1.1 * senseCount);
}

function pressure(resources) {
  return Math.max(
    resources.storage,
    resources.workingMemory,
    resources.computeLoad,
    resources.heat,
    resources.powerUsed
  );
}

function resourceSummary(resources) {
  return `storage ${round(resources.storage)}%, RAM ${round(resources.workingMemory)}%, compute ${round(
    resources.computeLoad
  )}%, heat ${round(resources.heat)}%, power ${round(resources.powerUsed)}%`;
}

function runPolicy(policyName, policyKind, ticks) {
  const resources = createResources();
  const decisionRows = [];
  const traceRows = [];
  const stats = {
    compactTicks: 0,
    requestedRawTicks: 0,
    rawTicks: 0,
    fallbackTicks: 0,
    forcedFallbacks: 0,
    justifiedRawTicks: 0,
    unjustifiedRawTicks: 0,
    maxPressure: 0,
    firstOverloadTick: null,
  };
  let fallbackRemaining = 0;

  for (const tickState of ticks) {
    applyRecovery(resources);

    const compactIsRead = true;
    applyCompactRead(resources, tickState.triggers.length);
    stats.compactTicks += 1;

    const justified = eventJustifiesRaw(tickState.triggers);
    let action = "compact_read";
    let rawSenseCount = 0;
    let reason = compactNotice(tickState.triggers);
    const wantsRaw = policyKind === "raw_hungry" || (policyKind === "compact_first" && justified);
    if (wantsRaw) {
      stats.requestedRawTicks += 1;
    }

    if (fallbackRemaining > 0) {
      fallbackRemaining -= 1;
      action = "forced_compact_fallback";
      stats.fallbackTicks += 1;
      reason = "resource pressure locked raw access; compact logs remain available";
    } else if (policyKind === "compact_first" && justified) {
      rawSenseCount = Math.max(
        1,
        new Set(tickState.triggers.flatMap((trigger) => trigger.senses).filter((sense) => senses.includes(sense))).size
      );
      action = "selective_raw_window";
      reason = "compact trigger was strong enough to justify raw detail";
    } else if (policyKind === "raw_hungry") {
      rawSenseCount = senses.length;
      action = "raw_inspect_analyze_all";
      reason = justified ? "raw-heavy policy opened all sensors after a real notice" : "raw-heavy policy opened all sensors without compact need";
    }

    if (rawSenseCount > 0) {
      applyRawRecording(resources, rawSenseCount);
      applyRawInspection(resources, rawSenseCount);
      applyRawAnalysis(resources, rawSenseCount);
      stats.rawTicks += 1;
      if (justified) {
        stats.justifiedRawTicks += 1;
      } else {
        stats.unjustifiedRawTicks += 1;
      }
    }

    const currentPressure = pressure(resources);
    if (currentPressure >= resourceLimit) {
      stats.forcedFallbacks += 1;
      stats.firstOverloadTick ??= tickState.tick;
      fallbackRemaining = rawFallbackTicks;
      action = rawSenseCount > 0 ? `${action}_then_pressure_fallback` : action;
    }

    stats.maxPressure = Math.max(stats.maxPressure, currentPressure);

    decisionRows.push({
      policyName,
      tick: tickState.tick,
      action,
      compactIsRead,
      rawSenseCount,
      triggerCount: tickState.triggers.length,
      pressure: currentPressure,
      reason,
    });
    traceRows.push({
      policyName,
      tick: tickState.tick,
      ...resources,
      pressure: currentPressure,
    });
  }

  stats.compactShare = stats.compactTicks / totalTicks;
  stats.requestedRawShare = stats.requestedRawTicks / totalTicks;
  stats.rawShare = stats.rawTicks / totalTicks;
  stats.stable = stats.maxPressure < resourceLimit && stats.forcedFallbacks === 0;
  return { policyName, decisionRows, traceRows, stats };
}

function renderDecisionRow(row) {
  return `| ${[
    row.policyName,
    row.tick,
    row.action,
    row.triggerCount,
    row.rawSenseCount,
    `${round(row.pressure)}%`,
    row.reason,
  ].join(" | ")} |`;
}

function renderTraceRow(row) {
  return `| ${[
    row.policyName,
    row.tick,
    `${round(row.storage)}%`,
    `${round(row.workingMemory)}%`,
    `${round(row.computeLoad)}%`,
    `${round(row.heat)}%`,
    `${round(row.powerUsed)}%`,
    `${round(row.pressure)}%`,
  ].join(" | ")} |`;
}

function renderStatsRow(result) {
  const { stats } = result;
  return `| ${[
    result.policyName,
    stats.stable ? "yes" : "no",
    `${round(stats.compactShare * 100)}%`,
    `${round(stats.requestedRawShare * 100)}%`,
    `${round(stats.rawShare * 100)}%`,
    stats.justifiedRawTicks,
    stats.unjustifiedRawTicks,
    stats.forcedFallbacks,
    stats.firstOverloadTick ?? "-",
    `${round(stats.maxPressure)}%`,
  ].join(" | ")} |`;
}

await fs.mkdir(outputDir, { recursive: true });

const ticks = [];
let previousSample;
let previousChangeDensity = 0;
for (let tick = 1; tick <= totalTicks; tick += 1) {
  const sample = sampleWorldTick(tick);
  const { triggers, changeDensity } = calculateTriggers(sample, previousSample, previousChangeDensity);
  previousSample = sample;
  previousChangeDensity = changeDensity;
  ticks.push({ tick, sample, triggers });
}

const compactFirst = runPolicy("compact_first_executive", "compact_first", ticks);
const rawHungry = runPolicy("raw_hungry_executive", "raw_hungry", ticks);
const results = [compactFirst, rawHungry];

const checks = [
  ["compact-first executive reads compact logs on every tick", compactFirst.stats.compactTicks === totalTicks],
  ["compact-first executive uses compact logs at least 80% of the time", compactFirst.stats.compactShare >= 0.8],
  ["compact-first executive opens raw detail selectively", compactFirst.stats.rawTicks > 0 && compactFirst.stats.rawShare <= 0.2],
  ["compact-first raw opens are justified by compact evidence", compactFirst.stats.unjustifiedRawTicks === 0],
  ["compact-first executive stays below resource danger", compactFirst.stats.stable],
  ["raw-heavy executive requests raw detail as normal perception", rawHungry.stats.requestedRawShare > 0.8],
  ["raw-heavy executive hits physical pressure", rawHungry.stats.maxPressure >= resourceLimit],
  ["raw-heavy executive is forced back to compact perception", rawHungry.stats.forcedFallbacks > 0],
];
const passed = checks.every(([, ok]) => ok);

await fs.writeFile(
  decisionLogPath,
  `# Executive Decision Log: ${sessionId}

This log compares two policies on the same 60-tick stream. Both can read compact \`n\`, \`n^-1\`, and \`n^-2\` output. Raw recording, raw inspection, and raw analysis add physical resource cost.

| policy | tick | action | compact trigger rows | raw senses opened | pressure | reason |
| --- | --- | --- | --- | --- | --- | --- |
${results.flatMap((result) => result.decisionRows).map(renderDecisionRow).join("\n")}
`
);

await fs.writeFile(
  resourceTracePath,
  `# Resource Trace: ${sessionId}

The danger marker is ${resourceLimit}%. Storage accumulates. Working memory, compute, and heat recover slightly each tick, but raw inspection and raw analysis can outrun recovery.

| policy | tick | storage | RAM / working memory | compute | heat | power used | max pressure |
| --- | --- | --- | --- | --- | --- | --- | --- |
${results.flatMap((result) => result.traceRows).map(renderTraceRow).join("\n")}
`
);

const resultMarkdown = `# Resource-Pressure Perception Test

Purpose: prove that compact \`n\`, \`n^-1\`, and \`n^-2\` logs can function as normal perception because raw recording, inspection, and analysis are physically expensive.

Verdict: ${passed ? "PASS" : "FAIL"}

| artifact | path |
| --- | --- |
| executive decision log | \`outputs/resource_pressure/${sessionId}_executive_decision_log.md\` |
| resource trace | \`outputs/resource_pressure/${sessionId}_resource_trace.md\` |

## Resource Costs

| action | resource effect |
| --- | --- |
| compact log read | very small RAM, compute, heat, power cost; tiny storage only when triggers exist |
| raw recording | storage cost plus small active resource cost per open sensor |
| raw inspection | RAM / working memory and compute cost per open sensor |
| raw analysis | larger compute, heat, RAM, power, and summary-storage cost |
| forced fallback | raw access closes for ${rawFallbackTicks} ticks; compact logs remain visible |

## Policy Results

| policy | stable under 80% | compact-log ticks | raw-detail requests | raw-detail ticks allowed | justified raw ticks | unjustified raw ticks | forced fallbacks | first overload tick | max pressure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${results.map(renderStatsRow).join("\n")}

## Interpretation

The compact-first executive keeps ordinary perception on the compact trigger stream for ${round(
  compactFirst.stats.compactShare * 100
)}% of ticks and opens raw logs only on ${compactFirst.stats.rawTicks} justified ticks. Its highest resource pressure is ${round(
  compactFirst.stats.maxPressure
)}%, below the ${resourceLimit}% danger marker.

The raw-heavy executive requests raw inspection and analysis as normal perception on ${round(
  rawHungry.stats.requestedRawShare * 100
)}% of ticks. Physical pressure allows only ${round(
  rawHungry.stats.rawShare * 100
)}% of ticks to actually run raw detail before fallback. It reaches ${round(
  rawHungry.stats.maxPressure
)}% pressure, trips forced fallback ${rawHungry.stats.forcedFallbacks} times, and therefore cannot stay stable by living in raw data.

## Checks

| check | result |
| --- | --- |
${checks.map(([name, ok]) => `| ${name} | ${ok ? "PASS" : "FAIL"} |`).join("\n")}

## Design Result

Compact logs are not preferred by policy alone. They are the only perception channel cheap enough to keep open continuously. Raw logs remain useful, but only as selective tools for surprise, danger, contradiction, or repair.

Final compact-first resource state: ${resourceSummary(compactFirst.traceRows.at(-1))}

Final raw-heavy resource state: ${resourceSummary(rawHungry.traceRows.at(-1))}
`;

await fs.writeFile(resultPath, resultMarkdown);

console.log(resultPath);
console.log(passed ? "PASS" : "FAIL");
