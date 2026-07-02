// In-browser image compression + format conversion. Uses browser-image-compression
// (MIT) which runs in a web worker — resize + quality + PNG/JPG/WebP, and AVIF where
// the browser's canvas can encode it. Everything stays on the device.
import imageCompression from 'browser-image-compression';

export type FormatKey = 'webp' | 'jpeg' | 'png' | 'avif';

export type Format = {
  key: FormatKey;
  label: string;
  mime: string;
  ext: string;
};

export const FORMATS: Format[] = [
  { key: 'webp', label: 'WebP', mime: 'image/webp', ext: 'webp' },
  { key: 'jpeg', label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
  { key: 'png', label: 'PNG (lossless)', mime: 'image/png', ext: 'png' },
  { key: 'avif', label: 'AVIF', mime: 'image/avif', ext: 'avif' },
];

// Canvas-based feature detection for AVIF encoding (Chrome/Edge yes, others vary).
export function avifSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    return c.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
}

function dimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export type CompressOptions = {
  format?: FormatKey;
  quality?: number; // 0..1
  maxDimension?: number; // px, 0 = keep
};

export type CompressResult = {
  blob: Blob;
  mime: string;
  ext: string;
  size: number;
  width: number;
  height: number;
};

export async function run(file: File | Blob, opts: CompressOptions = {}): Promise<CompressResult> {
  const { format = 'webp', quality = 0.8, maxDimension = 0 } = opts;
  const fmt = FORMATS.find((f) => f.key === format) || FORMATS[0];

  const blob = await imageCompression(file as File, {
    fileType: fmt.mime,
    initialQuality: quality, // ignored for PNG (lossless)
    useWebWorker: true,
    maxWidthOrHeight: maxDimension > 0 ? maxDimension : undefined,
    maxSizeMB: Number.MAX_SAFE_INTEGER, // quality/dimension drive size, not a target cap
  });

  const dims = await dimensions(blob);
  return { blob, mime: fmt.mime, ext: fmt.ext, size: blob.size, ...dims };
}
