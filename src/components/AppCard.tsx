import type { AppEntry, AppStatus } from '../types';
import BackendChip from './BackendChip';
import AddToBitwarden from './AddToBitwarden';

const STATUS: Record<AppStatus, { label: string; cls: string }> = {
  live: { label: 'live', cls: 'bg-mint/15 text-mint border-mint/40' },
  wip: { label: 'wip', cls: 'bg-amber-400/15 text-amber-300 border-amber-400/40' },
  moving: { label: 'moving', cls: 'bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/40' },
};

export default function AppCard({ app }: { app: AppEntry }) {
  const status = app.status ? STATUS[app.status] : null;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-2/40 p-5 hover:border-white/20 transition-colors">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-text leading-tight">{app.name}</h3>
        {status && (
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${status.cls}`}
          >
            {status.label}
          </span>
        )}
      </header>

      <p className="text-sm text-text-dim leading-relaxed">{app.description}</p>

      <a
        href={app.frontendUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tap justify-center w-full px-4 py-2.5 rounded-xl bg-mint text-ink font-bold text-sm hover:brightness-110 active:brightness-95 transition"
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
            <span key={s} className="px-2 py-0.5 rounded text-[11px] text-text-dim bg-white/5">
              {s}
            </span>
          ))}
        </div>
      )}

      {app.notes && <p className="text-xs text-text-dim/80 italic">{app.notes}</p>}

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <AddToBitwarden />
        {app.bitwardenItem && (
          <span className="text-[11px] text-text-dim/70">
            🔑 in Bitwarden → {app.bitwardenItem}
          </span>
        )}
      </footer>
    </article>
  );
}
