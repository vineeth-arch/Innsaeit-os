import ToolLayout from '../components/ToolLayout';
import { PAPER_GROUPS } from '../lib/paper';

export default function PaperPage() {
  return (
    <ToolLayout title="Paper Size Helper" subtitle="A/B-series, SRA print sheets and common Indian sheet sizes — reference table.">
      {PAPER_GROUPS.map((group) => (
        <div key={group.label} className="rounded-xl border border-subtle bg-subtle p-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">{group.label}</span>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {group.sizes.map((s) => (
              <div key={s.name} className="rounded-lg border border-subtle p-3">
                <p className="text-sm font-bold text-emphasis">{s.name}</p>
                <p className="text-xs text-muted">{s.widthMm} × {s.heightMm} mm</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ToolLayout>
  );
}
