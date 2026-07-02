import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { validateGs1 } from '../lib/gs1';

export default function Gs1ValidatorPage() {
  const [input, setInput] = useState('4006381333931');

  const result = input.trim() ? validateGs1(input) : null;

  return (
    <ToolLayout
      title="GS1/EAN Validator"
      subtitle="Validate a GS1/EAN-8/12/13/14 barcode digit string and its check digit — pure browser math."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
            Barcode digits (EAN-8, UPC-12, EAN-13 or GS1-14)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
          />
        </label>

        {input.trim() && !result && (
          <p className="text-sm text-spark">Enter 8, 12, 13 or 14 digits.</p>
        )}
      </div>

      {result && (
        <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-3">
          <span
            className={`self-start px-3 py-1 rounded-full text-sm font-bold border ${
              result.valid
                ? 'bg-brand-default/10 text-brand-default border-brand-default/40'
                : 'bg-spark/10 text-spark border-spark/40'
            }`}
          >
            {result.valid ? 'Valid ✓' : 'Invalid ✗'}
          </span>
          <p className="text-sm text-subtle">
            Check digit in barcode: <strong className="text-emphasis">{result.actualCheckDigit}</strong>
            {' · '}
            Expected: <strong className="text-emphasis">{result.expectedCheckDigit}</strong>
          </p>
          <p className="text-xs text-muted">Cleaned input: {result.cleaned}</p>
        </div>
      )}
    </ToolLayout>
  );
}
