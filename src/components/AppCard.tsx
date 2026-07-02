import type { AppEntry, AppStatus } from '../types';
import { trackClick } from '../lib/usage';
import BackendChip from './BackendChip';
import AddToBitwarden from './AddToBitwarden';

const STATUS: Record<AppStatus, { label: string; cls: string }> = {
  live: { label: 'live', cls: 'bg-brand-default/10 text-brand-default border-brand-default/40' },
  wip: { label: 'wip', cls: 'bg-emphasis text-subtle border-emphasis' },
  moving: { label: 'moving', cls: 'bg-spark/10 text-spark border-spark/40' },
};

export default function AppCard({ app }: { app: AppEntry }) {
  const status = app.status ? STATUS[app.status] : null;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-subtle bg-subtle p-5 hover:border-emphasis transition-colors">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-extrabold text-emphasis leading-[0.95]">{app.name}</h3>
        {status && (
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${status.cls}`}
          >
            {status.label}
          </span>
        )}
      </header>

      <p className="text-sm text-subtle leading-relaxed">{app.description}</p>

      <a
        href={app.frontendUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(app.id)}
        className="tap justify-center w-full px-4 py-2.5 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors"
      >
        Open app ↗
      </a>

      {app.backends.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {app.backends.map((b) => (
            <BackendChip key={b.label} backend={b} />
          ))}
        </div>
      )}

      {app.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {app.stack.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded text-[11px] text-muted bg-cal-muted">
              {s}
            </span>
          ))}
        </div>
      )}

      {app.notes && <p className="text-xs text-muted italic">{app.notes}</p>}

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <AddToBitwarden />
        {app.bitwardenItem && (
          <span className="text-[11px] text-muted">🔑 in Bitwarden → {app.bitwardenItem}</span>
        )}
      </footer>
    </article>
  );
}
