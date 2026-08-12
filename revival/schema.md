# AniDev v1 — Target Postgres Schema

Reconstructed from `.from()`/`.select()` usage and the TypeScript interfaces
(no SQL existed in the repo). Confidence is noted per table. The base anime
table is **`anime`** (singular); `animes` appears only in a JSDoc comment.

Legend: **PK** primary key · **FK** foreign key · `?` nullable.

---

## Content tables

### `anime`  (High confidence — direct selects)
Source: `Anime` interface (`src/domains/anime/types/index.ts:74-119`). The trailing
array fields (`genres`, `studios`, `producers`, `licensors`, `themes`) are **NOT
columns** — they are aggregated by the RPCs from junction tables.

| column | type | null | notes |
|---|---|---|---|
| mal_id | integer | no | **PK** |
| url | text | yes | derive `https://myanimelist.net/anime/{mal_id}` |
| image_url | text | yes | |
| image_small_jpg | text | yes | |
| image_large_jpg | text | yes | |
| image_webp | text | yes | selected in recs |
| image_small_webp | text | yes | |
| image_large_webp | text | yes | |
| youtube_id | text | yes | gap (no data) |
| trailer_url | text | yes | gap |
| trailer_embed_url | text | yes | gap |
| trailer_image_url | text | yes | gap |
| approved | boolean | yes | gap |
| title | text | no | |
| title_english | text | yes | |
| title_japanese | text | yes | |
| type | text | yes | |
| source | text | yes | gap |
| episodes | integer | yes | |
| status | text | no | |
| airing | boolean | yes | derive from status |
| aired_from | date | yes | gap |
| aired_to | date | yes | gap |
| duration | text | yes | gap |
| rating | text | yes | |
| score | real | yes | |
| scored_by | integer | yes | |
| popularity | integer | yes | ← v2 `popularity_rank` |
| members | integer | yes | gap |
| favorites | integer | yes | gap |
| synopsis | text | yes | |
| background | text | yes | |
| season | text | yes | |
| year | integer | yes | (interface says non-null, but many rows lack it → keep nullable) |
| broadcast_day | text | yes | gap |
| broadcast_time | text | yes | gap |
| broadcast_timezone | text | yes | gap |
| title_synonyms | text[] | yes | ← agg of v2 `anime_title_synonym` |
| banner_image | text | yes | from v2 `anime_media` type='banner' if present |

### Catalog tables (each: `mal_id integer PK`, `name text NOT NULL`)
- `genres` (confirmed via `genre-repository.ts`)
- `studios`  (gap — no source data)
- `producers`
- `licensors` (gap — no source data)
- `themes`

### Junction tables (composite PK of both FKs)
Column names not visible in client code (Supabase hides them); use `anime_id` +
`{catalog}_id` for consistency with `anime_episodes.anime_mal_id`… but we control
these, so use `anime_id` + `<x>_id`.

| table | columns | FKs |
|---|---|---|
| anime_genres | anime_id, genre_id | anime.mal_id, genres.mal_id |
| anime_studios | anime_id, studio_id | anime.mal_id, studios.mal_id |
| anime_producers | anime_id, producer_id | anime.mal_id, producers.mal_id |
| anime_licensors | anime_id, licensor_id | anime.mal_id, licensors.mal_id |
| anime_themes | anime_id, theme_id | anime.mal_id, themes.mal_id |

### `anime_relation` (for `get_related_anime`)
| column | type | null | notes |
|---|---|---|---|
| anime_id | integer | no | FK anime.mal_id |
| related_anime_id | integer | no | FK anime.mal_id |
| relation_type | text | no | |

PK (anime_id, related_anime_id, relation_type). ← v2 `anime_relation`.

### `anime_episodes`  (High)
Source: `AnimeEpisode` (`src/domains/watch/types/index.ts:1-10`).

| column | type | null | notes |
|---|---|---|---|
| id | uuid | no | **PK** (gen_random_uuid()) |
| anime_mal_id | integer | no | **FK** anime.mal_id |
| episode_id | integer | no | ← v2 episode `number` |
| video_url | text | yes | gap (interface says required; keep nullable) |
| image_url | text | yes | gap |
| title | text | yes | |
| description | text | yes | ← v2 episode `synopsis` |
| date | date | yes | ← v2 episode `aired` |

### `music`  (Medium — mostly RPC-assembled)
Base columns confirmed: `theme_id`, `song_title`. Additional columns inferred
from `AnimeSong` (`src/domains/music/types/index.ts:29-44`).

| column | type | null | notes |
|---|---|---|---|
| theme_id | integer | no | **PK** ← v2 `music.id` |
| song_title | text | yes | ← v2 `music.title` |
| type | text | yes | 'OP'/'ED' ← v2 `music.type` |
| anime_id | integer | yes | FK anime.mal_id (via v2 `anime_music`; may be multi — see mapping) |
| artist_name | text | yes | via v2 `music_artist`→`artist` |

### `song_versions`
| column | type | null | notes |
|---|---|---|---|
| version_id | integer | no | **PK** ← v2 `music_version.version_id` |
| theme_id | integer | no | FK music.theme_id ← v2 `music_version.music_id` |
| version | integer | no | |

### `song_resolutions`
| column | type | null | notes |
|---|---|---|---|
| id | serial | no | **PK** |
| version_id | integer | no | FK song_versions.version_id ← v2 `music_resolution.music_version_id` |
| song_id | integer | yes | |
| resolution | text | no | |
| audio_url | text | yes | |
| video_url | text | yes | |

### `character`  (Medium)
Confirmed: `slug`, `updated_at`, `favorites`. Rest from `CharacterDetails`
(`src/domains/character/types/index.ts:4-15`).

| column | type | null | notes |
|---|---|---|---|
| character_id | integer | no | **PK** ← v2 `character.mal_id` |
| character_name | text | no | ← v2 `character.name` |
| character_name_kanji | text | yes | ← v2 `character.name_kanji` |
| character_nicknames | text[] | yes | ← agg v2 `character_nickname` |
| character_about | text | yes | ← v2 `character.about` |
| character_image_url | text | yes | ← v2 `character_media` |
| character_small_image_url | text | yes | derived |
| character_url | text | yes | derive MAL url |
| slug | text | yes | generate from name + id |
| favorites | integer | yes | gap → 0 |
| updated_at | timestamptz | yes | default now() |

### `anime_character` (link: which characters in which anime + role)
| column | type | null | notes |
|---|---|---|---|
| anime_id | integer | no | FK anime.mal_id |
| character_id | integer | no | FK character.character_id |
| role | text | no | Main/Supporting |

PK (anime_id, character_id, role). ← v2 `anime_character`.

### `voice_actors` (seiyuu)  (Lower)
Source: `Seiyuu` (`src/domains/seiyuu/types/index.d.ts`). ← v2 `staff`.

| column | type | null | notes |
|---|---|---|---|
| voice_actor_id | integer | no | **PK** ← v2 `staff.mal_id` |
| name | text | no | |
| given_name | text | yes | |
| family_name | text | yes | |
| alternative_names | text[] | yes | ← agg v2 `staff_alternative_name` |
| birthday | text | yes | |
| about | text | yes | |
| image_url | text | yes | ← v2 `staff_media` |
| language | text | yes | (language lives on the link below) |

### `character_voice_actor` (link)
| column | type | null | notes |
|---|---|---|---|
| character_id | integer | no | FK character.character_id |
| voice_actor_id | integer | no | FK voice_actors.voice_actor_id |
| language | text | no | |

PK (character_id, voice_actor_id, language). ← v2 `character_voice_actor`
(v2 `staff_id` → `voice_actor_id`).

### `artist`  (Lower)
Source: `ArtistInfo` (`src/domains/artist/types/index.d.ts`). ← v2 `artist` + `staff`.

| column | type | null | notes |
|---|---|---|---|
| mal_id | integer | yes | (v2 artist.mal_id → staff) |
| name | text | no | **lookup key** (normalized) |
| image_url | text | yes | |
| image_small_url | text | yes | |
| alternative_image_url | text | yes | |
| alternative_names | text[] | yes | |
| about | text | yes | |
| birthday | text | yes | |
| given_name | text | yes | |
| family_name | text | yes | |

id: serial PK (add for uniqueness); `name` needs an index for `get_artist_info`.

---

## User tables (start empty; filled at runtime)

### `public_users`
| column | type | null | notes |
|---|---|---|---|
| id | uuid | no | **PK**, **FK** auth.users.id |
| name | text | yes | |
| avatar_url | text | yes | |
| banner_image | text | yes | |
| enfasis_color | text | yes | (sic — misspelled in code) |
| parental_control | boolean | yes | default false |

### `user_profiles`
| column | type | null | notes |
|---|---|---|---|
| id | uuid | no | **PK**, **FK** auth.users.id |
| name | text | yes | |
| last_name | text | yes | |
| birthday | date | yes | |
| gender | text | yes | |
| favorite_animes | text[] | yes | |
| favorite_genres | text[] | yes | |
| favorite_studios | text[] | yes | |
| frequency_of_watch | text | yes | |
| fanatic_level | text | yes | |
| preferred_format | text | yes | |
| watched_animes | text[] | yes | |

### `search_history`
| column | type | null | notes |
|---|---|---|---|
| id | uuid | no | **PK** default gen_random_uuid() |
| user_id | uuid | no | **FK** user_profiles.id, **UNIQUE** (upsert onConflict) |
| search_history | text | yes | JSON string (app serializes) |

### `watch_list`
| column | type | null | notes |
|---|---|---|---|
| id | uuid | no | **PK** default gen_random_uuid() |
| user_id | uuid | no | **FK** public_users.id |
| anime_id | integer | no | **FK** anime.mal_id |
| type | text | no | watch status |

UNIQUE (user_id, anime_id) — implied by upsert/delete pattern.

---

## Notes
- `public_users.id` / `user_profiles.id` reference `auth.users(id)` (Supabase Auth).
  A trigger `handle_new_user` on `auth.users` must insert matching rows (the
  email/password signup path relies on it; OAuth path inserts `public_users`
  manually in `auth.config.js`).
- RLS: the app uses the **anon** client for most reads/writes. For local dev,
  disable RLS on content tables (or add permissive policies).
- Junction/FK column names are our choice (not enforced by client code). Keep
  them consistent with this doc so the RPCs match.
