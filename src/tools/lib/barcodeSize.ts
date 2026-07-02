// EAN-13/UPC-A print size math — pure arithmetic against GS1's nominal 100%
// spec (EAN-13 nominal: 37.29mm x 25.93mm; UPC-A nominal: 37.29mm x 25.91mm).
// GS1 allows magnification 80%-200%.

export type BarcodeSizeInput = {
  symbology: 'ean13' | 'upca';
  magnificationPct: number; // 80-200
};

const NOMINAL_MM = {
  ean13: { width: 37.29, height: 25.93, quietLeft: 3.63, quietRight: 2.31 },
  upca: { width: 37.29, height: 25.91, quietLeft: 2.75, quietRight: 2.31 },
};

export type BarcodeSizeResult = {
  widthMm: number;
  heightMm: number;
  quietLeftMm: number;
  quietRightMm: number;
  inRange: boolean;
};

export function calculateBarcodeSize({ symbology, magnificationPct }: BarcodeSizeInput): BarcodeSizeResult {
  const nominal = NOMINAL_MM[symbology];
  const scale = magnificationPct / 100;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    widthMm: round2(nominal.width * scale),
    heightMm: round2(nominal.height * scale),
    quietLeftMm: round2(nominal.quietLeft * scale),
    quietRightMm: round2(nominal.quietRight * scale),
    inRange: magnificationPct >= 80 && magnificationPct <= 200,
  };
}
