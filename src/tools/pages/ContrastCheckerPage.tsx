import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { contrastRatio } from '../lib/contrast';

function Pill({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
        pass
          ? 'bg-brand-default/10 text-brand-default border-brand-default/40'
          : 'bg-transparent text-muted border-subtle'
      }`}
    >
      {label} {pass ? '✓' : '✗'}
    </span>
  );
}

export default function ContrastCheckerPage() {
  const [fg, setFg] = useState('#161310');
  const [bg, setBg] = useState('#EDEAE2');

  const result = contrastRatio(fg, bg);

  return (
    <ToolLayout
      title="Contrast/WCAG Checker"
      subtitle="Check a text/background colour pair against WCAG AA and AAA — pure browser math, no upload."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Text colour</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(fg) ? fg : '#000000'}
                onChange={(e) => setFg(e.target.value)}
                className="h-11 w-11 rounded-lg border border-subtle bg-transparent"
              />
              <input
                type="text"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="min-h-[44px] flex-1 px-3 rounded-lg bg-default border border-subtle text-emphasis"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Background colour</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(bg) ? bg : '#ffffff'}
                onChange={(e) => setBg(e.target.value)}
                className="h-11 w-11 rounded-lg border border-subtle bg-transparent"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="min-h-[44px] flex-1 px-3 rounded-lg bg-default border border-subtle text-emphasis"
              />
            </div>
          </label>
        </div>

        {!result && <p className="text-sm text-spark">Enter two valid hex colours (e.g. #161310).</p>}
      </div>

      {result && (
        <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
          <div
            className="rounded-lg border border-subtle p-8 text-center text-2xl font-extrabold"
            style={{ background: bg, color: fg }}
          >
            Sample text on this background
          </div>
          <p className="text-3xl font-extrabold text-emphasis">{result.ratio.toFixed(2)}:1</p>
          <div className="flex flex-wrap gap-2">
            <Pill pass={result.aaNormal} label="AA normal text" />
            <Pill pass={result.aaLarge} label="AA large text" />
            <Pill pass={result.aaaNormal} label="AAA normal text" />
            <Pill pass={result.aaaLarge} label="AAA large text" />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
