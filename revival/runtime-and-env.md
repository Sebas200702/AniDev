# AniDev v1 — Runtime, Env & External Services

Astro 5 SSR + React 19 + Supabase. Node standalone adapter. Package manager: **pnpm**
(`pnpm-lock.yaml`, lockfile v9). Node **20 or 22 LTS** (not pinned in repo).

## Environment variables (all server-side; no `PUBLIC_` vars)

Create `.env` at the repo root (`.env`/`.env.production` are gitignored; no `.env.example` exists).

| Variable | Used in | Required for |
|---|---|---|
| `SUPABASE_URL` | `src/libs/supabase.ts`, `supabase-server.ts` | everything |
| `SUPABASE_ANON_KEY` | `src/libs/supabase.ts`, `supabase-server.ts` | everything |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/libs/supabase.ts` (`supabaseAdmin`) | auth admin ops (login/signup) |
| `AUTH_SECRET` | `auth.config.js` | auth-astro session encryption |
| `GOOGLE_CLIENT_ID` | `auth.config.js` | Google login |
| `GOOGLE_CLIENT_SECRET` | `auth.config.js` | Google login |
| `GEMINI_API_KEY` | `src/libs/gemini.ts` | AI recommendations |
| `PINATA_JWT` | `src/libs/pinata.ts` | avatar/banner upload |
| `GATEWAY_URL` | `src/libs/pinata.ts` | Pinata gateway domain |
| `REDIS_PASSWORD` | `src/libs/redis.ts` | cache (host/port hardcoded — see below) |
| `SENTRY_DSN` | `sentry.*.config.js` | optional (leave unset) |
| `SENTRY_AUTH_TOKEN` | `astro.config.mjs` | optional (build-time source maps) |
| `LOG_LEVEL` | `src/libs/pino.ts` | optional |

Values from local Supabase come from `supabase start` output (API URL, anon key,
service_role key).

## Supabase clients

- `supabase` (anon) — `src/libs/supabase.ts:34-43`, `flowType: 'pkce'`. Most queries/RPC.
- `supabaseAdmin` (service role) — `:45-48`. Admin auth ops in `auth.config.js`.
- SSR client — `src/libs/supabase-server.ts` via `@supabase/ssr`, wired to Astro cookies.

## Auth

Two systems coexist:
- **Google OAuth** via auth-astro/Auth.js (`auth.config.js`, integrated in `astro.config.mjs`).
  `jwt` callback finds/creates the auth user (`supabaseAdmin`) and **inserts into
  `public_users` `{id, name, avatar_url}`** on first login; generates a magiclink to
  mint a Supabase access token. Redirect URL must be registered in Google Cloud for
  `http://localhost:4321/...`.
- **Email/password** via `/api/auth/signin|signup` → sets `sb-access-token` /
  `sb-refresh-token` cookies (httpOnly, **`secure: true`**, sameSite lax). ⚠️ `secure`
  cookies may not set over plain `http://localhost` in some browsers — may need to
  relax `secure` for local dev or use https.

No global `src/middleware.ts`; protection is per-endpoint wrappers in `src/middlewares/`
(`checkSession`, `rateLimit`). Session read via `src/utils/get_session_user_info.ts`.

**Required DB trigger:** `handle_new_user` on `auth.users` → insert into `public_users`
(and optionally `user_profiles`). The email/password signup path does NOT insert into
`public_users` itself, so without the trigger those users have no profile row.

## External services & local adjustments

- **Redis** (`src/libs/redis.ts`): host/port are **hardcoded** to a Redis Cloud
  instance; only `REDIS_PASSWORD` is env-driven. For local dev, **edit `redis.ts`**
  to point at `localhost:6379` (or a Docker Redis) and drop the password, or tolerate
  cache errors (calls are wrapped, failures logged).
- **Pinata IPFS** (`src/libs/pinata.ts`, `image-repository.ts`): user avatars/banners
  (NOT Supabase Storage). Needs `PINATA_JWT` + `GATEWAY_URL`. Note the CSP in
  `src/layouts/base.astro` hardcodes a pinata gateway host + allowed image hosts —
  update it for your gateway / local hosts.
- **Gemini** (`src/libs/gemini.ts`): `gemini-2.0-flash` for recommendations.
- **Sentry**: optional; safe to leave DSN unset.
- **Storage/Realtime/Edge functions**: not used. No `supabase.storage`, no channels.

## Supabase local stack (foundation)

Install CLI (native Windows options): Scoop `scoop install supabase` (bucket
`supabase/tap`), or `npx supabase`, or the release binary. Then:

```bash
supabase init      # creates supabase/ (config.toml, migrations/, seed.sql)
supabase start     # boots Postgres + PostgREST + GoTrue + Studio (Docker)
supabase status    # prints API URL, anon key, service_role key -> put in .env
```

Migrations live in `supabase/migrations/*.sql`; `supabase db reset` reapplies them
plus `supabase/seed.sql`. Studio UI for inspecting data + testing RPCs.

## Run

```bash
pnpm install
pnpm dev        # astro dev on :4321
```

Build/serve: `pnpm build` (`astro check && astro build`) then `pnpm start`
(`node ./dist/server/entry.mjs`).
