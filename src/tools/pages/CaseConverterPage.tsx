import { useMemo, useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { CASES } from '../lib/caseConvert';

export default function CaseConverterPage() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState('');

  const results = useMemo(() => CASES.map((c) => ({ ...c, value: c.fn(text) })), [text]);

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? '' : k)), 1200);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <ToolLayout title="Case Converter" subtitle="Convert text between cases — runs entirely in your browser.">
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Your text</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here…"
            rows={4}
            className="px-3 py-2 rounded-lg bg-default border border-subtle text-emphasis placeholder:text-muted resize-y"
          />
        </label>
        {text && (
          <div>
            <button
              onClick={() => setText('')}
              className="tap px-3 rounded-lg text-xs font-semibold border border-subtle text-subtle hover:text-brand-default hover:border-brand-default transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((c) => (
          <div key={c.key} className="rounded-xl border border-subtle bg-subtle p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">{c.label}</span>
            </div>
            <span className="text-sm text-emphasis break-all min-h-[1.25rem]">
              {c.value || <em className="text-muted">—</em>}
            </span>
            <button
              onClick={() => copy(c.key, c.value)}
              disabled={!c.value}
              className="tap self-start px-3 rounded-lg text-xs font-semibold border border-subtle text-subtle hover:text-brand-default hover:border-brand-default transition-colors disabled:opacity-50"
            >
              {copied === c.key ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
