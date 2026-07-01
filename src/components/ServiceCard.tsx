import type { ServiceEntry } from '../types';
import AddToBitwarden from './AddToBitwarden';

export default function ServiceCard({ service }: { service: ServiceEntry }) {
  const isCredentials = service.category === 'Credentials';
  const isApiProvider = service.category === 'API Provider';

  // Credentials (Bitwarden) — big prominent tile.
  if (isCredentials) {
    return (
      <article className="flex flex-col gap-4 rounded-2xl border border-mint/40 bg-gradient-to-br from-ink-2/80 to-indigo/30 p-6 shadow-[0_0_40px_-12px_rgba(0,255,207,0.35)]">
        <div>
          <h3 className="text-2xl font-extrabold text-text leading-tight">{service.name}</h3>
          <p className="mt-1 text-sm text-text-dim">{service.description}</p>
        </div>
        <a
          href={service.dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tap justify-center w-full px-4 py-3 rounded-xl bg-mint text-ink font-extrabold hover:brightness-110 active:brightness-95 transition"
        >
          🔓 Open Bitwarden Vault ↗
        </a>
        {service.notes && <p className="text-xs text-text-dim/80 italic">{service.notes}</p>}
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-2/40 p-5 hover:border-white/20 transition-colors">
      <div>
        <h3 className="text-xl font-bold text-text leading-tight">{service.name}</h3>
        <p className="mt-1 text-sm text-text-dim leading-relaxed">{service.description}</p>
      </div>

      <a
        href={service.dashboardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tap justify-center w-full px-4 py-2.5 rounded-xl bg-mint text-ink font-bold text-sm hover:brightness-110 active:brightness-95 transition"
      >
        {isApiProvider ? 'Open console ↗' : 'Open dashboard ↗'}
      </a>

      {service.keyRotationUrl && (
        <a
          href={service.keyRotationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tap justify-center w-full px-4 py-2.5 rounded-xl border border-mint/40 text-mint font-semibold text-sm hover:bg-mint/10 transition"
        >
          🔑 Manage / rotate keys ↗
        </a>
      )}

      {service.notes && <p className="text-xs text-text-dim/80 italic">{service.notes}</p>}

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {isApiProvider && <AddToBitwarden />}
        {service.bitwardenItem && (
          <span className="text-[11px] text-text-dim/70">
            🔑 key in Bitwarden → {service.bitwardenItem}
          </span>
        )}
      </footer>
    </article>
  );
}
