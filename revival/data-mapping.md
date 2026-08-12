# AniDev v1 — Data Mapping (v2 → v1)

Source: `anidev-v2` local Postgres (`postgres://anidev:anidev@localhost:5432/anidev`,
`docker compose up -d postgres` in the anidev-v2 project). ~2.25M rows already loaded.

Target: the v1 schema in [`schema.md`](./schema.md).

## v2 source tables (available)

`anime`, `anime_media`, `anime_genre`, `anime_theme`, `anime_demographic`,
`anime_producer`, `anime_music`, `anime_staff`, `anime_character`, `anime_relation`,
`anime_title_synonym`, `anime_external_ids`, `genre`, `theme`, `demographic`,
`staff`, `staff_media`, `staff_alternative_name`, `character`, `character_media`,
`character_nickname`, `character_voice_actor`, `producer`, `producer_media`,
`producer_title`, `music`, `music_media`, `music_version`, `music_resolution`,
`music_artist`, `artist`, `episode`.

## Table-by-table mapping

### `anime` ← v2 `anime` (+ derived)
Direct: `mal_id, title, title_english, title_japanese, type, status, episodes,
score, scored_by, rating, year, season, synopsis, background`.
- `popularity` ← v2 `popularity_rank`
- `url` ← `https://myanimelist.net/anime/{mal_id}`
- `airing` ← (`status` ilike 'currently airing')
- `title_synonyms` ← `array_agg(anime_title_synonym.title WHERE anime_id=mal_id)`
- Images ← v2 `anime_media` (media_type='poster').src. Derive variants from the MAL
  CDN pattern: base `.../{n}.webp` → `image_webp`; `.../{n}t.webp` → small;
  `.../{n}l.webp` → large; `.jpg` equivalents for the `_jpg` columns. Best-effort.
- `banner_image` ← v2 `anime_media` (media_type='banner').src if any, else null.
- NULL (gaps): `youtube_id, trailer_url, trailer_embed_url, trailer_image_url,
  approved, source, aired_from, aired_to, duration, members, favorites,
  broadcast_day, broadcast_time, broadcast_timezone`.

### Catalogs & junctions
- `genres` ← v2 `genre`; `anime_genres` ← v2 `anime_genre`.
- `themes` ← v2 `theme`; `anime_themes` ← v2 `anime_theme`.
- `producers` ← v2 `producer` (mal_id, name — v2 producer has no `name`? it has
  established/about/count; **name lives where?**). ⚠️ v2 `producer` lacks a `name`
  column — producer names may only exist via `producer_title`. Resolve during ETL:
  use `producer_title` (type='default'/primary) as the producer name, else skip.
- `anime_producers` ← v2 `anime_producer`.
- `studios`, `licensors` + their junctions: **no source data** → leave empty.
- `anime_relation` ← v2 `anime_relation` (anime_id, related_anime_id, relation_type).

### `anime_episodes` ← v2 `episode`
- `anime_mal_id` ← `anime_id`, `episode_id` ← `number`, `title` ← `title`,
  `description` ← `synopsis`, `date` ← `aired` (parse to date).
- `video_url`, `image_url`: **gap** → null. (Watch pages will lack playback.)

### Music ← v2 `music` (+ `music_version`, `music_resolution`, `music_artist`, `artist`, `anime_music`)
- `music.theme_id` ← v2 `music.id`; `song_title` ← `music.title`; `type` ← `music.type`.
- `music.anime_id` ← v2 `anime_music` (one anime per theme; if multiple, pick first).
- `music.artist_name` ← v2 `music_artist` → `artist.name` (join; first artist).
- `song_versions` ← v2 `music_version` (version_id, theme_id←music_id, version).
- `song_resolutions` ← v2 `music_resolution` (version_id←music_version_id, song_id,
  resolution, audio_url, video_url).

### Characters ← v2 `character` (+ `character_media`, `character_nickname`)
- `character_id` ← `mal_id`, `character_name` ← `name`, `character_name_kanji` ←
  `name_kanji`, `character_about` ← `about`.
- `character_nicknames` ← `array_agg(character_nickname.nickname)`.
- `character_image_url` ← `character_media` (poster/image).src; `_small` derived.
- `character_url` ← MAL url; `slug` ← slugify(name)+'-'+mal_id; `favorites` ← 0.
- `anime_character` ← v2 `anime_character` (anime_id, character_id, role).

### Voice actors ← v2 `staff` (+ `staff_media`, `staff_alternative_name`)
- `voice_actor_id` ← `staff.mal_id`, `name, given_name, family_name, birthday, about`.
- `alternative_names` ← `array_agg(staff_alternative_name.name)`.
- `image_url` ← `staff_media`.src.
- `character_voice_actor` ← v2 `character_voice_actor` (character_id,
  voice_actor_id←staff_id, language).

### Artists ← v2 `artist` (+ `staff` via artist.mal_id, `staff_alternative_name`, `staff_media`)
- `name` ← `artist.name`, `mal_id` ← `artist.mal_id`.
- If `mal_id` matches a `staff`: `about, birthday, given_name, family_name` ← staff;
  `alternative_names` ← staff_alternative_name; `image_url` ← staff_media.
- Others null.

### User tables — start EMPTY
`public_users`, `user_profiles`, `search_history`, `watch_list` are created empty
and populated at runtime by auth/user actions.

## ETL order (respect FKs)
1. Catalogs: `genres`, `themes`, `producers` (+ studios/licensors empty).
2. `anime` (+ derived images/synonyms).
3. Junctions: `anime_genres`, `anime_themes`, `anime_producers`, `anime_relation`.
4. `anime_episodes`.
5. `music` → `song_versions` → `song_resolutions`.
6. `character` → `anime_character`.
7. `voice_actors` → `character_voice_actor`.
8. `artist`.

Filter child rows to existing parents (as in the v2 load) to keep FKs consistent.

## Open questions to resolve during ETL
- **Producer names:** confirm where v2 stores producer display names (likely
  `producer_title`); needed to populate `producers.name`.
- **Banner images:** check whether v2 `anime_media` actually has `media_type='banner'`
  rows; if not, `banner_image` stays null (affects banner carousels).
- **Character/staff image URL** `media_type` values in v2 (`anime_media` used
  'poster'; confirm the equivalent for `character_media`/`staff_media`).
