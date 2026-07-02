import { useMemo, useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { diffLines } from '../lib/diff';

const LINE_CLASS: Record<string, string> = {
  same: 'text-subtle',
  added: 'bg-brand-default/10 text-emphasis',
  removed: 'bg-spark/10 text-emphasis line-through decoration-spark/60',
};

export default function DiffPage() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const lines = useMemo(() => diffLines(a, b), [a, b]);
  const hasDiff = a.trim() || b.trim();

  return (
    <ToolLayout title="Text Diff" subtitle="Compare two versions of copy line-by-line — runs entirely in your browser.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Original</span>
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={8}
            className="px-3 py-2 rounded-lg bg-subtle border border-subtle text-emphasis resize-y"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Revised</span>
          <textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            rows={8}
            className="px-3 py-2 rounded-lg bg-subtle border border-subtle text-emphasis resize-y"
          />
        </label>
      </div>

      {hasDiff && (
        <div className="rounded-xl border border-subtle bg-subtle p-4 font-mono text-sm">
          {lines.map((line, i) => (
            <div key={i} className={`px-2 py-0.5 rounded ${LINE_CLASS[line.type]}`}>
              <span className="select-none mr-2 text-muted">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
              </span>
              {line.text || ' '}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
