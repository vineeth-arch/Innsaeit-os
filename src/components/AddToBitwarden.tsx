import { buildBitwardenAddUrl, BITWARDEN_TOOLTIP } from '../lib/bitwarden';

export default function AddToBitwarden() {
  return (
    <a
      href={buildBitwardenAddUrl()}
      target="_blank"
      rel="noopener noreferrer"
      title={BITWARDEN_TOOLTIP}
      className="tap px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-text-dim hover:text-text hover:border-mint/40 transition-colors"
    >
      ➕ Add to Bitwarden
    </a>
  );
}
