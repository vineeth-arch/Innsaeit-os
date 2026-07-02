// Print/design unit conversion — pure math, no dependency.
// Base unit: millimetres.

export type Unit = 'mm' | 'cm' | 'in' | 'pt' | 'pica';

const MM_PER_UNIT: Record<Unit, number> = {
  mm: 1,
  cm: 10,
  in: 25.4,
  pt: 25.4 / 72, // 1pt = 1/72 inch
  pica: 25.4 / 6, // 1 pica = 1/6 inch = 12pt
};

export function toMm(value: number, unit: Unit): number {
  return value * MM_PER_UNIT[unit];
}

export function fromMm(mm: number, unit: Unit): number {
  return mm / MM_PER_UNIT[unit];
}

export function convert(value: number, from: Unit, to: Unit): number {
  return fromMm(toMm(value, from), to);
}

export function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}

export function pxToMm(px: number, dpi: number): number {
  return (px / dpi) * 25.4;
}

export const UNITS: { key: Unit; label: string }[] = [
  { key: 'mm', label: 'Millimetres (mm)' },
  { key: 'cm', label: 'Centimetres (cm)' },
  { key: 'in', label: 'Inches (in)' },
  { key: 'pt', label: 'Points (pt)' },
  { key: 'pica', label: 'Picas' },
];
