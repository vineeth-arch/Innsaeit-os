import { useEffect, useMemo, useState } from 'react';
import Dropzone from '../components/Dropzone';
import ToolLayout from '../components/ToolLayout';
import { DEFAULTS, run } from '../lib/vectorize';

export default function VectorizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState('');
  const [colors, setColors] = useState(DEFAULTS.numberofcolors);
  const [pathomit, setPathomit] = useState(DEFAULTS.pathomit);
  const [busy, setBusy] = useState(false);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => () => { if (srcUrl) URL.revokeObjectURL(srcUrl); }, [srcUrl]);

  function onFile(f: File) {
    setError('');
    setSvg('');
    setFile(f);
    setSrcUrl(URL.createObjectURL(f));
  }

  async function handleRun() {
    if (!file || busy) return;
    setBusy(true);
    setError('');
    setSvg('');
    try {
      const out = await run(file, { numberofcolors: Number(colors), pathomit: Number(pathomit) });
      setSvg(out.svg);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Vectorisation failed. Try a smaller or simpler image.');
    } finally {
      setBusy(false);
    }
  }

  const svgUrl = useMemo(
    () => (svg ? URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })) : ''),
    [svg],
  );
  useEffect(() => () => { if (svgUrl) URL.revokeObjectURL(svgUrl); }, [svgUrl]);

  return (
    <ToolLayout
      title="Vectorize"
      subtitle="Trace logos & line art from raster into SVG — runs in your browser. Best on clean, simple artwork."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        {!file && <Dropzone onFile={onFile} hint="A clean logo or line drawing works best." />}

        {file && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                  Colours · {colors}
                </span>
                <input
                  type="range"
                  min="2"
                  max="64"
                  step="1"
                  value={colors}
                  onChange={(e) => setColors(Number(e.target.value))}
                  disabled={busy}
                  className="accent-[color:var(--cal-brand)]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                  Despeckle · {pathomit}
                </span>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="1"
                  value={pathomit}
                  onChange={(e) => setPathomit(Number(e.target.value))}
                  disabled={busy}
                  className="accent-[color:var(--cal-brand)]"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRun}
                disabled={busy}
                className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors disabled:opacity-60"
              >
                {busy ? 'Tracing…' : 'Vectorize'}
              </button>
              <button
                onClick={() => { setFile(null); setSrcUrl(''); setSvg(''); }}
                disabled={busy}
                className="tap px-4 rounded-xl border border-subtle text-subtle font-semibold text-sm hover:text-emphasis transition-colors"
              >
                Choose another
              </button>
              <span className="text-xs text-muted">{file.name}</span>
            </div>
          </>
        )}
        {error && <p className="text-sm text-spark">{error}</p>}
      </div>

      {(srcUrl || svg) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {srcUrl && (
            <figure className="rounded-xl border border-subtle bg-subtle p-4 flex flex-col gap-2">
              <figcaption className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                Original (raster)
              </figcaption>
              <div className="rounded-lg overflow-hidden border border-subtle bg-default">
                <img src={srcUrl} alt="Original" className="w-full h-auto" />
              </div>
            </figure>
          )}
          {svg && (
            <figure className="rounded-xl border border-subtle bg-subtle p-4 flex flex-col gap-2">
              <figcaption className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                Vectorised (SVG)
              </figcaption>
              <div
                className="rounded-lg overflow-hidden border border-subtle bg-default p-2"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <a
                href={svgUrl}
                download={(file?.name?.replace(/\.[^.]+$/, '') || 'image') + '.svg'}
                className="tap justify-center px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors"
              >
                Download SVG
              </a>
            </figure>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
