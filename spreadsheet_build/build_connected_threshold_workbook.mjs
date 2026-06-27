import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workbook = Workbook.create();
const compact = workbook.worksheets.add("00 Compact View");
const sensory = workbook.worksheets.add("01 Sensory Input");
const thresholdN = workbook.worksheets.add("02a n");
const thresholdN1 = workbook.worksheets.add("02b n^-1");
const thresholdN2 = workbook.worksheets.add("02c n^-2");
const review = workbook.worksheets.add("03 Summary");

const sampleDir = path.resolve("../sensory_stream_samples");
const outputDir = path.resolve("../outputs/connected_spreadsheet_test");
const outputPath = path.join(outputDir, "connected_sensory_threshold_gate_test.xlsx");
const senses = [
  ["b", "brightness"],
  ["v", "volume"],
  ["to", "touch"],
  ["ta", "taste"],
  ["s", "smell"],
];

function parseRows(markdown, sampleId) {
  const rows = [];
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("| ") || line.startsWith("| tick") || line.startsWith("| ---")) continue;
    const parts = line
      .slice(1, -1)
      .split("|")
      .map((part) => part.trim());
    rows.push([
      sampleId,
      Number(parts[0]),
      Number(parts[1]),
      Number(parts[2]),
      Number(parts[3]),
      Number(parts[4]),
      Number(parts[5]),
    ]);
  }
  return rows;
}

function styleTitle(sheet, range, title, subtitle) {
  const titleRange = sheet.getRange(range);
  titleRange.merge();
  titleRange.values = [[title]];
  titleRange.format.fill.color = "#1F2937";
  titleRange.format.font.color = "#FFFFFF";
  titleRange.format.font.bold = true;
  titleRange.format.font.size = 14;
  titleRange.format.rowHeightPx = 26;

  const endColumn = range.split(":")[1].replace(/[0-9]/g, "");
  const subtitleRange = sheet.getRange(`A2:${endColumn}2`);
  subtitleRange.merge();
  subtitleRange.values = [[subtitle]];
  subtitleRange.format.fill.color = "#E5E7EB";
  subtitleRange.format.font.color = "#111827";
  subtitleRange.format.rowHeightPx = 24;
}

function styleHeader(range) {
  range.format.fill.color = "#D1FAE5";
  range.format.font.bold = true;
  range.format.borders = { preset: "outside", style: "thin", color: "#9CA3AF" };
}

function finishSheet(sheet, usedRange, narrowRange) {
  sheet.getRange(usedRange).format.autofitColumns();
  sheet.getRange(narrowRange).format.columnWidthPx = 42;
  sheet.freezePanes.freezeRows(5);
  sheet.showGridLines = false;
}

const sampleFiles = (await fs.readdir(sampleDir))
  .filter((name) => name.endsWith(".md") && name.startsWith("sample_"))
  .sort();

const inputRows = [];
for (const file of sampleFiles) {
  const markdown = await fs.readFile(path.join(sampleDir, file), "utf8");
  const title = markdown.match(/^# Sample (\d+):/m);
  const sampleId = title ? Number(title[1]) : inputRows.length + 1;
  inputRows.push(...parseRows(markdown, sampleId));
}

const dataEnd = inputRows.length + 5;

styleTitle(
  sensory,
  "A1:G1",
  "01 Sensory Input",
  "Rows replace the live stream for this test. Values stay numeric."
);
sensory.getRange("A3:B4").values = [
  ["n", 1],
  ["n^-1", 0.5],
];
sensory.getRange("A5:G5").values = [["sample", "tick", "b", "v", "to", "ta", "s"]];
sensory.getRange(`A6:G${dataEnd}`).values = inputRows;
styleHeader(sensory.getRange("A5:G5"));
sensory.getRange(`C6:G${dataEnd}`).format.numberFormat = [["0.00"]];
finishSheet(sensory, "A:G", "A:G");

styleTitle(
  thresholdN,
  "A1:G1",
  "02a n",
  "Current tick only. Each sense outputs 1 when its value equals 1, otherwise 0."
);
thresholdN.getRange("A3:B3").values = [["n", 1]];
thresholdN.getRange("A5:G5").values = [["sample", "tick", "b", "v", "to", "ta", "s"]];
styleHeader(thresholdN.getRange("A5:G5"));
const nRows = [];
for (let i = 0; i < inputRows.length; i += 1) {
  const row = i + 6;
  nRows.push([
    `='01 Sensory Input'!A${row}`,
    `='01 Sensory Input'!B${row}`,
    `=--('01 Sensory Input'!C${row}=$B$3)`,
    `=--('01 Sensory Input'!D${row}=$B$3)`,
    `=--('01 Sensory Input'!E${row}=$B$3)`,
    `=--('01 Sensory Input'!F${row}=$B$3)`,
    `=--('01 Sensory Input'!G${row}=$B$3)`,
  ]);
}
thresholdN.getRange(`A6:G${dataEnd}`).formulas = nRows;
finishSheet(thresholdN, "A:G", "A:G");

styleTitle(
  thresholdN1,
  "A1:H1",
  "02b n^-1",
  "One-tick change. Sense columns output 1 when absolute change is at least 0.5. x outputs 1 when two or more senses hit."
);
thresholdN1.getRange("A3:B3").values = [["n^-1", 0.5]];
thresholdN1.getRange("A5:H5").values = [["sample", "tick", "b", "v", "to", "ta", "s", "x"]];
styleHeader(thresholdN1.getRange("A5:H5"));
const n1Rows = [];
for (let i = 0; i < inputRows.length; i += 1) {
  const row = i + 6;
  const prev = row - 1;
  n1Rows.push([
    `='01 Sensory Input'!A${row}`,
    `='01 Sensory Input'!B${row}`,
    `=IF(A${row}=A${prev},--(ABS('01 Sensory Input'!C${row}-'01 Sensory Input'!C${prev})>=$B$3),0)`,
    `=IF(A${row}=A${prev},--(ABS('01 Sensory Input'!D${row}-'01 Sensory Input'!D${prev})>=$B$3),0)`,
    `=IF(A${row}=A${prev},--(ABS('01 Sensory Input'!E${row}-'01 Sensory Input'!E${prev})>=$B$3),0)`,
    `=IF(A${row}=A${prev},--(ABS('01 Sensory Input'!F${row}-'01 Sensory Input'!F${prev})>=$B$3),0)`,
    `=IF(A${row}=A${prev},--(ABS('01 Sensory Input'!G${row}-'01 Sensory Input'!G${prev})>=$B$3),0)`,
    `=--(SUM(C${row}:G${row})>=2)`,
  ]);
}
thresholdN1.getRange(`A6:H${dataEnd}`).formulas = n1Rows;
finishSheet(thresholdN1, "A:H", "A:H");

styleTitle(
  thresholdN2,
  "A1:D1",
  "02c n^-2",
  "Reads n^-1. c is normalized n^-1 signal density. a outputs 1 when c changes from the previous tick."
);
thresholdN2.getRange("A5:D5").values = [["sample", "tick", "c", "a"]];
styleHeader(thresholdN2.getRange("A5:D5"));
const n2Rows = [];
for (let i = 0; i < inputRows.length; i += 1) {
  const row = i + 6;
  const prev = row - 1;
  n2Rows.push([
    `='02b n^-1'!A${row}`,
    `='02b n^-1'!B${row}`,
    `=SUM('02b n^-1'!C${row}:H${row})/6`,
    `=IF(A${row}=A${prev},--(ABS(C${row}-C${prev})>0),0)`,
  ]);
}
thresholdN2.getRange(`A6:D${dataEnd}`).formulas = n2Rows;
thresholdN2.getRange(`C6:C${dataEnd}`).format.numberFormat = [["0.00"]];
finishSheet(thresholdN2, "A:D", "A:D");

styleTitle(
  compact,
  "A1:T1",
  "00 Compact View",
  "One row per tick. Sensory values are 0.00-1.00. Monitor outputs are 0 or 1."
);
compact.getRange("A5:T5").values = [[
  "sample",
  "tick",
  "b",
  "v",
  "to",
  "ta",
  "s",
  "n_b",
  "n_v",
  "n_to",
  "n_ta",
  "n_s",
  "d_b",
  "d_v",
  "d_to",
  "d_ta",
  "d_s",
  "x",
  "c",
  "a",
]];
styleHeader(compact.getRange("A5:T5"));
const compactRows = [];
for (let i = 0; i < inputRows.length; i += 1) {
  const row = i + 6;
  compactRows.push([
    `='01 Sensory Input'!A${row}`,
    `='01 Sensory Input'!B${row}`,
    `='01 Sensory Input'!C${row}`,
    `='01 Sensory Input'!D${row}`,
    `='01 Sensory Input'!E${row}`,
    `='01 Sensory Input'!F${row}`,
    `='01 Sensory Input'!G${row}`,
    `='02a n'!C${row}`,
    `='02a n'!D${row}`,
    `='02a n'!E${row}`,
    `='02a n'!F${row}`,
    `='02a n'!G${row}`,
    `='02b n^-1'!C${row}`,
    `='02b n^-1'!D${row}`,
    `='02b n^-1'!E${row}`,
    `='02b n^-1'!F${row}`,
    `='02b n^-1'!G${row}`,
    `='02b n^-1'!H${row}`,
    `='02c n^-2'!C${row}`,
    `='02c n^-2'!D${row}`,
  ]);
}
compact.getRange(`A6:T${dataEnd}`).formulas = compactRows;
compact.getRange(`C6:G${dataEnd}`).format.numberFormat = [["0.00"]];
compact.getRange(`S6:S${dataEnd}`).format.numberFormat = [["0.00"]];
finishSheet(compact, "A:T", "A:T");

styleTitle(
  review,
  "A1:F1",
  "03 Summary",
  "Compact sample-level numeric summary."
);
review.getRange("A5:F5").values = [["sample", "n", "d", "x", "c", "a"]];
styleHeader(review.getRange("A5:F5"));
const reviewRows = [];
for (let sampleId = 1; sampleId <= sampleFiles.length; sampleId += 1) {
  const row = sampleId + 5;
  const nSum = ["H", "I", "J", "K", "L"]
    .map((col) => `SUMIFS('00 Compact View'!$${col}$6:$${col}$205,'00 Compact View'!$A$6:$A$205,A${row})`)
    .join("+");
  const dSum = ["M", "N", "O", "P", "Q"]
    .map((col) => `SUMIFS('00 Compact View'!$${col}$6:$${col}$205,'00 Compact View'!$A$6:$A$205,A${row})`)
    .join("+");
  reviewRows.push([
    sampleId,
    `=(${nSum})/100`,
    `=(${dSum})/100`,
    `=SUMIFS('00 Compact View'!$R$6:$R$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
    `=AVERAGEIF('00 Compact View'!$A$6:$A$205,A${row},'00 Compact View'!$S$6:$S$205)`,
    `=SUMIFS('00 Compact View'!$T$6:$T$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
  ]);
}
review.getRange("A6:F15").formulas = reviewRows;
review.getRange("B6:F15").format.numberFormat = [["0.00"]];
finishSheet(review, "A:F", "A:F");

for (const sheetName of ["00 Compact View", "01 Sensory Input", "02a n", "02b n^-1", "02c n^-2", "03 Summary"]) {
  const blob = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, `${sheetName.replaceAll(" ", "_")}.png`), bytes);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const summary = await workbook.inspect({
  kind: "table",
  range: "03 Summary!A5:F15",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 6,
});
console.log(summary.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
