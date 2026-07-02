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

/** 'operating' = my own business tools (hero). 'client' = client-facing portals. */
export type AppGroup = 'operating' | 'client';

export type AppEntry = {
  id: string;
  name: string;
  description: string;
  category: 'App';
  group: AppGroup;
  /** Client name for grouping client portals, e.g. 'Avarta', 'Hamleys'. */
  client?: string;
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

export type ToolEntry = {
  id: string;
  name: string;
  description: string;
  /** Internal route, e.g. '/tools/compress'. Mutually exclusive with `url`. */
  route?: string;
  /** External link, opened in a new tab. Mutually exclusive with `route`. */
  url?: string;
  badge?: string;
};

export type ToolStatus = 'built' | 'external' | 'backlog';

/** Where an external tool lives. Undefined for 'backlog' entries — nothing to link to yet. */
export type ToolSource = 'delphi' | 'oss';

export type ToolHubEntry = {
  id: string;
  name: string;
  description: string;
  /** One unified taxonomy — see tools-registry.config.ts for the canonical list. */
  category: string;
  status: ToolStatus;
  source?: ToolSource;
  /** Internal route — present when status is 'built'. */
  route?: string;
  /** External destination — present when status is 'external'. */
  url?: string;
  /** Secondary link, e.g. a 'built' tool that also has an equivalent on Delphi. */
  altUrl?: string;
  altLabel?: string;
  /** Extra search terms not already in name/description. */
  keywords?: string[];
  /** How hard to build as a web tool (1=trivial..5=very hard). Only set on 'backlog' entries. */
  effort?: 1 | 2 | 3 | 4 | 5;
};

export type AnyEntry = AppEntry | ServiceEntry | ToolEntry | ToolHubEntry;
