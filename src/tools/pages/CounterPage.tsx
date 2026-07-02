import { useMemo, useState } from 'react';
import ToolLayout from '../components/ToolLayout';

const LIMITS = [
  { label: 'Amazon title', limit: 200 },
  { label: 'Meta description', limit: 160 },
  { label: 'Meta title', limit: 60 },
  { label: 'WhatsApp preview', limit: 65 },
];

export default function CounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const readingMinutes = words > 0 ? Math.max(1, Math.round(words / 200)) : 0;
    return { chars, words, lines, readingMinutes };
  }, [text]);

  return (
    <ToolLayout title="Character/Word Counter" subtitle="Chars, words, lines, reading time, plus common length limits — runs entirely in your browser.">
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste packaging copy, a title, or a description…"
          rows={6}
          className="px-3 py-2 rounded-lg bg-default border border-subtle text-emphasis placeholder:text-muted resize-y"
        />
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-subtle p-3">
          <p className="text-xs text-muted">Characters</p>
          <p className="text-lg font-bold text-emphasis">{stats.chars}</p>
        </div>
        <div className="rounded-lg border border-subtle p-3">
          <p className="text-xs text-muted">Words</p>
          <p className="text-lg font-bold text-emphasis">{stats.words}</p>
        </div>
        <div className="rounded-lg border border-subtle p-3">
          <p className="text-xs text-muted">Lines</p>
          <p className="text-lg font-bold text-emphasis">{stats.lines}</p>
        </div>
        <div className="rounded-lg border border-subtle p-3">
          <p className="text-xs text-muted">Reading time</p>
          <p className="text-lg font-bold text-emphasis">{stats.readingMinutes} min</p>
        </div>
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Length limits</span>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LIMITS.map((l) => {
            const over = stats.chars > l.limit;
            return (
              <div key={l.label} className="flex items-center justify-between rounded-lg border border-subtle p-3">
                <span className="text-sm text-subtle">{l.label}</span>
                <span className={`text-sm font-bold ${over ? 'text-spark' : 'text-brand-default'}`}>
                  {stats.chars}/{l.limit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
