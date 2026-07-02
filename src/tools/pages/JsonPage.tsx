import { useMemo, useState } from 'react';
import ToolLayout from '../components/ToolLayout';

export default function JsonPage() {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, formatted: '', error: '' };
    try {
      const parsed = JSON.parse(input);
      return { ok: true as const, formatted: JSON.stringify(parsed, null, 2), error: '' };
    } catch (e) {
      return { ok: false as const, formatted: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }, [input]);

  return (
    <ToolLayout title="JSON Formatter" subtitle="Format, validate and pretty-print JSON — runs entirely in your browser.">
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"paste":"your JSON here"}'
          rows={8}
          className="px-3 py-2 rounded-lg bg-default border border-subtle text-emphasis placeholder:text-muted resize-y font-mono text-sm"
        />
        {!result.ok && <p className="text-sm text-spark">{result.error}</p>}
      </div>

      {result.ok && result.formatted && (
        <div className="rounded-xl border border-subtle bg-subtle p-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Formatted</span>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-default border border-subtle p-3 text-sm text-emphasis font-mono">
            {result.formatted}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
