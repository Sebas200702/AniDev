# AniDev v1 — RPC Function Specs

Postgres functions called via `supabase.rpc('name', args)`. None exist in the repo;
all must be authored. Argument shapes come from `src/utils/get-filters-of-search-params.ts`
(`getFilters`) and the call sites; return shapes from the TS interfaces.

## Cross-cutting: how filters arrive

`getFilters` builds the args object:
- `parental_control`, `banners_filter` → boolean (`'true'` ⇒ true, absent ⇒ false)
- `limit_count`, `page_number`, `anime_id` → integer | null
- `search_query` → text | null
- `order_by` → split into `sort_column` (default `'score'`, or `'theme_id'` for music)
  and `sort_direction` (default `'desc'`) — **only when includeSortParams=true**
- all other filters (`genre_filter`, `type_filter`, `studio_filter`, `score_filter`,
  `status_filter`, `year_filter`, `rating_filter`, `season_filter`, `aired_day_filter`,
  `role_filter`, `language_filter`, `type_music`, `artist_filter`, `anime_season`,
  `anime_year`, `anime_status`) → **text[] | null**, values already lowercased &
  normalized, underscore-separated.

Pagination lives *inside* the filter object as `limit_count` / `page_number`
(offset = `(page_number-1)*limit_count`). Array filters should be matched
case-insensitively against normalized values (overlap for aggregated arrays).

`OrderFunctions` enum (`get_animes_order_by_*`) is **dead code** — ordering is done
via `sort_column`/`sort_direction`. Don't build those unless restoring the enum.

---

## Anime

### `get_animes_full(limit_count, page_number, genre_filter, type_filter, studio_filter, score_filter, status_filter, year_filter, rating_filter, season_filter, aired_day_filter, search_query, parental_control, banners_filter, sort_column, sort_direction)`
- Returns: SET OF full `Anime` rows (all columns + `genres/studios/producers/licensors/themes` as text[] aggregated from junctions).
- Logic: filter `anime` by each non-null filter; `search_query` → title ilike;
  `parental_control=true` excludes adult ratings; `banners_filter=true` restricts to
  `banner_image IS NOT NULL`; order by `sort_column sort_direction`; paginate.
- Call: `anime/repositories/index.ts:174`.

### `get_anime_count(genre_filter, type_filter, studio_filter, score_filter, status_filter, search_query, parental_control, year_filter, rating_filter, banners_filter, season_filter, aired_day_filter)`
- Returns: scalar integer. Same filter set as `get_animes_full` minus pagination/sort.
- Call: `anime/utils/fetch-by-format.ts:88`.

### `get_anime_by_id(p_mal_id integer, p_parental_control boolean)`
- Returns: single full `Anime` row. If `p_parental_control=true` and the anime is
  adult-rated, return **no row** (caller retries with false to distinguish blocked
  vs not-found). Call: `anime/repositories/index.ts:37,49`.

### `get_anime_banner(p_anime_id integer, p_limit_count integer default 8)`
- Returns: SET of `AnimeBannerInfo` = `{ mal_id, title, synopsis, banner_image }`,
  `banner_image IS NOT NULL`, related to `p_anime_id`. Call: `:101`.

### `get_related_anime(p_mal_id)` (arg passed as **text**)
- Returns: SET of `AnimeDetail` = `{ mal_id, title, image_webp, image_small_webp,
  image_large_webp, banner_image, year, type, episodes }` from `anime_relation`
  joined back to `anime`. Calls: `anime/repositories/index.ts:155`, `utils/get-anime-relations.ts:7`.

### Format RPCs (share `get_animes_full` filters/pagination/parental logic; narrower returns)
Used by `fetch-by-format.ts:32-62` via a dynamic `config.function`:
- `get_anime_summary_card` → `AnimeCardInfo` = `{ mal_id, title, image_webp, year, status, genres, image_small_webp, image_large_webp }`
- `get_animes_banner` → `AnimeBannerInfo`
- `get_top_animes` → `AnimeTopInfo`
- `get_animes_collection` → `AnimeCollectionInfo`
- `get_anime_detail_card` → `AnimeDetail`
- `get_anime_schedule` → `AnimeCardInfo`

### `get_random_anime_recommendation(p_user_id uuid|null, p_parental_control boolean|null)`
- Returns: SET; caller takes `data[0]` as `{ mal_id, title }`. Random pick,
  parental-gated, optionally user-personalized. Call: `anime/utils/get-random-anime.ts:14`.

### `get_unique_studios()`
- Returns: SET of distinct studio name strings (single text column), alphabetical.
  Call: `anime/repositories/index.ts:85`. NOTE: no studio data in our seed → empty.

---

## Characters

### `get_anime_characters(input_anime_id text, language_filter text)`
- Returns: SET of `Character` = `{ mal_id, character_id, character_name,
  character_name_kanji, character_nicknames[], character_about, character_image_url,
  character_small_image_url, character_url, role, voice_actor_id, voice_actor_name,
  voice_actor_alternative_names[], voice_actor_family_name, voice_actor_given_name,
  voice_actor_birthday, voice_actor_about, voice_actor_image_url, voice_actor_language }`.
- Logic: `anime_character` → `character` → `character_voice_actor` → `voice_actors`,
  filtered by anime + VA language. Calls: `character/repositories/index.ts:127`, `utils/get-anime-characters.ts:4`.

### `get_characters_list(limit_count, page_number, role_filter, search_query, language_filter)`
- Returns: SET of `Character` (same shape). Filters by role/name/VA-language,
  paginated. No sort args (includeSortParams=false). Call: `:32`.

### `get_characters_count(role_filter, search_query, language_filter)`
- Returns: scalar integer. Call: `:48`.

### `get_character_images(p_anime_id integer, p_limit_count integer default 10)`
- Returns: SET of `CharacterImages` = `{ character_id, character_name,
  character_image_url, character_small_image_url, anime_title }`. Call: `:88`.

### `get_character_details_with_animes(input_character_id integer)`
- Returns: **single** `CharacterDetails` = base character fields + nested
  `animes: AnimeSummary[]` (`{ mal_id, title, image_webp, year, status, genres,
  image_small_webp, image_large_webp, banner_image, role }`) + `voice_actors: Seiyuu[]`.
  JSON-aggregated. Call: `:12` (`.single()`).

---

## Music

### `get_music(limit_count, page_number, type_music, anime_season, anime_year, anime_status, artist_filter, anime_id, search_query, sort_column='theme_id', sort_direction='desc')`
- Returns: SET of `AnimeSong` = `{ theme_id, song_title, artist_name, type,
  anime: { id, title, image, score, banner_image }|null,
  versions: [ { version, version_id, resolutions: [ { song_id, resolution, audio_url, video_url } ] } ] }`.
  Deeply JSON-aggregated. When `anime_id` set, restrict to that anime.
  Calls: `music/repositories/index.ts:26,71`.

### `get_music_info(p_theme_id integer)`
- Returns: **single** `AnimeSong` (same shape) for one theme. Call: `:7`.

### `get_music_count(type_music, search_query, anime_season, anime_year, anime_status, anime_id, artist_filter)`
- Returns: scalar integer. Call: `:39`.

---

## Artist

### `get_artist_info(artist_name text)`
- Returns: SET; caller takes `data[0]` as `ArtistInfo` = `{ name, image_url,
  image_small_url, mal_id, alternative_names[], about, birthday, given_name,
  family_name, alternative_image_url }`. Match by normalized name (case-insensitive).
  Call: `artist/repositories/index.ts:9`.

---

## User

### `get_user_watch_list(p_user_id uuid)`
- Returns: SET of `WatchList` = `AnimeCardInfo` + `{ id, user_id, anime_id, type }`.
  Join `watch_list` → `anime`. Call: `user/repositories/watch-list.ts:46`.

---

## Build priority
1. `get_animes_full`, `get_anime_count`, `get_anime_by_id` (home + detail + search).
2. Format RPCs + `get_random_anime_recommendation` (home sliders).
3. `get_related_anime`, `get_anime_characters`, `get_character_images` (detail page).
4. `get_music`, `get_music_info`, `get_music_count` (music pages).
5. `get_characters_list/count`, `get_character_details_with_animes` (characters).
6. `get_artist_info`, `get_user_watch_list`, `get_unique_studios`.

Reusable helper: a SQL view/CTE `anime_full` that pre-aggregates the genre/studio/
producer/licensor/theme arrays per `mal_id` — most anime RPCs build on it.
