import { useState } from 'react';
import JSZip from 'jszip';
import ToolLayout from '../components/ToolLayout';
import { toPngBlob, type DotStyle } from '../lib/qrRender';
import { toFilename } from '../lib/slugify';

const MAX_ROWS = 500;

type Row = { data: string; name: string };

function parseCsv(text: string): Row[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const data = cols[0] ?? '';
      const name = cols[1] ? toFilename(cols[1]) : toFilename(data) || `qr-${i + 1}`;
      return { data, name };
    })
    .filter((r) => r.data);
}

export default function QrBulkPage() {
  const [csv, setCsv] = useState('https://designinnsaeit.com, home\nhttps://go.designinnsaeit.com, shortener');
  const [fg, setFg] = useState('#0D0035');
  const [bg, setBg] = useState('#FFFFFF');
  const [dotStyle, setDotStyle] = useState<DotStyle>('rounded');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const rows = parseCsv(csv);
  const capped = rows.slice(0, MAX_ROWS);

  async function exportZip() {
    if (busy || capped.length === 0) return;
    setBusy(true);
    setStatus('Generating…');
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      for (let i = 0; i < capped.length; i++) {
        const row = capped[i];
        let name = row.name;
        while (used.has(name)) name = `${row.name}-${i + 1}`;
        used.add(name);
        const blob = await toPngBlob({ text: row.data, fg, bg, dotStyle, size: 512 });
        zip.file(`${name}.png`, blob);
        setStatus(`Generating… ${i + 1}/${capped.length}`);
      }
      const out = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-batch.zip';
      a.click();
      URL.revokeObjectURL(url);
      setStatus(`Done — ${capped.length} QR codes zipped.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Bulk QR Batch Export"
      subtitle="Generate branded QR codes from a CSV and download them all as one ZIP — runs in your browser."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
            CSV — first column = data, optional second column = filename
          </span>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={6}
            className="px-3 py-2 rounded-lg bg-default border border-subtle text-emphasis resize-y font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5 max-w-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Or upload a .csv</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) f.text().then(setCsv);
            }}
            className="text-sm text-subtle"
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
            <select value={dotStyle} onChange={(e) => setDotStyle(e.target.value as DotStyle)} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis">
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="dots">Dots</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportZip}
            disabled={busy || capped.length === 0}
            className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors disabled:opacity-60"
          >
            {busy ? 'Working…' : `Export ${capped.length} QR code(s) as ZIP`}
          </button>
          {status && <span className="text-xs text-muted">{status}</span>}
        </div>
        {rows.length > MAX_ROWS && (
          <p className="text-xs text-spark">Capped at {MAX_ROWS} rows — only the first {MAX_ROWS} will be exported.</p>
        )}
      </div>
    </ToolLayout>
  );
}
