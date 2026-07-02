import { useEffect, useRef, useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { renderToCanvas, toSvgString, type DotStyle } from '../lib/qrRender';

export default function QrBrandedPage() {
  const [text, setText] = useState('https://designinnsaeit.com');
  const [fg, setFg] = useState('#0D0035');
  const [bg, setBg] = useState('#FFFFFF');
  const [dotStyle, setDotStyle] = useState<DotStyle>('rounded');
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      renderToCanvas(canvasRef.current, { text, fg, bg, dotStyle, size: 512, logo });
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not render QR.');
    }
  }, [text, fg, bg, dotStyle, logo]);

  function onLogo(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setLogo(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function downloadPng() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'branded-qr.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  function downloadSvg() {
    try {
      const svg = toSvgString({ text, fg, bg, dotStyle });
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'branded-qr.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* handled by preview error */
    }
  }

  return (
    <ToolLayout
      title="Branded QR Generator"
      subtitle="QR codes with brand colours, rounded dots and a centered logo — runs in your browser. Note: SVG export is vector but omits the logo overlay."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Data (text or URL)</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
          />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Foreground</span>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 w-full rounded-lg border border-subtle bg-transparent" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Background</span>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full rounded-lg border border-subtle bg-transparent" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Dot style</span>
            <select
              value={dotStyle}
              onChange={(e) => setDotStyle(e.target.value as DotStyle)}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            >
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="dots">Dots</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Centre logo (optional)</span>
          <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} className="text-sm text-subtle" />
        </label>
        {error && <p className="text-sm text-spark">{error}</p>}
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="max-w-full rounded-lg border border-subtle" style={{ imageRendering: 'pixelated' }} />
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadPng} className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors">
            Download PNG
          </button>
          <button onClick={downloadSvg} className="tap px-4 rounded-xl border border-subtle text-subtle font-semibold text-sm hover:text-emphasis transition-colors">
            Download SVG
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
