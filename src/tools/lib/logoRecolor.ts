// SVG logo recolour + tight-crop — DOM-based, no new dependency for the SVG work.
// Rasterisation/PDF/size-capping happen in the page using canvas + already-installed
// browser-image-compression + pdf-lib.

const COLOUR_ATTRS = ['fill', 'stroke'] as const;

function parse(svgText: string): SVGSVGElement {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) throw new Error('That does not look like a valid SVG.');
  return svg as unknown as SVGSVGElement;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace(/^#/, '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function dist(a: [number, number, number], b: [number, number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

/** Walk every element, applying `map` to each fill/stroke it carries (attr + inline style). */
function recolourAll(svg: SVGSVGElement, map: (colour: string) => string | null) {
  const els = [svg, ...Array.from(svg.querySelectorAll('*'))];
  for (const el of els) {
    for (const attr of COLOUR_ATTRS) {
      const v = el.getAttribute(attr);
      if (v && v !== 'none') {
        const mapped = map(v);
        if (mapped) el.setAttribute(attr, mapped);
      }
      // inline style variant, e.g. style="fill:#abc"
      const style = el.getAttribute('style');
      if (style && style.includes(`${attr}:`)) {
        const next = style.replace(new RegExp(`${attr}:\\s*([^;]+)`, 'i'), (whole, colour) => {
          if (colour.trim() === 'none') return whole;
          const mapped = map(colour.trim());
          return mapped ? `${attr}:${mapped}` : whole;
        });
        el.setAttribute('style', next);
      }
    }
  }
}

export type Variant = 'white' | 'black' | 'single' | '2colour';

export type RecolourOptions = {
  singleColour: string;
  twoColourA: string;
  twoColourB: string;
};

export function recolour(svgText: string, variant: Variant, opts: RecolourOptions): string {
  const svg = parse(svgText);

  if (variant === 'white') recolourAll(svg, () => '#FFFFFF');
  else if (variant === 'black') recolourAll(svg, () => '#000000');
  else if (variant === 'single') recolourAll(svg, () => opts.singleColour);
  else if (variant === '2colour') {
    const a = hexToRgb(opts.twoColourA);
    const b = hexToRgb(opts.twoColourB);
    recolourAll(svg, (colour) => {
      const rgb = hexToRgb(colour);
      if (!rgb || !a || !b) return null; // leave non-hex (e.g. url() gradients) untouched
      return dist(rgb, a) <= dist(rgb, b) ? opts.twoColourA : opts.twoColourB;
    });
  }

  return new XMLSerializer().serializeToString(svg);
}

/**
 * Tight-crop by measuring the rendered bbox in the DOM. Must run in the browser.
 * Returns a new SVG string whose viewBox/width/height wrap the artwork.
 */
export function tightCrop(svgText: string, padding = 2): string {
  const svg = parse(svgText);
  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = '-99999px';
  holder.style.top = '0';
  holder.appendChild(svg);
  document.body.appendChild(holder);
  try {
    const bbox = (svg as unknown as SVGGraphicsElement).getBBox();
    const x = bbox.x - padding;
    const y = bbox.y - padding;
    const w = bbox.width + padding * 2;
    const h = bbox.height + padding * 2;
    svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    svg.setAttribute('width', String(Math.round(w)));
    svg.setAttribute('height', String(Math.round(h)));
    return new XMLSerializer().serializeToString(svg);
  } finally {
    document.body.removeChild(holder);
  }
}
