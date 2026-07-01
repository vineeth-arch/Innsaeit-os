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
import ThemeToggle from './components/ThemeToggle';

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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emphasis">{title}</h2>
        {subtitle && (
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
            {subtitle}
          </span>
        )}
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

      <header className="pt-10 pb-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
            Design Innsæit
          </p>
          <h1 className="mt-1 text-4xl sm:text-6xl font-extrabold text-emphasis leading-[0.9] -tracking-[0.04em]">
            Innsæit&nbsp;OS
          </h1>
          <p className="mt-3 max-w-xl text-subtle leading-relaxed">
            One page to every app and console you run. A map, not a store —
            <span className="text-emphasis"> zero secrets live here.</span> Real
            credentials stay in Bitwarden.
          </p>
        </div>
        <ThemeToggle />
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
        <p className="mt-16 text-center text-muted">No matches for “{query}”.</p>
      )}

      <footer className="mt-20 pt-6 border-t border-subtle text-xs text-muted">
        Edit <code className="text-brand-default">src/config/innsaeit-os.config.ts</code> to
        add or change entries. This app stores no secrets.
      </footer>
    </div>
  );
}
