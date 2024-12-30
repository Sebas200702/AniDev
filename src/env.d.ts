/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly REDIS_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
