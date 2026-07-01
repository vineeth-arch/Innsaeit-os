import { buildBitwardenAddUrl, BITWARDEN_TOOLTIP } from '../lib/bitwarden';

export default function AddToBitwarden() {
  return (
    <a
      href={buildBitwardenAddUrl()}
      target="_blank"
      rel="noopener noreferrer"
      title={BITWARDEN_TOOLTIP}
      className="tap px-3 py-1.5 rounded-lg text-xs font-semibold border border-subtle text-subtle hover:text-brand-default hover:border-brand-default transition-colors"
    >
      ➕ Add to Bitwarden
    </a>
  );
}
