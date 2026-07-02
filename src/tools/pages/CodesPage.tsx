import { useEffect, useRef, useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { CODE_TYPES, renderToCanvas, toSvg, type CodeTypeKey } from '../lib/codes';

export default function CodesPage() {
  const [type, setType] = useState<CodeTypeKey>('qrcode');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  const active = CODE_TYPES.find((t) => t.key === type) || CODE_TYPES[0];

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    if (!text) {
      setRendered(false);
      setError('');
      return;
    }
    renderToCanvas(canvasRef.current, { type, text })
      .then(() => { if (!cancelled) { setRendered(true); setError(''); } })
      .catch((e) => {
        if (!cancelled) {
          setRendered(false);
          setError(e instanceof Error ? e.message : 'Invalid data for this code type.');
        }
      });
    return () => { cancelled = true; };
  }, [type, text]);

  function downloadPng() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  async function downloadSvg() {
    try {
      const svg = await toSvg({ type, text });
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not export SVG.');
    }
  }

  return (
    <ToolLayout title="QR & Barcode" subtitle="Generate QR codes and retail barcodes — runs in your browser.">
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CodeTypeKey)}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            >
              {CODE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Data</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={active.hint}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis placeholder:text-muted"
            />
          </label>
        </div>
        <p className="text-xs text-muted">{active.hint}</p>
        {error && <p className="text-sm text-spark">{error}</p>}
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col items-center gap-4">
        <div className="min-h-[160px] flex items-center justify-center w-full">
          <canvas ref={canvasRef} style={{ display: rendered ? 'inline-block' : 'none', maxWidth: '100%' }} />
          {!rendered && <p className="text-sm text-muted">Enter data above to generate.</p>}
        </div>
        {rendered && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadPng}
              className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors"
            >
              Download PNG
            </button>
            <button
              onClick={downloadSvg}
              className="tap px-4 rounded-xl border border-subtle text-subtle font-semibold text-sm hover:text-emphasis transition-colors"
            >
              Download SVG
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
