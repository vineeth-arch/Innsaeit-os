export type BackendType =
  | 'supabase'
  | 'vercel'
  | 'railway'
  | 'cloudflare'
  | 'r2'
  | 'dns'
  | 'other';

export type Backend = {
  label: string;
  url: string;
  type: BackendType;
};

export type AppStatus = 'live' | 'wip' | 'moving';

export type AppEntry = {
  id: string;
  name: string;
  description: string;
  category: 'App';
  frontendUrl: string;
  status?: AppStatus;
  backends: Backend[];
  stack: string[];
  notes?: string;
  /** Name of the Bitwarden item — NOT the secret itself. */
  bitwardenItem?: string;
};

export type ServiceCategory = 'Platform' | 'API Provider' | 'Credentials';

export type ServiceEntry = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  dashboardUrl: string;
  /** Deep link to the manage-keys page (behind the provider's login). */
  keyRotationUrl?: string;
  notes?: string;
  /** Name of the Bitwarden item — NOT the secret itself. */
  bitwardenItem?: string;
};

export type AnyEntry = AppEntry | ServiceEntry;
