// QR codes (qrcode, MIT) and retail barcodes (bwip-js, MIT), generated in the
// browser. Render to a canvas for preview/PNG, or produce an SVG string.
import QRCode from 'qrcode';
import bwipjs from 'bwip-js/browser';

export type CodeTypeKey = 'qrcode' | 'ean13' | 'upca' | 'code128';

export type CodeType = {
  key: CodeTypeKey;
  label: string;
  kind?: 'qr';
  bcid?: string;
  hint: string;
};

export const CODE_TYPES: CodeType[] = [
  { key: 'qrcode', label: 'QR Code', kind: 'qr', hint: 'Any text or URL.' },
  { key: 'ean13', label: 'EAN-13', bcid: 'ean13', hint: '12–13 digits (retail).' },
  { key: 'upca', label: 'UPC-A', bcid: 'upca', hint: '11–12 digits (retail US).' },
  { key: 'code128', label: 'Code 128', bcid: 'code128', hint: 'Letters + digits.' },
];

const def = (type: CodeTypeKey): CodeType => CODE_TYPES.find((t) => t.key === type) || CODE_TYPES[0];

const barcodeOpts = (d: CodeType, text: string) => ({
  bcid: d.bcid!,
  text,
  scale: 3,
  height: 12,
  includetext: true,
  textxalign: 'center' as const,
});

export type CodeInput = { type: CodeTypeKey; text: string };

// Render into an existing <canvas>. Throws on invalid data (caller shows the error).
export async function renderToCanvas(canvas: HTMLCanvasElement, { type, text }: CodeInput): Promise<void> {
  if (!text) throw new Error('Enter data first.');
  const d = def(type);
  if (d.kind === 'qr') {
    await QRCode.toCanvas(canvas, text, { width: 320, margin: 1 });
  } else {
    bwipjs.toCanvas(canvas, barcodeOpts(d, text));
  }
}

// Produce a scalable SVG string for download.
export async function toSvg({ type, text }: CodeInput): Promise<string> {
  if (!text) throw new Error('Enter data first.');
  const d = def(type);
  if (d.kind === 'qr') {
    return QRCode.toString(text, { type: 'svg', margin: 1 });
  }
  return bwipjs.toSVG(barcodeOpts(d, text));
}
