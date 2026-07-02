import { useEffect, useState } from 'react';
import Dropzone from '../components/Dropzone';
import ToolLayout from '../components/ToolLayout';
import { run, type Swatch } from '../lib/palette';

export default function PalettePage() {
  const [srcUrl, setSrcUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => () => { if (srcUrl) URL.revokeObjectURL(srcUrl); }, [srcUrl]);

  async function onFile(f: File) {
    setError('');
    setSwatches([]);
    setSrcUrl(URL.createObjectURL(f));
    setBusy(true);
    try {
      const out = await run(f);
      setSwatches(out.swatches);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read colours from this image.');
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? '' : k)), 1200);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <ToolLayout
      title="Palette from Image"
      subtitle="Extract brand swatches from a moodboard or packshot — runs in your browser."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <Dropzone onFile={onFile} hint="Drop a photo or moodboard." disabled={busy} />
        {busy && <p className="text-sm text-subtle">Reading colours…</p>}
        {error && <p className="text-sm text-spark">{error}</p>}
      </div>

      {srcUrl && (
        <div className="rounded-xl overflow-hidden border border-subtle">
          <img src={srcUrl} alt="Source" className="w-full h-auto max-h-80 object-cover" />
        </div>
      )}

      {swatches.length > 0 && (
        <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Swatches</span>
            <button
              onClick={() => copy(swatches.map((s) => s.hex).join(', '), 'all')}
              className="tap px-3 rounded-lg text-xs font-semibold border border-subtle text-subtle hover:text-brand-default hover:border-brand-default transition-colors"
            >
              {copied === 'all' ? 'Copied ✓' : 'Copy all HEX'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {swatches.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-lg border border-subtle p-3">
                <button
                  style={{ background: s.hex }}
                  title={`Copy ${s.hex}`}
                  onClick={() => copy(s.hex, s.name)}
                  className="h-11 w-11 shrink-0 rounded-lg border border-subtle"
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-semibold text-subtle">{s.label}</span>
                  <button
                    onClick={() => copy(s.hex, s.name)}
                    className="text-left text-sm font-bold text-emphasis hover:text-brand-default transition-colors"
                  >
                    {copied === s.name ? 'Copied ✓' : s.hex.toUpperCase()}
                  </button>
                  <span className="text-[11px] text-muted">rgb({s.rgb.join(', ')})</span>
                  <span className="text-[11px] text-muted">hsl({s.hsl[0]}, {s.hsl[1]}%, {s.hsl[2]}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
