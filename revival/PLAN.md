# AniDev v1 — Revival Plan

Goal: bring the **v1 app back up and running locally**, backed by a reconstructed
database seeded from the data we already have (the MAL-derived dataset currently
in the `anidev-v2` local Postgres). The original v1 Supabase project is gone, so
the schema and its ~20 RPC functions are being **rebuilt from the repo** (no SQL
existed in the codebase).

This folder (`revival/`) is the source of truth for the effort. Companion docs:

- [`schema.md`](./schema.md) — target Postgres schema (tables, columns, FKs).
- [`rpc-functions.md`](./rpc-functions.md) — spec for every `supabase.rpc()` function.
- [`runtime-and-env.md`](./runtime-and-env.md) — env vars, auth, external services, run steps.
- [`data-mapping.md`](./data-mapping.md) — how v2 data maps into the v1 schema (+ gaps).

## Decisions (agreed with owner)

- **Location:** this project lives at `C:/Users/sebas/Documents/projects/anidev-v1`
  (separate from `anidev-v2`).
- **Backend:** local **Supabase stack** via the Supabase CLI (`supabase start`) —
  Postgres + PostgREST + GoTrue (Auth) + Studio in Docker. This lets the app's
  `@supabase/supabase-js` `.from()` / `.rpc()` / auth work unmodified.
- **External integrations to wire up (credentials to be provided):**
  - Google OAuth (login) — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - Gemini (AI recommendations) — `GEMINI_API_KEY`
  - Pinata (avatar/banner upload to IPFS) — `PINATA_JWT`, `GATEWAY_URL`
  - Redis — run locally (no external account).
- **Data source:** seed from the `anidev-v2` Postgres (`postgres://anidev:anidev@localhost:5432/anidev`,
  started via `docker compose up -d postgres` in the anidev-v2 project). Its data
  persists in the `postgres_data` Docker volume.

## Known limitations (data gaps)

Our source data fills ~60-65% of the v1 `anime` table. These columns will be
NULL/empty and the features that depend on them will be degraded:

- Trailers (`youtube_id`, `trailer_*`) — absent.
- Image variants — only one poster URL per anime exists; other variants are
  **derived** from the MAL CDN URL pattern (best-effort).
- `members`, `favorites`, `source`, `duration`, `aired_from/to`, `broadcast_*`,
  `approved` — absent.
- **studios / licensors** — our data only has generic "producers"; the
  studios/licensors split is unavailable, so the studio filter will be empty.
- `anime_episodes.video_url` / `image_url` — absent → the **watch/streaming**
  pages won't have media. Episode metadata (title, synopsis, number, air date)
  is present.

Mostly-complete: anime core metadata, genres, themes, title synonyms, characters,
voice actors, artists, music (with versions + resolutions), episodes metadata.

## Phases & checklist

### Phase 0 — Foundation ✅ DONE (2026-08-12)
- [x] Supabase CLI via `npx supabase` (v2.113.0) — no global install, isolated to anidev-v1.
- [x] `supabase init` → `supabase/config.toml` (project_id `anidev-v1`, ports 54321/54322/54323).
- [x] `supabase start` — stack healthy. Local endpoints:
  - API `http://127.0.0.1:54321`, DB `postgresql://postgres:postgres@127.0.0.1:54322/postgres`, Studio `http://127.0.0.1:54323`
  - Uses the standard local demo anon/service_role keys (not secret). `npx supabase status` reprints them.

### Phase 1 — Schema ✅ DONE (2026-08-12)
- [x] Migration `supabase/migrations/20260812090000_schema.sql` (25 tables, PKs, FKs, indexes).
- [x] `handle_new_user` trigger on `auth.users` → `public_users` + `user_profiles`.
- [x] RLS left disabled on content tables; grants to anon/authenticated/service_role.
- [x] Applied via `supabase db reset`. Verified 25 tables + trigger present.

### Phase 2 — Seed ✅ DONE (2026-08-12)
- [x] ETL `revival/scripts/seed.ts` (Bun.SQL, v2 → v1, idempotent, keyset/offset paginated).
- [x] Loaded: anime 29,705 · genres/themes/producers · junctions · anime_episodes 443,674 ·
  music 13,918 + song_versions 16,263 + song_resolutions 19,984 · character 217,275 ·
  anime_character 222,176 · voice_actors 78,791 · character_voice_actor 10,933 · artist 2,184.
- [x] Verified counts + joins (genres, images, banners, slugs, nicknames, music→anime→artist).
- Note: source v2 Postgres (`anidev-v2-postgres-1`) can be stopped now; seed is done.

### Phase 3 — RPC functions ✅ DONE (2026-08-12)
- [x] `supabase/migrations/20260812090001_rpc.sql` — `anime_full` view + shared filter/sort
  helpers + all functions: `get_animes_full`, `get_anime_count`, `get_anime_by_id`,
  format RPCs (`get_anime_summary_card`, `get_top_animes`, `get_animes_collection`,
  `get_anime_detail_card`, `get_anime_schedule`, `get_animes_banner`), `get_related_anime`,
  `get_anime_banner`, `get_random_anime_recommendation`, `get_unique_studios`,
  `get_music`/`get_music_info`/`get_music_count` (nested JSON), `get_anime_characters`,
  `get_characters_list`/`get_characters_count`, `get_character_images`,
  `get_character_details_with_animes`, `get_artist_info`, `get_user_watch_list`.
- [x] `20260812090002_fix_characters_list.sql` — limit before lateral VA join (timeout fix).
- [x] Applied via `supabase migration up` (data preserved). Verified all via REST API.
- Notes: param names match the app's exact keys (PostgREST resolves by name). `get_unique_studios`
  falls back to producer names (studios empty). Voice-actor data is sparse (only ~4,169 of 217k
  characters have VA links — a v2 data gap), and `anime_relation` is thin for some titles.

### Phase 4 — Wire the app ✅ DONE (2026-08-12)
- [x] `.env` created (local Supabase keys + generated `AUTH_SECRET` + `AUTH_TRUST_HOST=true` +
  Google/Gemini/Pinata creds). Gitignored.
- [x] Patched `src/libs/redis.ts` → env-driven host/port (defaults localhost), optional auth.
- [x] Dedicated local Redis container `anidev-v1-redis` on port 6380 (isolated from v2's 6379).
- [x] `pnpm install` with **pnpm 9** (pnpm 11 blocks the git subdep `@emmetio/css-parser`).
- [ ] Google OAuth: register redirect `http://localhost:4321/api/auth/callback/google` in
  Google Cloud + test an actual login (wiring in place; not yet exercised end-to-end).

### Phase 5 — Run & verify ✅ CORE DONE (2026-08-12)
- [x] `pnpm dev` → server on http://localhost:4321.
- [x] Verified rendering with real seeded data: home (hero + sliders), anime detail
  (`/anime/<slug>_<id>`: synopsis, genres, characters, related, music tabs), `/search`, `/music`.
- Known issues:
  - Gemini key returns 404 (format looks wrong — expected `AIza...`); AI section titles fall back
    to defaults. Provide a valid key to enable AI naming.
  - Pinata JWT looks too short; avatar/banner upload may fail (only affects logged-in profile edits).
  - Watch pages have no video (`anime_episodes.video_url` is a data gap).

## How to run (from projects/anidev-v1)
```
# 1. infra
npx supabase start                              # local Supabase (Postgres/API/Auth/Studio)
docker start anidev-v1-redis                    # local Redis :6380
# 2. app
pnpm dev                                         # http://localhost:4321
```
Re-seed (only if DB reset): start anidev-v2 Postgres (`docker start anidev-v2-postgres-1`),
then `bun run revival/scripts/seed.ts`. Apply schema/RPC changes with `npx supabase migration up`
(NOT `db reset`, which wipes the seeded data).

## Status log

- 2026-08-12: Repo cloned to `projects/anidev-v1`. Recon complete (schema, RPCs,
  runtime mapped). Plan documented. Next: Phase 0.
