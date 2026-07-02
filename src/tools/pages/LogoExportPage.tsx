import { useState } from 'react';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import ToolLayout from '../components/ToolLayout';
import { recolour, tightCrop, type Variant, type RecolourOptions } from '../lib/logoRecolor';

const VARIANTS: Variant[] = ['white', 'black', 'single', '2colour'];
const VARIANT_LABEL: Record<Variant, string> = {
  white: 'white',
  black: 'black',
  single: 'single',
  '2colour': '2colour',
};

function svgToPng(svgText: string, scale: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const w = (img.naturalWidth || 300) * scale;
      const h = (img.naturalHeight || 300) * scale;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('raster failed'))), 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not rasterise the SVG.'));
    };
    img.src = url;
  });
}

async function pngToJpg(pngBlob: Blob): Promise<Blob> {
  return imageCompression(new File([pngBlob], 'x.png', { type: 'image/png' }), {
    fileType: 'image/jpeg',
    initialQuality: 0.92,
    useWebWorker: true,
    maxSizeMB: Number.MAX_SAFE_INTEGER,
  });
}

async function cap(pngBlob: Blob, maxSizeMB: number): Promise<Blob> {
  return imageCompression(new File([pngBlob], 'x.png', { type: 'image/png' }), {
    fileType: 'image/jpeg',
    useWebWorker: true,
    maxSizeMB,
  });
}

async function pngToPdf(pngBlob: Blob): Promise<Blob> {
  const bytes = await pngBlob.arrayBuffer();
  const pdf = await PDFDocument.create();
  const png = await pdf.embedPng(bytes);
  const page = pdf.addPage([png.width, png.height]);
  page.drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
  const out = await pdf.save();
  return new Blob([out.slice().buffer], { type: 'application/pdf' });
}

export default function LogoExportPage() {
  const [svgText, setSvgText] = useState('');
  const [basename, setBasename] = useState('logo');
  const [singleColour, setSingleColour] = useState('#00FFCF');
  const [twoColourA, setTwoColourA] = useState('#0D0035');
  const [twoColourB, setTwoColourB] = useState('#00FFCF');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  function onFile(file: File | undefined) {
    if (!file) return;
    setError('');
    setBasename(file.name.replace(/\.svg$/i, '') || 'logo');
    file.text().then(setSvgText);
  }

  async function buildPackage() {
    if (busy || !svgText.trim()) return;
    setBusy(true);
    setError('');
    setStatus('Building…');
    const opts: RecolourOptions = { singleColour, twoColourA, twoColourB };
    try {
      const zip = new JSZip();
      for (const variant of VARIANTS) {
        setStatus(`Building ${variant}…`);
        const recoloured = recolour(svgText, variant, opts);
        const cropped = tightCrop(recoloured);
        const label = VARIANT_LABEL[variant];

        zip.file(`${basename}-${label}.svg`, cropped);

        const png1 = await svgToPng(cropped, 2); // 1x baseline @2 device scale for crispness
        const png2 = await svgToPng(cropped, 4); // 2x
        zip.file(`${basename}-${label}.png`, png1);
        zip.file(`${basename}-${label}-2x.png`, png2);

        const jpg = await pngToJpg(png2);
        zip.file(`${basename}-${label}.jpg`, jpg);

        const cap500 = await cap(png2, 0.5);
        const cap1000 = await cap(png2, 1.0);
        zip.file(`${basename}-${label}-max500kb.jpg`, cap500);
        zip.file(`${basename}-${label}-max1mb.jpg`, cap1000);

        const pdf = await pngToPdf(png2);
        zip.file(`${basename}-${label}.pdf`, pdf);
      }
      const out = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${basename}-export-package.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('Done — package downloaded.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Package build failed.');
      setStatus('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Logo Export Package Builder"
      subtitle="Give it one coloured SVG → get white / black / single-colour / 2-colour variants, tight-cropped, as SVG + PNG (1x/2x) + JPG + size-capped + PDF, named by convention, in one ZIP. All in your browser."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 max-w-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Source SVG logo</span>
          <input type="file" accept=".svg,image/svg+xml" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm text-subtle" />
        </label>
        <label className="flex flex-col gap-1.5 max-w-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Base filename</span>
          <input type="text" value={basename} onChange={(e) => setBasename(e.target.value)} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis" />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Single colour</span>
            <input type="color" value={singleColour} onChange={(e) => setSingleColour(e.target.value)} className="h-11 w-full rounded-lg border border-subtle bg-transparent" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">2-colour · A</span>
            <input type="color" value={twoColourA} onChange={(e) => setTwoColourA(e.target.value)} className="h-11 w-full rounded-lg border border-subtle bg-transparent" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">2-colour · B</span>
            <input type="color" value={twoColourB} onChange={(e) => setTwoColourB(e.target.value)} className="h-11 w-full rounded-lg border border-subtle bg-transparent" />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={buildPackage}
            disabled={busy || !svgText.trim()}
            className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors disabled:opacity-60"
          >
            {busy ? 'Working…' : 'Build & download package (.zip)'}
          </button>
          {status && <span className="text-xs text-muted">{status}</span>}
        </div>
        {error && <p className="text-sm text-spark">{error}</p>}
        <p className="text-xs text-muted">
          2-colour remaps every fill to the nearer of A/B. TIFF and true-vector PDF are on the roadmap —
          PDFs here embed the 2x raster.
        </p>
      </div>

      {svgText && (
        <div className="rounded-xl border border-subtle bg-subtle p-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Source preview</span>
          <div
            className="mt-3 rounded-lg border border-subtle bg-default p-4 max-h-64 overflow-hidden [&_svg]:max-h-56 [&_svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: svgText }}
          />
        </div>
      )}
    </ToolLayout>
  );
}
