// Dieline/bleed math — pure geometry, no dependency.

const MM_PER_INCH = 25.4;

export type BleedInput = {
  trimWidthMm: number;
  trimHeightMm: number;
  bleedMm: number;
  safeMarginMm: number;
};

export type BleedResult = {
  bleedWidthMm: number;
  bleedHeightMm: number;
  safeWidthMm: number;
  safeHeightMm: number;
  px: { dpi: number; width: number; height: number }[];
};

const DPI_PRESETS = [150, 300, 600];

export function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}

export function calculateBleed(input: BleedInput): BleedResult {
  const { trimWidthMm, trimHeightMm, bleedMm, safeMarginMm } = input;
  const bleedWidthMm = trimWidthMm + bleedMm * 2;
  const bleedHeightMm = trimHeightMm + bleedMm * 2;
  const safeWidthMm = Math.max(0, trimWidthMm - safeMarginMm * 2);
  const safeHeightMm = Math.max(0, trimHeightMm - safeMarginMm * 2);

  return {
    bleedWidthMm,
    bleedHeightMm,
    safeWidthMm,
    safeHeightMm,
    px: DPI_PRESETS.map((dpi) => ({
      dpi,
      width: mmToPx(bleedWidthMm, dpi),
      height: mmToPx(bleedHeightMm, dpi),
    })),
  };
}
