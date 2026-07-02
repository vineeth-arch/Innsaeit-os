import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { toSlug, toSku, toFilename } from '../lib/slugify';

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked */
    }
  }
  return (
    <div className="rounded-lg border border-subtle p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-bold text-emphasis break-all">{value || <em className="text-muted">—</em>}</p>
      </div>
      <button
        onClick={copy}
        disabled={!value}
        className="tap shrink-0 px-3 rounded-lg text-xs font-semibold border border-subtle text-subtle hover:text-brand-default hover:border-brand-default transition-colors disabled:opacity-50"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </div>
  );
}

export default function SlugPage() {
  const [text, setText] = useState('');

  return (
    <ToolLayout title="Slug & SKU Generator" subtitle="Turn a product/proposal name into a URL slug, SKU code, or clean filename — runs entirely in your browser.">
      <div className="rounded-xl border border-subtle bg-subtle p-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Your text</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Hamleys Toy Box v2"
            className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis placeholder:text-muted"
          />
        </label>
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-3">
        <CopyRow label="URL slug" value={toSlug(text)} />
        <CopyRow label="SKU code" value={toSku(text)} />
        <CopyRow label="Filename" value={toFilename(text)} />
      </div>
    </ToolLayout>
  );
}
