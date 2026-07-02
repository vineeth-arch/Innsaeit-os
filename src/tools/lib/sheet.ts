// Sheet cutting / imposition math — pure arithmetic, no dependency.
// Compares both grain orientations and keeps the higher-yield one.

export type SheetInput = {
  sheetWidthMm: number;
  sheetHeightMm: number;
  pieceWidthMm: number;
  pieceHeightMm: number;
  marginMm?: number; // trim margin on all 4 sides of the sheet
  gutterMm?: number; // gap between pieces
};

export type SheetResult = {
  cols: number;
  rows: number;
  count: number;
  orientation: 'normal' | 'rotated';
  usedAreaPct: number;
};

function fit(
  usableW: number,
  usableH: number,
  pieceW: number,
  pieceH: number,
  gutter: number,
): { cols: number; rows: number; count: number } {
  const cols = Math.max(0, Math.floor((usableW + gutter) / (pieceW + gutter)));
  const rows = Math.max(0, Math.floor((usableH + gutter) / (pieceH + gutter)));
  return { cols, rows, count: cols * rows };
}

export function calculateSheet(input: SheetInput): SheetResult {
  const { sheetWidthMm, sheetHeightMm, pieceWidthMm, pieceHeightMm } = input;
  const margin = input.marginMm ?? 0;
  const gutter = input.gutterMm ?? 0;

  const usableW = sheetWidthMm - margin * 2;
  const usableH = sheetHeightMm - margin * 2;

  const normal = fit(usableW, usableH, pieceWidthMm, pieceHeightMm, gutter);
  const rotated = fit(usableW, usableH, pieceHeightMm, pieceWidthMm, gutter);

  const best = rotated.count > normal.count ? { ...rotated, orientation: 'rotated' as const } : { ...normal, orientation: 'normal' as const };

  const sheetArea = sheetWidthMm * sheetHeightMm;
  const usedArea = best.count * pieceWidthMm * pieceHeightMm;
  const usedAreaPct = sheetArea > 0 ? Math.round((usedArea / sheetArea) * 1000) / 10 : 0;

  return { ...best, usedAreaPct };
}
