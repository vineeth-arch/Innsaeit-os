import { apiProviders, platforms } from './config/innsaeit-os.config';
import ServiceCard from './components/ServiceCard';

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

export default function SettingsPage() {
  return (
    <div className="min-h-dvh px-4 pb-24 max-w-6xl mx-auto">
      <header className="pt-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
          Design Innsæit
        </p>
        <h1 className="mt-1 text-3xl sm:text-5xl font-extrabold text-emphasis leading-[0.95] -tracking-[0.02em]">
          Settings
        </h1>
        <p className="mt-3 max-w-xl text-subtle leading-relaxed">
          Every integration this OS knows about, with deep links to where each one is managed.
        </p>
        <div className="mt-4 rounded-xl border border-brand-default/30 bg-subtle/60 px-4 py-3 text-sm text-subtle">
          🔒 This app stores no keys, ever. These are deep links to each provider's own console and
          key-rotation page — not a vault. Real credentials live in Bitwarden.
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-extrabold text-emphasis">API Providers</h2>
        <div className={GRID}>
          {apiProviders.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-extrabold text-emphasis">Platforms</h2>
        <div className={GRID}>
          {platforms.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <footer className="mt-20 pt-6 border-t border-subtle text-xs text-muted">
        Add or edit an integration in <code className="text-brand-default">src/config/innsaeit-os.config.ts</code>.
      </footer>
    </div>
  );
}
