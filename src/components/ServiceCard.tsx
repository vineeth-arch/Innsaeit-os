import type { ServiceEntry } from '../types';
import AddToBitwarden from './AddToBitwarden';

export default function ServiceCard({ service }: { service: ServiceEntry }) {
  const isCredentials = service.category === 'Credentials';
  const isApiProvider = service.category === 'API Provider';

  // Credentials (Bitwarden) — prominent "ticket stub" tile.
  if (isCredentials) {
    return (
      <article className="flex flex-col gap-4 rounded-xl border border-brand-default/40 bg-cal-stamp p-6 shadow-lg">
        <div>
          <h3 className="text-2xl font-extrabold text-emphasis leading-[0.95]">{service.name}</h3>
          <p className="mt-1 text-sm text-subtle">{service.description}</p>
        </div>
        <a
          href={service.dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tap justify-center w-full px-4 py-3 rounded-xl bg-brand-default text-brand font-extrabold hover:bg-brand-emphasis transition-colors"
        >
          🔓 Open Bitwarden Vault ↗
        </a>
        {service.notes && <p className="text-xs text-muted italic">{service.notes}</p>}
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-subtle bg-subtle p-5 hover:border-emphasis transition-colors">
      <div>
        <h3 className="text-xl font-extrabold text-emphasis leading-[0.95]">{service.name}</h3>
        <p className="mt-1 text-sm text-subtle leading-relaxed">{service.description}</p>
      </div>

      <a
        href={service.dashboardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tap justify-center w-full px-4 py-2.5 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors"
      >
        {isApiProvider ? 'Open console ↗' : 'Open dashboard ↗'}
      </a>

      {service.keyRotationUrl && (
        <a
          href={service.keyRotationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tap justify-center w-full px-4 py-2.5 rounded-xl border border-brand-default/50 text-brand-default font-semibold text-sm hover:bg-brand-default/10 transition-colors"
        >
          🔑 Manage / rotate keys ↗
        </a>
      )}

      {service.notes && <p className="text-xs text-muted italic">{service.notes}</p>}

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {isApiProvider && <AddToBitwarden />}
        {service.bitwardenItem && (
          <span className="text-[11px] text-muted">🔑 key in Bitwarden → {service.bitwardenItem}</span>
        )}
      </footer>
    </article>
  );
}
