// Extract a colour palette from an image with node-vibrant (MIT), in-browser.
// Turns a moodboard / packshot into copyable brand swatches.
import { Vibrant } from 'node-vibrant/browser';

export type SwatchName = 'Vibrant' | 'LightVibrant' | 'DarkVibrant' | 'Muted' | 'LightMuted' | 'DarkMuted';

// node-vibrant's six named swatches, in a sensible display order.
const ORDER: SwatchName[] = ['Vibrant', 'LightVibrant', 'DarkVibrant', 'Muted', 'LightMuted', 'DarkMuted'];
const LABELS: Record<SwatchName, string> = {
  Vibrant: 'Vibrant',
  LightVibrant: 'Light Vibrant',
  DarkVibrant: 'Dark Vibrant',
  Muted: 'Muted',
  LightMuted: 'Light Muted',
  DarkMuted: 'Dark Muted',
};

const toHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

export type Swatch = {
  name: SwatchName;
  label: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
};

export type PaletteResult = { swatches: Swatch[] };

export async function run(file: File | Blob): Promise<PaletteResult> {
  const url = URL.createObjectURL(file);
  try {
    const palette = await new Vibrant(url).getPalette();
    const swatches: Swatch[] = ORDER.filter((k) => palette[k]).map((k) => {
      const swatch = palette[k]!;
      const rgb = swatch.rgb.map((v) => Math.round(v)) as [number, number, number];
      return { name: k, label: LABELS[k], hex: swatch.hex, rgb, hsl: toHsl(...rgb) };
    });
    return { swatches };
  } finally {
    URL.revokeObjectURL(url);
  }
}
