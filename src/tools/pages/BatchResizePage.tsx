import { useRef, useState, type ChangeEvent } from 'react';
import ToolLayout from '../components/ToolLayout';
import { run, type CompressResult } from '../lib/compress';

type Job = {
  file: File;
  status: 'pending' | 'done' | 'error';
  result?: CompressResult & { url: string };
  error?: string;
};

export default function BatchResizePage() {
  const [maxDim, setMaxDim] = useState(2000);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const picked = [...files].filter((f) => f.type.startsWith('image/'));
    setJobs((prev) => [...prev, ...picked.map((file) => ({ file, status: 'pending' as const }))]);
  }

  async function runAll() {
    if (busy || jobs.length === 0) return;
    setBusy(true);
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].status !== 'pending') continue;
      try {
        const out = await run(jobs[i].file, { maxDimension: maxDim });
        setJobs((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'done', result: { ...out, url: URL.createObjectURL(out.blob) } };
          return next;
        });
      } catch (e) {
        setJobs((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'error', error: e instanceof Error ? e.message : 'Failed' };
          return next;
        });
      }
    }
    setBusy(false);
  }

  function reset() {
    jobs.forEach((j) => j.result && URL.revokeObjectURL(j.result.url));
    setJobs([]);
  }

  return (
    <ToolLayout
      title="Batch Image Resizer"
      subtitle="Resize and compress multiple images to a fixed max dimension in one pass — runs in your browser."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 max-w-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Max dimension (px)</span>
          <input
            type="number"
            min={64}
            step={64}
            value={maxDim}
            onChange={(e) => setMaxDim(Math.max(64, Number(e.target.value)))}
            disabled={busy}
            className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
          />
        </label>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          className="min-h-[120px] flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-subtle bg-subtle/60 p-8 text-center cursor-pointer hover:border-emphasis transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <p className="font-semibold text-emphasis">Drop images, or click to browse</p>
          <p className="text-sm text-muted">Add as many as you like — they process one after another.</p>
        </div>

        {jobs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={runAll}
              disabled={busy}
              className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors disabled:opacity-60"
            >
              {busy ? 'Working…' : `Resize ${jobs.filter((j) => j.status === 'pending').length || jobs.length} image(s)`}
            </button>
            <button
              onClick={reset}
              disabled={busy}
              className="tap px-4 rounded-xl border border-subtle text-subtle font-semibold text-sm hover:text-emphasis transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {jobs.length > 0 && (
        <div className="flex flex-col gap-3">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="rounded-xl border border-subtle bg-subtle p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emphasis truncate">{job.file.name}</p>
                <p className="text-xs text-muted">
                  {job.status === 'pending' && 'Waiting…'}
                  {job.status === 'error' && <span className="text-spark">{job.error}</span>}
                  {job.status === 'done' && job.result && `${job.result.width}×${job.result.height}`}
                </p>
              </div>
              {job.status === 'done' && job.result && (
                <a
                  href={job.result.url}
                  download={(job.file.name.replace(/\.[^.]+$/, '') || 'image') + '.' + job.result.ext}
                  className="tap shrink-0 px-3 rounded-lg bg-brand-default text-brand font-bold text-xs hover:bg-brand-emphasis transition-colors"
                >
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
