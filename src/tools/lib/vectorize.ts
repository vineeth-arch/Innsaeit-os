// Raster -> SVG vectorisation in the browser using imagetracerjs (MIT, pure JS —
// no WASM). Good for logos / line art. Runs on the device; nothing is uploaded.
import ImageTracer from 'imagetracerjs';

export type VectorizeOptions = {
  numberofcolors?: number; // palette size
  pathomit?: number; // drop tiny shapes (despeckle)
  ltres?: number; // line threshold
  qtres?: number; // curve threshold
};

// Sensible defaults; the page exposes the most useful as sliders.
export const DEFAULTS: Required<VectorizeOptions> = {
  numberofcolors: 16,
  pathomit: 8,
  ltres: 1,
  qtres: 1,
};

function toImageData(file: File | Blob): Promise<{ data: ImageData; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ data, width: canvas.width, height: canvas.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image.'));
    };
    img.src = url;
  });
}

export type VectorizeResult = {
  svg: string;
  width: number;
  height: number;
};

export async function run(file: File | Blob, opts: VectorizeOptions = {}): Promise<VectorizeResult> {
  const { data, width, height } = await toImageData(file);
  const options = { ...DEFAULTS, ...opts };
  // Synchronous + CPU-heavy on large images; yield a frame first so the UI can
  // paint the "tracing…" state before we block.
  await new Promise((r) => setTimeout(r, 0));
  const svg = ImageTracer.imagedataToSVG(data, options);
  return { svg, width, height };
}
