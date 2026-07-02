import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import Dropzone from '../components/Dropzone';
import ToolLayout from '../components/ToolLayout';
import { FORMATS, avifSupported, run, type FormatKey, type CompressResult } from '../lib/compress';

const fmtBytes = (n: number) =>
  n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(2) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

type Result = CompressResult & { url: string };

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<FormatKey>('webp');
  const [quality, setQuality] = useState(0.8);
  const [maxDim, setMaxDim] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const avif = useMemo(() => avifSupported(), []);
  const formats = useMemo(() => FORMATS.filter((f) => f.key !== 'avif' || avif), [avif]);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  function onFile(f: File) {
    setError('');
    setResult(null);
    setFile(f);
  }

  async function handleRun() {
    if (!file || busy) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const out = await run(file, { format, quality: Number(quality), maxDimension: Number(maxDim) });
      setResult({ ...out, url: URL.createObjectURL(out.blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed.');
    } finally {
      setBusy(false);
    }
  }

  const isPng = format === 'png';
  const saved = result && file ? Math.round((1 - result.size / file.size) * 100) : null;

  return (
    <ToolLayout
      title="Compress & Convert"
      subtitle={`Shrink and convert images (WebP / JPG / PNG${avif ? ' / AVIF' : ''}) — runs entirely in your browser.`}
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        {!file && <Dropzone onFile={onFile} hint="PNG, JPG or WebP." />}

        {file && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Format</span>
                <select
                  value={format}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value as FormatKey)}
                  disabled={busy}
                  className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
                >
                  {formats.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </label>
              <label className={`flex flex-col gap-1.5 ${isPng ? 'opacity-50' : ''}`}>
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                  Quality · {Math.round(quality * 100)}%
                </span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={busy || isPng}
                  className="accent-[color:var(--cal-brand)]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                  Max dimension (px, 0 = keep)
                </span>
                <input
                  type="number"
                  min="0"
                  step="64"
                  value={maxDim}
                  onChange={(e) => setMaxDim(Number(e.target.value))}
                  disabled={busy}
                  className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRun}
                disabled={busy}
                className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors disabled:opacity-60"
              >
                {busy ? 'Working…' : 'Compress'}
              </button>
              <button
                onClick={() => { setFile(null); setResult(null); }}
                disabled={busy}
                className="tap px-4 rounded-xl border border-subtle text-subtle font-semibold text-sm hover:text-emphasis transition-colors"
              >
                Choose another
              </button>
              <span className="text-xs text-muted">{file.name} · {fmtBytes(file.size)}</span>
            </div>
          </>
        )}
        {error && <p className="text-sm text-spark">{error}</p>}
      </div>

      {result && (
        <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Result</span>
              <p className="mt-1 text-sm text-subtle">
                {fmtBytes(file!.size)} → <strong className="text-emphasis">{fmtBytes(result.size)}</strong>{' '}
                <span className="text-brand-default">{saved! > 0 ? `−${saved}%` : `+${Math.abs(saved!)}%`}</span>{' '}
                <span className="text-muted">{result.width}×{result.height}</span>
              </p>
            </div>
            <a
              href={result.url}
              download={(file!.name.replace(/\.[^.]+$/, '') || 'image') + '.' + result.ext}
              className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors"
            >
              Download
            </a>
          </div>
          <div className="rounded-lg overflow-hidden border border-subtle">
            <img src={result.url} alt="Result" className="w-full h-auto" />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
