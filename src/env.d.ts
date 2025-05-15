/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly SUPABASE_SERVICE_ROLE_KEY: string
  readonly PINATA_JWT: string
  readonly GATEWAY_URL: string
  readonly REDIS_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
