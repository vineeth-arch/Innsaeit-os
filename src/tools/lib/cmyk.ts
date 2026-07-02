// CMYK <-> RGB — pure math, standard naive conversion (no ICC profile — good
// enough for a quick screen/print sanity check, not colour-managed output).

export type Cmyk = { c: number; m: number; y: number; k: number }; // 0..100
export type Rgb = { r: number; g: number; b: number }; // 0..255

export function rgbToCmyk({ r, g, b }: Rgb): Cmyk {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rp = r / 255;
  const gp = g / 255;
  const bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  const c = (1 - rp - k) / (1 - k);
  const m = (1 - gp - k) / (1 - k);
  const y = (1 - bp - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb({ c, m, y, k }: Cmyk): Rgb {
  const cp = c / 100;
  const mp = m / 100;
  const yp = y / 100;
  const kp = k / 100;
  return {
    r: Math.round(255 * (1 - cp) * (1 - kp)),
    g: Math.round(255 * (1 - mp) * (1 - kp)),
    b: Math.round(255 * (1 - yp) * (1 - kp)),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): Rgb | null {
  const m = hex.trim().replace(/^#/, '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
