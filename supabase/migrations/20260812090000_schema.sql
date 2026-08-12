-- AniDev v1 — reconstructed schema
-- See revival/schema.md for the source of every column/inference.
-- RLS is intentionally left DISABLED on content tables: the app reads/writes
-- through the anon client for local dev.

create extension if not exists pgcrypto;

-- ===================== Catalogs =====================
create table if not exists genres (
  mal_id integer primary key,
  name   text not null
);
create table if not exists studios (
  mal_id integer primary key,
  name   text not null
);
create table if not exists producers (
  mal_id integer primary key,
  name   text not null
);
create table if not exists licensors (
  mal_id integer primary key,
  name   text not null
);
create table if not exists themes (
  mal_id integer primary key,
  name   text not null
);

-- ===================== Anime =====================
create table if not exists anime (
  mal_id              integer primary key,
  url                 text,
  image_url           text,
  image_small_jpg     text,
  image_large_jpg     text,
  image_webp          text,
  image_small_webp    text,
  image_large_webp    text,
  youtube_id          text,
  trailer_url         text,
  trailer_embed_url   text,
  trailer_image_url   text,
  approved            boolean,
  title               text not null,
  title_english       text,
  title_japanese      text,
  type                text,
  source              text,
  episodes            integer,
  status              text,
  airing              boolean,
  aired_from          date,
  aired_to            date,
  duration            text,
  rating              text,
  score               real,
  scored_by           integer,
  popularity          integer,
  members             integer,
  favorites           integer,
  synopsis            text,
  background          text,
  season              text,
  year                integer,
  broadcast_day       text,
  broadcast_time      text,
  broadcast_timezone  text,
  title_synonyms      text[],
  banner_image        text
);
create index if not exists anime_score_idx      on anime (score desc);
create index if not exists anime_title_idx       on anime (title);
create index if not exists anime_year_idx        on anime (year);
create index if not exists anime_popularity_idx  on anime (popularity);
create index if not exists anime_banner_idx      on anime (mal_id) where banner_image is not null;

-- ===================== Anime junctions =====================
create table if not exists anime_genres (
  anime_id integer not null references anime(mal_id) on delete cascade,
  genre_id integer not null references genres(mal_id) on delete cascade,
  primary key (anime_id, genre_id)
);
create table if not exists anime_studios (
  anime_id  integer not null references anime(mal_id) on delete cascade,
  studio_id integer not null references studios(mal_id) on delete cascade,
  primary key (anime_id, studio_id)
);
create table if not exists anime_producers (
  anime_id    integer not null references anime(mal_id) on delete cascade,
  producer_id integer not null references producers(mal_id) on delete cascade,
  primary key (anime_id, producer_id)
);
create table if not exists anime_licensors (
  anime_id    integer not null references anime(mal_id) on delete cascade,
  licensor_id integer not null references licensors(mal_id) on delete cascade,
  primary key (anime_id, licensor_id)
);
create table if not exists anime_themes (
  anime_id integer not null references anime(mal_id) on delete cascade,
  theme_id integer not null references themes(mal_id) on delete cascade,
  primary key (anime_id, theme_id)
);
create index if not exists anime_genres_genre_idx    on anime_genres (genre_id);
create index if not exists anime_studios_studio_idx  on anime_studios (studio_id);
create index if not exists anime_producers_prod_idx  on anime_producers (producer_id);
create index if not exists anime_themes_theme_idx    on anime_themes (theme_id);

-- ===================== Anime relations =====================
create table if not exists anime_relation (
  anime_id         integer not null references anime(mal_id) on delete cascade,
  related_anime_id integer not null references anime(mal_id) on delete cascade,
  relation_type    text    not null,
  primary key (anime_id, related_anime_id, relation_type)
);

-- ===================== Episodes =====================
create table if not exists anime_episodes (
  id           uuid primary key default gen_random_uuid(),
  anime_mal_id integer not null references anime(mal_id) on delete cascade,
  episode_id   integer not null,
  video_url    text,
  image_url    text,
  title        text,
  description  text,
  date         date,
  unique (anime_mal_id, episode_id)
);
create index if not exists anime_episodes_anime_idx on anime_episodes (anime_mal_id);

-- ===================== Music =====================
create table if not exists music (
  theme_id    integer primary key,
  song_title  text,
  type        text,
  anime_id    integer references anime(mal_id) on delete set null,
  artist_name text
);
create index if not exists music_anime_idx on music (anime_id);

create table if not exists song_versions (
  version_id integer primary key,
  theme_id   integer not null references music(theme_id) on delete cascade,
  version    integer not null
);
create index if not exists song_versions_theme_idx on song_versions (theme_id);

create table if not exists song_resolutions (
  id         serial primary key,
  version_id integer not null references song_versions(version_id) on delete cascade,
  song_id    integer,
  resolution text not null,
  audio_url  text,
  video_url  text
);
create index if not exists song_resolutions_version_idx on song_resolutions (version_id);

-- ===================== Characters =====================
create table if not exists character (
  character_id              integer primary key,
  character_name            text not null,
  character_name_kanji      text,
  character_nicknames       text[],
  character_about           text,
  character_image_url       text,
  character_small_image_url text,
  character_url             text,
  slug                      text,
  favorites                 integer default 0,
  updated_at                timestamptz default now()
);
create index if not exists character_favorites_idx on character (favorites desc);
create index if not exists character_name_idx on character (character_name);

create table if not exists anime_character (
  anime_id     integer not null references anime(mal_id) on delete cascade,
  character_id integer not null references character(character_id) on delete cascade,
  role         text    not null,
  primary key (anime_id, character_id, role)
);
create index if not exists anime_character_char_idx on anime_character (character_id);

-- ===================== Voice actors (seiyuu) =====================
create table if not exists voice_actors (
  voice_actor_id    integer primary key,
  name              text not null,
  given_name        text,
  family_name       text,
  alternative_names text[],
  birthday          text,
  about             text,
  image_url         text
);

create table if not exists character_voice_actor (
  character_id   integer not null references character(character_id) on delete cascade,
  voice_actor_id integer not null references voice_actors(voice_actor_id) on delete cascade,
  language       text    not null,
  primary key (character_id, voice_actor_id, language)
);
create index if not exists cva_va_idx on character_voice_actor (voice_actor_id);

-- ===================== Artists =====================
create table if not exists artist (
  id                    serial primary key,
  mal_id                integer,
  name                  text not null,
  image_url             text,
  image_small_url       text,
  alternative_image_url text,
  alternative_names     text[],
  about                 text,
  birthday              text,
  given_name            text,
  family_name           text
);
create index if not exists artist_name_idx on artist (lower(name));

-- ===================== User tables (start empty) =====================
create table if not exists public_users (
  id               uuid primary key references auth.users(id) on delete cascade,
  name             text,
  avatar_url       text,
  banner_image     text,
  enfasis_color    text,
  parental_control boolean default false
);

create table if not exists user_profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  name               text,
  last_name          text,
  birthday           date,
  gender             text,
  favorite_animes    text[],
  favorite_genres    text[],
  favorite_studios   text[],
  frequency_of_watch text,
  fanatic_level      text,
  preferred_format   text,
  watched_animes     text[]
);

create table if not exists search_history (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null unique references user_profiles(id) on delete cascade,
  search_history text
);

create table if not exists watch_list (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid    not null references public_users(id) on delete cascade,
  anime_id integer not null references anime(mal_id) on delete cascade,
  type     text    not null,
  unique (user_id, anime_id)
);
create index if not exists watch_list_user_idx on watch_list (user_id);

-- ===================== Auth trigger =====================
-- Populate public_users + user_profiles when a new auth user is created
-- (email/password signup path relies on this; OAuth path also inserts public_users).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.public_users (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===================== Grants (anon client access; RLS disabled) =====================
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
