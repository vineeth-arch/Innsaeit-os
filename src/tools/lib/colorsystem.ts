// Colour harmony + tint/shade ramp generation — pure HSL math, no dependency.

export type Hsl = { h: number; s: number; l: number };

export function hexToHsl(hex: string): Hsl | null {
  const m = hex.trim().replace(/^#/, '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let sat = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue /= 6;
  }
  return { h: Math.round(hue * 360), s: Math.round(sat * 100), l: Math.round(l * 100) };
}

export function hslToHex({ h, s, l }: Hsl): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const norm360 = (h: number) => ((h % 360) + 360) % 360;

export function harmony(hex: string): Record<string, string[]> | null {
  const base = hexToHsl(hex);
  if (!base) return null;
  return {
    complementary: [hex.toUpperCase(), hslToHex({ ...base, h: norm360(base.h + 180) })],
    analogous: [
      hslToHex({ ...base, h: norm360(base.h - 30) }),
      hex.toUpperCase(),
      hslToHex({ ...base, h: norm360(base.h + 30) }),
    ],
    triadic: [
      hex.toUpperCase(),
      hslToHex({ ...base, h: norm360(base.h + 120) }),
      hslToHex({ ...base, h: norm360(base.h + 240) }),
    ],
    monochrome: [20, 40, 60, 80].map((l) => hslToHex({ ...base, l })),
  };
}

// Tailwind-style 50..950 shade ramp: lightness spread around the base colour.
const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const RAMP_LIGHTNESS = [97, 94, 86, 76, 64, 52, 42, 34, 26, 18, 10];

export function shadeRamp(hex: string): { step: number; hex: string }[] | null {
  const base = hexToHsl(hex);
  if (!base) return null;
  return RAMP_STEPS.map((step, i) => ({
    step,
    hex: hslToHex({ h: base.h, s: base.s, l: RAMP_LIGHTNESS[i] }),
  }));
}
