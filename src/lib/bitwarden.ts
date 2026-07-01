/**
 * A website CANNOT write into the Bitwarden vault — that boundary is enforced
 * by the browser and only the Bitwarden extension/app can cross it. So this
 * returns a deep link that OPENS the web vault's add-item screen. The user
 * still types the secret themselves. No secret ever passes through this app.
 */
export function buildBitwardenAddUrl(): string {
  // ponytail: single static route; the `action=add` hint is harmless if the
  // vault ignores it and lands on the main vault view.
  return 'https://vault.bitwarden.com/#/vault?action=add';
}

export const BITWARDEN_TOOLTIP =
  'Opens your Bitwarden vault to add this manually — for security, secrets are never saved by this app.';
