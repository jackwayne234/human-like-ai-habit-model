import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workbook = Workbook.create();
const compact = workbook.worksheets.add("00 Compact View");
const sensory = workbook.worksheets.add("01 Sensory Input");
const thresholdN = workbook.worksheets.add("02a n");
const thresholdN1 = workbook.worksheets.add("02b n^-1");
const thresholdN2 = workbook.worksheets.add("02c n^-2");
const mindKnobs = workbook.worksheets.add("03 Mind Knobs");
const resourceBody = workbook.worksheets.add("04 Resource Body");
const gateOutput = workbook.worksheets.add("05 Gate Output");
const habitEfficiency = workbook.worksheets.add("06 Habit Efficiency");
const modePresets = workbook.worksheets.add("07 Mode Presets");
const review = workbook.worksheets.add("08 Summary");

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
  if (narrowRange) {
    sheet.getRange(narrowRange).format.columnWidthPx = 42;
  }
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
  mindKnobs,
  "A1:E1",
  "03 Mind Knobs",
  "Editable control surface. v drives formulas. p shows the selected curious-mode defaults."
);
mindKnobs.getRange("A5:E5").values = [["k", "v", "p", "lo", "hi"]];
styleHeader(mindKnobs.getRange("A5:E5"));
mindKnobs.getRange("A6:E26").values = [
  ["mode", 2, "", 1, 6],
  ["nov", 0.70, "", 0, 1],
  ["em_sens", 0.50, "", 0, 1],
  ["att_win", 10, "", 1, 20],
  ["res_disc", 0.40, "", 0, 1],
  ["cur_bud", 0.70, "", 0, 1],
  ["inner_build", 0.50, "", 0, 1],
  ["curiosity", 0.30, "", 0, 1],
  ["unassigned", "", "", 0, 1],
  ["out_attn", "", "", 0, 1],
  ["em_win", 10, "", 1, 20],
  ["x_w", 0.50, "", 0, 1],
  ["a_w", 0.70, "", 0, 1],
  ["prom_base", 0.55, "", 0, 1],
  ["eff_drive", 0.85, "", 0, 1],
  ["habit_rep", 3, "", 1, 10],
  ["habit_conf", 0.80, "", 0, 1],
  ["fail_tol", 0.20, "", 0, 1],
  ["partial_ok", 1, "", 0, 1],
  ["audit_compact", 1, "", 0, 1],
  ["mismatch_imp", 0.60, "", 0, 1],
];
mindKnobs.getRange("B14:B15").formulas = [
  ["=MAX(0,1-B12-B13)"],
  ["=B14"],
];
mindKnobs.getRange("C7:C26").formulas = [
  ["=INDEX('07 Mode Presets'!$C$6:$C$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$D$6:$D$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$E$6:$E$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$F$6:$F$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$G$6:$G$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$H$6:$H$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$I$6:$I$11,$B$6)"],
  ["=MAX(0,1-C12-C13)"],
  ["=C14"],
  ["=INDEX('07 Mode Presets'!$J$6:$J$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$K$6:$K$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$L$6:$L$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$M$6:$M$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$N$6:$N$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$O$6:$O$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$P$6:$P$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$Q$6:$Q$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$R$6:$R$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$S$6:$S$11,$B$6)"],
  ["=INDEX('07 Mode Presets'!$T$6:$T$11,$B$6)"],
];
mindKnobs.getRange("B7:C26").format.numberFormat = [["0.00"]];
finishSheet(mindKnobs, "A:E", "A:E");
mindKnobs.getRange("A:E").format.columnWidthPx = 68;

styleTitle(
  resourceBody,
  "A1:F1",
  "04 Resource Body",
  "Physical constraint meters. 0.80 is the first discipline marker."
);
resourceBody.getRange("A5:F5").values = [["m", "use", "lim", "ok", "over", "disc"]];
styleHeader(resourceBody.getRange("A5:F5"));
resourceBody.getRange("A6:C8").values = [
  ["stor", 0.62, 0.80],
  ["ram", 0.48, 0.80],
  ["heat", 0.35, 0.80],
];
resourceBody.getRange("D6:F8").formulas = [
  ["=--(B6<=C6)", "=MAX(0,(B6-C6)/(1-C6))", "=E6*'03 Mind Knobs'!$B$10"],
  ["=--(B7<=C7)", "=MAX(0,(B7-C7)/(1-C7))", "=E7*'03 Mind Knobs'!$B$10"],
  ["=--(B8<=C8)", "=MAX(0,(B8-C8)/(1-C8))", "=E8*'03 Mind Knobs'!$B$10"],
];
resourceBody.getRange("A10:B11").values = [
  ["press", ""],
  ["cur_eff", ""],
];
resourceBody.getRange("B10:B11").formulas = [
  ["=MAX(E6:E8)"],
  ["=MAX(0,'03 Mind Knobs'!$B$13*(1-B10*'03 Mind Knobs'!$B$10))"],
];
resourceBody.getRange("D10:F11").values = [
  ["homeo", "danger", "eff"],
  ["", "", ""],
];
styleHeader(resourceBody.getRange("D10:F10"));
resourceBody.getRange("D11:F11").formulas = [
  [
    "=MAX(0,1-B10)",
    "=--(MAX(B6:B8)>=C6)",
    "=MIN(1,'03 Mind Knobs'!$B$20+(B10*0.15))",
  ],
];
resourceBody.getRange("A13:D13").values = [["sense", "gb", "demand", "fill"]];
styleHeader(resourceBody.getRange("A13:D13"));
resourceBody.getRange("A14:A18").values = [["b"], ["v"], ["to"], ["ta"], ["s"]];
resourceBody.getRange("C14:C18").formulas = [
  ["=MIN(1,(SUM('00 Compact View'!$H$6:$H$205)+SUM('00 Compact View'!$M$6:$M$205))/40)"],
  ["=MIN(1,(SUM('00 Compact View'!$I$6:$I$205)+SUM('00 Compact View'!$N$6:$N$205))/40)"],
  ["=MIN(1,(SUM('00 Compact View'!$J$6:$J$205)+SUM('00 Compact View'!$O$6:$O$205))/40)"],
  ["=MIN(1,(SUM('00 Compact View'!$K$6:$K$205)+SUM('00 Compact View'!$P$6:$P$205))/40)"],
  ["=MIN(1,(SUM('00 Compact View'!$L$6:$L$205)+SUM('00 Compact View'!$Q$6:$Q$205))/40)"],
];
resourceBody.getRange("B14:B18").formulas = [
  ["=20+((C14-AVERAGE($C$14:$C$18))*20)"],
  ["=20+((C15-AVERAGE($C$14:$C$18))*20)"],
  ["=20+((C16-AVERAGE($C$14:$C$18))*20)"],
  ["=20+((C17-AVERAGE($C$14:$C$18))*20)"],
  ["=20+((C18-AVERAGE($C$14:$C$18))*20)"],
];
resourceBody.getRange("D14:D18").formulas = [
  ["=MIN(1,C14*B14/20)"],
  ["=MIN(1,C15*B15/20)"],
  ["=MIN(1,C16*B16/20)"],
  ["=MIN(1,C17*B17/20)"],
  ["=MIN(1,C18*B18/20)"],
];
resourceBody.getRange("A20:B20").values = [["gb_total", ""]];
resourceBody.getRange("B20").formulas = [["=SUM(B14:B18)"]];
resourceBody.getRange("D20:F20").values = [["avoid", "comp", "inner"]];
styleHeader(resourceBody.getRange("D20:F20"));
resourceBody.getRange("D21:F21").formulas = [
  [
    "=MIN(1,F11*0.65+(1-D11)*0.35)",
    "=MIN(1,B10*0.55+F11*0.45)",
    "=MAX(0,'03 Mind Knobs'!$B$12-(B10*0.25)-(E11*0.30))",
  ],
];
resourceBody.getRange("B6:F21").format.numberFormat = [["0.00"]];
finishSheet(resourceBody, "A:F", "A:F");
resourceBody.getRange("A:F").format.columnWidthPx = 58;

styleTitle(
  gateOutput,
  "A1:M1",
  "05 Gate Output",
  "Route outputs stay numeric: ignore, watch, promote, episode, emergency, send_upward."
);
gateOutput.getRange("A5:M5").values = [[
  "sample",
  "tick",
  "n",
  "d",
  "x",
  "a",
  "res",
  "ignore",
  "watch",
  "promote",
  "episode",
  "emerg",
  "up",
]];
styleHeader(gateOutput.getRange("A5:M5"));
const gateRows = [];
for (let i = 0; i < inputRows.length; i += 1) {
  const row = i + 6;
  gateRows.push([
    `='00 Compact View'!A${row}`,
    `='00 Compact View'!B${row}`,
    `=SUM('00 Compact View'!H${row}:L${row})/5`,
    `=SUM('00 Compact View'!M${row}:Q${row})/5`,
    `='00 Compact View'!R${row}`,
    `='00 Compact View'!T${row}`,
    `='04 Resource Body'!$B$10`,
    `=--(M${row}=0)`,
    `=--(MIN(1,C${row}+D${row}+(E${row}*'03 Mind Knobs'!$B$17)+(F${row}*'03 Mind Knobs'!$B$18)+('03 Mind Knobs'!$B$7*F${row}))>=MAX(0.15,0.35+(G${row}*'03 Mind Knobs'!$B$10)-('03 Mind Knobs'!$B$13*0.15)))`,
    `=--(MIN(1,C${row}+D${row}+(E${row}*'03 Mind Knobs'!$B$17)+(F${row}*'03 Mind Knobs'!$B$18)+('03 Mind Knobs'!$B$7*F${row}))>=MIN(0.95,'03 Mind Knobs'!$B$19+(G${row}*'03 Mind Knobs'!$B$10)-('03 Mind Knobs'!$B$13*0.10)))`,
    `=--(AND(J${row}=1,OR(E${row}=1,F${row}=1)))`,
    `=--(MAX(SUMIFS('00 Compact View'!$H$6:$H$205,'00 Compact View'!$A$6:$A$205,A${row},'00 Compact View'!$B$6:$B$205,">="&B${row}-'03 Mind Knobs'!$B$16+1,'00 Compact View'!$B$6:$B$205,"<="&B${row}),SUMIFS('00 Compact View'!$I$6:$I$205,'00 Compact View'!$A$6:$A$205,A${row},'00 Compact View'!$B$6:$B$205,">="&B${row}-'03 Mind Knobs'!$B$16+1,'00 Compact View'!$B$6:$B$205,"<="&B${row}),SUMIFS('00 Compact View'!$J$6:$J$205,'00 Compact View'!$A$6:$A$205,A${row},'00 Compact View'!$B$6:$B$205,">="&B${row}-'03 Mind Knobs'!$B$16+1,'00 Compact View'!$B$6:$B$205,"<="&B${row}),SUMIFS('00 Compact View'!$K$6:$K$205,'00 Compact View'!$A$6:$A$205,A${row},'00 Compact View'!$B$6:$B$205,">="&B${row}-'03 Mind Knobs'!$B$16+1,'00 Compact View'!$B$6:$B$205,"<="&B${row}),SUMIFS('00 Compact View'!$L$6:$L$205,'00 Compact View'!$A$6:$A$205,A${row},'00 Compact View'!$B$6:$B$205,">="&B${row}-'03 Mind Knobs'!$B$16+1,'00 Compact View'!$B$6:$B$205,"<="&B${row}))>=MAX(1,ROUNDUP('03 Mind Knobs'!$B$16*(1-'03 Mind Knobs'!$B$8),0)))`,
    `=--(OR(I${row}=1,J${row}=1,K${row}=1,L${row}=1))`,
  ]);
}
gateOutput.getRange(`A6:M${dataEnd}`).formulas = gateRows;
gateOutput.getRange(`C6:G${dataEnd}`).format.numberFormat = [["0.00"]];
finishSheet(gateOutput, "A:M", "A:M");

styleTitle(
  habitEfficiency,
  "A1:N1",
  "06 Habit Efficiency",
  "Sample-level trigger + sequence + reward handoff. Outputs stay numeric and inspectable."
);
habitEfficiency.getRange("A5:N5").values = [[
  "sample",
  "trig",
  "seq",
  "reward",
  "loop",
  "rep",
  "conf",
  "fail",
  "handoff",
  "partial",
  "auto",
  "audit",
  "eff",
  "safe",
]];
styleHeader(habitEfficiency.getRange("A5:N5"));
const habitRows = [];
for (let sampleId = 1; sampleId <= sampleFiles.length; sampleId += 1) {
  const row = sampleId + 5;
  habitRows.push([
    sampleId,
    `=MIN(1,(SUMIFS('00 Compact View'!$V$6:$V$205,'00 Compact View'!$A$6:$A$205,A${row})+SUMIFS('00 Compact View'!$Y$6:$Y$205,'00 Compact View'!$A$6:$A$205,A${row})*2)/20)`,
    `=MIN(1,(SUMIFS('00 Compact View'!$W$6:$W$205,'00 Compact View'!$A$6:$A$205,A${row})+SUMIFS('00 Compact View'!$X$6:$X$205,'00 Compact View'!$A$6:$A$205,A${row})+SUMIFS('00 Compact View'!$R$6:$R$205,'00 Compact View'!$A$6:$A$205,A${row})+SUMIFS('00 Compact View'!$T$6:$T$205,'00 Compact View'!$A$6:$A$205,A${row}))/40)`,
    `=MIN(1,(B${row}*0.25)+(C${row}*0.25)+('04 Resource Body'!$D$11*0.25)+('04 Resource Body'!$F$11*0.25))`,
    `=ROUND(B${row}*3,0)*100+ROUND(C${row}*3,0)*10+ROUND(D${row}*3,0)`,
    `=COUNTIF($E$6:$E$15,E${row})`,
    `=MIN(1,(D${row}*0.45)+(MIN(1,F${row}/'03 Mind Knobs'!$B$21)*0.35)+('04 Resource Body'!$D$11*0.20))`,
    `=MAX(0,(1-D${row})*0.35+('04 Resource Body'!$B$10*0.20))`,
    `=--(AND(B${row}>0,C${row}>0,D${row}>=0.45,F${row}>='03 Mind Knobs'!$B$21,G${row}>='03 Mind Knobs'!$B$22,H${row}<='03 Mind Knobs'!$B$23))`,
    `=--(AND(I${row}=0,'03 Mind Knobs'!$B$24=1,B${row}>0,C${row}>0,D${row}>=0.35,G${row}>=('03 Mind Knobs'!$B$22*0.70)))`,
    `=--(AND(I${row}=1,M${row}>=0.75,N${row}=1))`,
    `=--(AND('03 Mind Knobs'!$B$25=1,OR(I${row}=1,J${row}=1,K${row}=1)))`,
    `=MIN(1,'04 Resource Body'!$F$11+(G${row}*0.15)+(I${row}*0.10)+(J${row}*0.05))`,
    `=--(H${row}<='03 Mind Knobs'!$B$23)`,
  ]);
}
habitEfficiency.getRange("A6:N15").formulas = habitRows;
habitEfficiency.getRange("B6:N15").format.numberFormat = [["0.00"]];
habitEfficiency.getRange("A16:N16").values = [[
  "avg",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
]];
habitEfficiency.getRange("B16:N16").formulas = [[
  "=AVERAGE(B6:B15)",
  "=AVERAGE(C6:C15)",
  "=AVERAGE(D6:D15)",
  "=AVERAGE(E6:E15)",
  "=AVERAGE(F6:F15)",
  "=AVERAGE(G6:G15)",
  "=AVERAGE(H6:H15)",
  "=AVERAGE(I6:I15)",
  "=AVERAGE(J6:J15)",
  "=AVERAGE(K6:K15)",
  "=AVERAGE(L6:L15)",
  "=AVERAGE(M6:M15)",
  "=AVERAGE(N6:N15)",
]];
habitEfficiency.getRange("B16:N16").format.numberFormat = [["0.00"]];
finishSheet(habitEfficiency, "A:N", "A:N");
habitEfficiency.getRange("A:N").format.columnWidthPx = 58;

styleTitle(
  modePresets,
  "A1:T1",
  "07 Mode Presets",
  "Global modes set grouped defaults. Mind Knobs can still be edited directly."
);
modePresets.getRange("A5:T5").values = [[
  "id",
  "mode",
  "nov",
  "em",
  "win",
  "res",
  "cur_bud",
  "inner",
  "curiosity",
  "emwin",
  "xw",
  "aw",
  "prom",
  "eff",
  "rep",
  "conf",
  "fail",
  "partial",
  "audit",
  "mismatch",
]];
styleHeader(modePresets.getRange("A5:T5"));
modePresets.getRange("A6:T11").values = [
  [1, "calm", 0.30, 0.35, 12, 0.25, 0.35, 0.55, 0.20, 12, 0.35, 0.45, 0.65, 0.75, 4, 0.85, 0.15, 1, 1, 0.70],
  [2, "curious", 0.70, 0.50, 10, 0.40, 0.70, 0.50, 0.30, 10, 0.50, 0.70, 0.55, 0.85, 3, 0.80, 0.20, 1, 1, 0.60],
  [3, "focused", 0.35, 0.45, 8, 0.50, 0.30, 0.65, 0.15, 10, 0.40, 0.55, 0.60, 0.90, 3, 0.85, 0.15, 1, 1, 0.65],
  [4, "strained", 0.20, 0.55, 6, 0.80, 0.15, 0.45, 0.10, 8, 0.45, 0.45, 0.75, 0.95, 2, 0.75, 0.10, 1, 1, 0.75],
  [5, "danger", 0.65, 0.90, 4, 0.65, 0.20, 0.20, 0.05, 5, 0.75, 0.85, 0.45, 1.00, 1, 0.65, 0.05, 1, 1, 0.35],
  [6, "recovery", 0.25, 0.45, 14, 0.70, 0.20, 0.60, 0.10, 12, 0.30, 0.35, 0.80, 0.90, 4, 0.80, 0.20, 1, 1, 0.70],
];
modePresets.getRange("C6:T11").format.numberFormat = [["0.00"]];
finishSheet(modePresets, "A:T", "A:T");
modePresets.getRange("A:T").format.columnWidthPx = 58;

styleTitle(
  compact,
  "A1:Z1",
  "00 Compact View",
  "One row per tick. Sensory values are 0.00-1.00. Monitor and route outputs are numeric."
);
compact.getRange("A5:Z5").values = [[
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
  "ignore",
  "watch",
  "promote",
  "episode",
  "emerg",
  "up",
]];
styleHeader(compact.getRange("A5:Z5"));
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
    `='05 Gate Output'!H${row}`,
    `='05 Gate Output'!I${row}`,
    `='05 Gate Output'!J${row}`,
    `='05 Gate Output'!K${row}`,
    `='05 Gate Output'!L${row}`,
    `='05 Gate Output'!M${row}`,
  ]);
}
compact.getRange(`A6:Z${dataEnd}`).formulas = compactRows;
compact.getRange(`C6:G${dataEnd}`).format.numberFormat = [["0.00"]];
compact.getRange(`S6:S${dataEnd}`).format.numberFormat = [["0.00"]];
finishSheet(compact, "A:Z", "A:Z");

styleTitle(
  review,
  "A1:R1",
  "08 Summary",
  "Compact sample-level numeric summary with resource, habit, and efficiency outputs."
);
review.getRange("A5:R5").values = [[
  "sample",
  "n",
  "d",
  "x",
  "c",
  "a",
  "watch",
  "prom",
  "ep",
  "emerg",
  "up",
  "res",
  "homeo",
  "eff",
  "handoff",
  "partial",
  "auto",
  "audit",
]];
styleHeader(review.getRange("A5:R5"));
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
    `=SUMIFS('00 Compact View'!$V$6:$V$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
    `=SUMIFS('00 Compact View'!$W$6:$W$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
    `=SUMIFS('00 Compact View'!$X$6:$X$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
    `=SUMIFS('00 Compact View'!$Y$6:$Y$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
    `=SUMIFS('00 Compact View'!$Z$6:$Z$205,'00 Compact View'!$A$6:$A$205,A${row})/20`,
    `='04 Resource Body'!$B$10`,
    `='04 Resource Body'!$D$11`,
    `=INDEX('06 Habit Efficiency'!$M$6:$M$15,A${row})`,
    `=INDEX('06 Habit Efficiency'!$I$6:$I$15,A${row})`,
    `=INDEX('06 Habit Efficiency'!$J$6:$J$15,A${row})`,
    `=INDEX('06 Habit Efficiency'!$K$6:$K$15,A${row})`,
    `=INDEX('06 Habit Efficiency'!$L$6:$L$15,A${row})`,
  ]);
}
review.getRange("A6:R15").formulas = reviewRows;
review.getRange("B6:R15").format.numberFormat = [["0.00"]];
finishSheet(review, "A:R", "A:R");
review.getRange("A:R").format.columnWidthPx = 56;

for (const sheetName of [
  "00 Compact View",
  "01 Sensory Input",
  "02a n",
  "02b n^-1",
  "02c n^-2",
  "03 Mind Knobs",
  "04 Resource Body",
  "05 Gate Output",
  "06 Habit Efficiency",
  "07 Mode Presets",
  "08 Summary",
]) {
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
  range: "08 Summary!A5:R15",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 18,
});
console.log(summary.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
