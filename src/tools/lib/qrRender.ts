// Branded QR rendering — built on the already-installed `qrcode` lib's matrix
// output (no new dependency). Renders to a canvas or an SVG string with colour,
// dot style, quiet zone, and an optional centered logo. ECC-H tolerates a logo
// punch-out over the middle of the code.
import QRCode from 'qrcode';

export type DotStyle = 'square' | 'rounded' | 'dots';

export type QrOptions = {
  text: string;
  fg?: string;
  bg?: string;
  dotStyle?: DotStyle;
  /** Quiet-zone margin in modules. */
  margin?: number;
  /** Output pixel size (canvas is square). */
  size?: number;
  /** Optional centered logo image (already loaded). */
  logo?: HTMLImageElement | null;
};

type Matrix = { size: number; data: Uint8Array };

function matrix(text: string): Matrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'H' });
  // qrcode's modules: { size, data } where data is a row-major boolean bitmap.
  return { size: qr.modules.size, data: qr.modules.data as unknown as Uint8Array };
}

function isDark(m: Matrix, row: number, col: number): boolean {
  if (row < 0 || col < 0 || row >= m.size || col >= m.size) return false;
  return m.data[row * m.size + col] === 1;
}

export function renderToCanvas(canvas: HTMLCanvasElement, opts: QrOptions): void {
  const { text, fg = '#000000', bg = '#FFFFFF', dotStyle = 'square', margin = 4, size = 512, logo } = opts;
  if (!text) throw new Error('Enter data first.');

  const m = matrix(text);
  const total = m.size + margin * 2;
  const cell = Math.floor(size / total);
  const dim = cell * total;
  canvas.width = dim;
  canvas.height = dim;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, dim, dim);
  ctx.fillStyle = fg;

  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (!isDark(m, r, c)) continue;
      const x = (c + margin) * cell;
      const y = (r + margin) * cell;
      if (dotStyle === 'dots') {
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (dotStyle === 'rounded') {
        const rad = cell * 0.3;
        ctx.beginPath();
        ctx.roundRect(x, y, cell, cell, rad);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }

  if (logo) {
    // Punch a bg pad ~22% of the code, draw the logo inside it.
    const pad = Math.round(dim * 0.22);
    const px = Math.round((dim - pad) / 2);
    ctx.fillStyle = bg;
    ctx.fillRect(px, px, pad, pad);
    const inset = Math.round(pad * 0.1);
    ctx.drawImage(logo, px + inset, px + inset, pad - inset * 2, pad - inset * 2);
  }
}

export function toSvgString(opts: QrOptions): string {
  const { text, fg = '#000000', bg = '#FFFFFF', dotStyle = 'square', margin = 4 } = opts;
  if (!text) throw new Error('Enter data first.');
  const m = matrix(text);
  const total = m.size + margin * 2;
  const parts: string[] = [];
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (!isDark(m, r, c)) continue;
      const x = c + margin;
      const y = r + margin;
      if (dotStyle === 'dots') {
        parts.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.5"/>`);
      } else if (dotStyle === 'rounded') {
        parts.push(`<rect x="${x}" y="${y}" width="1" height="1" rx="0.3"/>`);
      } else {
        parts.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="${bg}"/><g fill="${fg}">${parts.join('')}</g></svg>`;
}

/** Render a QR straight to a PNG blob (used by bulk export). */
export async function toPngBlob(opts: QrOptions): Promise<Blob> {
  const canvas = document.createElement('canvas');
  renderToCanvas(canvas, opts);
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not render QR.'))), 'image/png'),
  );
}
