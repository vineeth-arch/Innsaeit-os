// Paper size reference — static data, no dependency. mm dimensions, portrait.

export type PaperSize = { name: string; widthMm: number; heightMm: number };

export const A_SERIES: PaperSize[] = [
  { name: 'A0', widthMm: 841, heightMm: 1189 },
  { name: 'A1', widthMm: 594, heightMm: 841 },
  { name: 'A2', widthMm: 420, heightMm: 594 },
  { name: 'A3', widthMm: 297, heightMm: 420 },
  { name: 'A4', widthMm: 210, heightMm: 297 },
  { name: 'A5', widthMm: 148, heightMm: 210 },
  { name: 'A6', widthMm: 105, heightMm: 148 },
];

export const B_SERIES: PaperSize[] = [
  { name: 'B0', widthMm: 1000, heightMm: 1414 },
  { name: 'B1', widthMm: 707, heightMm: 1000 },
  { name: 'B2', widthMm: 500, heightMm: 707 },
  { name: 'B3', widthMm: 353, heightMm: 500 },
  { name: 'B4', widthMm: 250, heightMm: 353 },
  { name: 'B5', widthMm: 176, heightMm: 250 },
];

export const SRA_SERIES: PaperSize[] = [
  { name: 'SRA1', widthMm: 640, heightMm: 900 },
  { name: 'SRA2', widthMm: 450, heightMm: 640 },
  { name: 'SRA3', widthMm: 320, heightMm: 450 },
  { name: 'SRA4', widthMm: 225, heightMm: 320 },
];

export const INDIAN_SHEETS: PaperSize[] = [
  { name: 'Full Size (Indian)', widthMm: 559, heightMm: 864 },
  { name: 'Demy', widthMm: 445, heightMm: 572 },
  { name: 'Crown', widthMm: 384, heightMm: 508 },
  { name: 'Double Crown', widthMm: 508, heightMm: 768 },
];

export const PAPER_GROUPS: { label: string; sizes: PaperSize[] }[] = [
  { label: 'A-series (ISO 216)', sizes: A_SERIES },
  { label: 'B-series (ISO 216)', sizes: B_SERIES },
  { label: 'SRA (print/bleed sheets)', sizes: SRA_SERIES },
  { label: 'Indian print sheets', sizes: INDIAN_SHEETS },
];
