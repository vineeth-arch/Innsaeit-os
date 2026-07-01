import type { Backend, BackendType } from '../types';

const ICON: Record<BackendType, string> = {
  supabase: '🟢',
  vercel: '▲',
  railway: '🚄',
  cloudflare: '🟠',
  r2: '🪣',
  dns: '🌐',
  other: '🔗',
};

export default function BackendChip({ backend }: { backend: Backend }) {
  return (
    <a
      href={backend.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open ${backend.label} ↗`}
      className="tap px-2.5 py-1 rounded-full text-xs font-medium bg-ink-2/70 border border-white/10 text-text-dim hover:text-text hover:border-mint/50 hover:bg-ink-2 transition-colors"
    >
      <span aria-hidden>{ICON[backend.type]}</span>
      <span>{backend.label}</span>
    </a>
  );
}
