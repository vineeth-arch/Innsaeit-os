// Modular type scale + CSS clamp() fluid sizing — pure math, no dependency.

export type ScaleStep = { step: number; px: number; rem: number };

const STEP_LABELS = [-2, -1, 0, 1, 2, 3, 4, 5];

export function modularScale(basePx: number, ratio: number): ScaleStep[] {
  return STEP_LABELS.map((step) => {
    const px = basePx * Math.pow(ratio, step);
    return { step, px: Math.round(px * 100) / 100, rem: Math.round((px / 16) * 1000) / 1000 };
  });
}

export const RATIOS = [
  { key: 1.125, label: 'Major Second (1.125)' },
  { key: 1.2, label: 'Minor Third (1.2)' },
  { key: 1.25, label: 'Major Third (1.25)' },
  { key: 1.333, label: 'Perfect Fourth (1.333)' },
  { key: 1.5, label: 'Perfect Fifth (1.5)' },
  { key: 1.618, label: 'Golden Ratio (1.618)' },
];

export type ClampInput = {
  minPx: number;
  maxPx: number;
  minViewportPx: number;
  maxViewportPx: number;
};

export function fluidClamp({ minPx, maxPx, minViewportPx, maxViewportPx }: ClampInput): string {
  const slope = (maxPx - minPx) / (maxViewportPx - minViewportPx);
  const intersectionRem = (minPx - slope * minViewportPx) / 16;
  const slopeVw = Math.round(slope * 100 * 10000) / 10000;
  const minRem = Math.round((minPx / 16) * 1000) / 1000;
  const maxRem = Math.round((maxPx / 16) * 1000) / 1000;
  const preferred = `${Math.round(intersectionRem * 1000) / 1000}rem + ${slopeVw}vw`;
  return `clamp(${minRem}rem, ${preferred}, ${maxRem}rem)`;
}
