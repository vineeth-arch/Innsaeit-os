import { useMemo, useState } from 'react';
import {
  apps,
  platforms,
  apiProviders,
  credentials,
} from './config/innsaeit-os.config';
import type { AppEntry, ServiceEntry } from './types';
import AppCard from './components/AppCard';
import ServiceCard from './components/ServiceCard';
import SearchBar from './components/SearchBar';

function appHaystack(a: AppEntry): string {
  return [
    a.name,
    a.description,
    a.notes ?? '',
    a.stack.join(' '),
    a.backends.map((b) => b.label).join(' '),
    a.bitwardenItem ?? '',
  ]
    .join(' ')
    .toLowerCase();
}

function serviceHaystack(s: ServiceEntry): string {
  return [s.name, s.description, s.notes ?? '', s.category, s.bitwardenItem ?? '']
    .join(' ')
    .toLowerCase();
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-8">
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text">{title}</h2>
        {subtitle && <span className="text-sm text-text-dim">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

export default function App() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return { apps, platforms, apiProviders, credentials };
    return {
      apps: apps.filter((a) => appHaystack(a).includes(q)),
      platforms: platforms.filter((s) => serviceHaystack(s).includes(q)),
      apiProviders: apiProviders.filter((s) => serviceHaystack(s).includes(q)),
      credentials: credentials.filter((s) => serviceHaystack(s).includes(q)),
    };
  }, [q]);

  const count =
    filtered.apps.length +
    filtered.platforms.length +
    filtered.apiProviders.length +
    filtered.credentials.length;

  return (
    <div className="min-h-dvh px-4 pb-24 max-w-6xl mx-auto">
      <SearchBar value={query} onChange={setQuery} count={count} />

      <header className="pt-10 pb-2">
        <p className="text-mint font-semibold tracking-wide text-sm uppercase">
          Design Innsaeit
        </p>
        <h1 className="mt-1 text-4xl sm:text-6xl font-extrabold text-text leading-[0.95]">
          Innsaeit&nbsp;OS
        </h1>
        <p className="mt-3 max-w-xl text-text-dim leading-relaxed">
          One page to every app and console you run. A map, not a store —
          <span className="text-text"> zero secrets live here.</span> Real
          credentials stay in Bitwarden.
        </p>
      </header>

      {filtered.credentials.length > 0 && (
        <Section title="Credentials">
          <div className={GRID}>
            {filtered.credentials.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Section>
      )}

      {filtered.apps.length > 0 && (
        <Section title="My Apps" subtitle={`${filtered.apps.length} live front-ends`}>
          <div className={GRID}>
            {filtered.apps.map((a) => (
              <AppCard key={a.id} app={a} />
            ))}
          </div>
        </Section>
      )}

      {filtered.platforms.length > 0 && (
        <Section title="Platforms" subtitle="infra dashboards">
          <div className={GRID}>
            {filtered.platforms.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Section>
      )}

      {filtered.apiProviders.length > 0 && (
        <Section title="API Providers" subtitle="consoles + key rotation">
          <div className={GRID}>
            {filtered.apiProviders.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Section>
      )}

      {count === 0 && (
        <p className="mt-16 text-center text-text-dim">
          No matches for “{query}”.
        </p>
      )}

      <footer className="mt-20 pt-6 border-t border-white/5 text-xs text-text-dim/70">
        Edit <code className="text-mint">src/config/innsaeit-os.config.ts</code> to
        add or change entries. This app stores no secrets.
      </footer>
    </div>
  );
}
