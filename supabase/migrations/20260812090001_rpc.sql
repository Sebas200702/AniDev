-- AniDev v1 — reconstructed RPC functions. See revival/rpc-functions.md.
-- Param names MUST match the keys the app sends (PostgREST resolves by arg name).
-- Applied with `supabase migration up` (NOT db reset — that would wipe seeded data).

-- ============ anime_full view (arrays aggregated) ============
create or replace view anime_full as
select a.*,
  coalesce((select array_agg(g.name order by g.name) from anime_genres ag join genres g on g.mal_id=ag.genre_id where ag.anime_id=a.mal_id), '{}') as genres,
  coalesce((select array_agg(s.name) from anime_studios x join studios s on s.mal_id=x.studio_id where x.anime_id=a.mal_id), '{}') as studios,
  coalesce((select array_agg(p.name) from anime_producers x join producers p on p.mal_id=x.producer_id where x.anime_id=a.mal_id), '{}') as producers,
  coalesce((select array_agg(l.name) from anime_licensors x join licensors l on l.mal_id=x.licensor_id where x.anime_id=a.mal_id), '{}') as licensors,
  coalesce((select array_agg(t.name) from anime_themes x join themes t on t.mal_id=x.theme_id where x.anime_id=a.mal_id), '{}') as themes
from anime a;

-- ============ shared filter helper (mal_ids matching filters) ============
create or replace function _anime_filter_ids(
  genre_filter text[] default null, type_filter text[] default null, studio_filter text[] default null,
  score_filter text[] default null, status_filter text[] default null, search_query text default null,
  parental_control boolean default false, year_filter text[] default null, rating_filter text[] default null,
  banners_filter boolean default false, season_filter text[] default null, aired_day_filter text[] default null
) returns setof integer language sql stable as $func$
  select a.mal_id from anime a
  where (genre_filter is null or exists(select 1 from anime_genres ag join genres g on g.mal_id=ag.genre_id where ag.anime_id=a.mal_id and lower(g.name)=any(select lower(x) from unnest(genre_filter) x)))
    and (type_filter is null or lower(a.type)=any(select lower(x) from unnest(type_filter) x))
    and (studio_filter is null or exists(select 1 from anime_studios s2 join studios s on s.mal_id=s2.studio_id where s2.anime_id=a.mal_id and lower(s.name)=any(select lower(x) from unnest(studio_filter) x)))
    and (score_filter is null or a.score >= (select min(nullif(x,'')::real) from unnest(score_filter) x))
    and (status_filter is null or lower(a.status)=any(select lower(x) from unnest(status_filter) x))
    and (search_query is null or a.title ilike '%'||search_query||'%' or a.title_english ilike '%'||search_query||'%' or a.title_japanese ilike '%'||search_query||'%')
    and (year_filter is null or a.year::text = any(year_filter))
    and (rating_filter is null or lower(a.rating)=any(select lower(x) from unnest(rating_filter) x))
    and (season_filter is null or lower(a.season)=any(select lower(x) from unnest(season_filter) x))
    and (aired_day_filter is null or lower(a.broadcast_day)=any(select lower(x) from unnest(aired_day_filter) x))
    and (not parental_control or coalesce(lower(a.rating),'') not like 'rx%')
    and (not banners_filter or a.banner_image is not null)
$func$;

-- ============ shared anime list impl (dynamic sort/pagination) ============
create or replace function _animes_impl(
  limit_count int, page_number int, genre_filter text[], type_filter text[], studio_filter text[],
  score_filter text[], status_filter text[], search_query text, parental_control boolean,
  year_filter text[], rating_filter text[], banners_filter boolean, season_filter text[],
  aired_day_filter text[], sort_column text, sort_direction text, force_banner boolean
) returns setof anime_full language plpgsql stable as $func$
declare
  v_col text; v_dir text;
  v_lim int := coalesce(nullif(limit_count,0),30);
  v_off int := (greatest(coalesce(page_number,1),1)-1)*coalesce(nullif(limit_count,0),30);
begin
  v_col := case lower(coalesce(sort_column,'score'))
    when 'title' then 'title' when 'year' then 'year' when 'popularity' then 'popularity'
    when 'members' then 'members' when 'favorites' then 'favorites' when 'scored_by' then 'scored_by'
    when 'mal_id' then 'mal_id' else 'score' end;
  v_dir := case when lower(coalesce(sort_direction,'desc'))='asc' then 'asc' else 'desc' end;
  return query execute format($q$
    select af.* from anime_full af
    where af.mal_id in (select _anime_filter_ids($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12))
    order by af.%I %s nulls last, af.mal_id asc
    limit %s offset %s
  $q$, v_col, v_dir, v_lim, v_off)
  using genre_filter, type_filter, studio_filter, score_filter, status_filter, search_query,
        parental_control, year_filter, rating_filter, (banners_filter or force_banner),
        season_filter, aired_day_filter;
end;
$func$;

-- ============ public anime list + format functions (identical filter signature) ============
create or replace function get_animes_full(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,sort_column,sort_direction,false)
$func$;

create or replace function get_anime_summary_card(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,sort_column,sort_direction,false)
$func$;

create or replace function get_top_animes(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,'score','desc',false)
$func$;

create or replace function get_animes_collection(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,sort_column,sort_direction,false)
$func$;

create or replace function get_anime_detail_card(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,sort_column,sort_direction,false)
$func$;

create or replace function get_anime_schedule(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,sort_column,sort_direction,false)
$func$;

create or replace function get_animes_banner(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns setof anime_full language sql stable as $func$
  select * from _animes_impl(limit_count,page_number,genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter,sort_column,sort_direction,true)
$func$;

create or replace function get_anime_count(
  limit_count int default 30, page_number int default 1, genre_filter text[] default null,
  type_filter text[] default null, studio_filter text[] default null, score_filter text[] default null,
  status_filter text[] default null, search_query text default null, parental_control boolean default false,
  year_filter text[] default null, rating_filter text[] default null, banners_filter boolean default false,
  season_filter text[] default null, aired_day_filter text[] default null,
  sort_column text default 'score', sort_direction text default 'desc'
) returns integer language sql stable as $func$
  select count(*)::int from _anime_filter_ids(genre_filter,type_filter,studio_filter,score_filter,status_filter,search_query,parental_control,year_filter,rating_filter,banners_filter,season_filter,aired_day_filter)
$func$;

-- ============ anime single / related / banner / random / studios ============
create or replace function get_anime_by_id(p_mal_id integer, p_parental_control boolean default false)
returns setof anime_full language sql stable as $func$
  select * from anime_full where mal_id = p_mal_id
    and (not p_parental_control or coalesce(lower(rating),'') not like 'rx%')
$func$;

create or replace function get_related_anime(p_mal_id integer)
returns setof anime_full language sql stable as $func$
  select af.* from anime_full af
  join anime_relation r on r.related_anime_id = af.mal_id
  where r.anime_id = p_mal_id
$func$;

create or replace function get_anime_banner(p_anime_id integer, p_limit_count integer default 8)
returns setof anime_full language sql stable as $func$
  select * from anime_full
  where banner_image is not null and mal_id <> p_anime_id
  order by score desc nulls last
  limit p_limit_count
$func$;

create or replace function get_random_anime_recommendation(p_user_id uuid default null, p_parental_control boolean default false)
returns table(mal_id integer, title text) language sql stable as $func$
  select a.mal_id, a.title from anime a
  where (not p_parental_control or coalesce(lower(a.rating),'') not like 'rx%')
  order by random() limit 1
$func$;

create or replace function get_unique_studios()
returns setof text language sql stable as $func$
  select distinct name from producers order by name
$func$;

-- ============ music ============
create or replace function _music_json(p_theme_id integer)
returns jsonb language sql stable as $func$
  select jsonb_build_object(
    'theme_id', m.theme_id, 'song_title', m.song_title, 'artist_name', m.artist_name, 'type', m.type,
    'anime', case when a.mal_id is not null then jsonb_build_object('id',a.mal_id,'title',a.title,'image',a.image_webp,'score',a.score,'banner_image',a.banner_image) else null end,
    'versions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'version', v.version, 'version_id', v.version_id,
        'resolutions', coalesce((select jsonb_agg(jsonb_build_object('song_id',r.song_id,'resolution',r.resolution,'audio_url',r.audio_url,'video_url',r.video_url)) from song_resolutions r where r.version_id=v.version_id), '[]'::jsonb)
      ) order by v.version) from song_versions v where v.theme_id=m.theme_id), '[]'::jsonb)
  )
  from music m left join anime a on a.mal_id=m.anime_id
  where m.theme_id = p_theme_id
$func$;

create or replace function get_music(
  limit_count int default 30, page_number int default 1, type_music text[] default null,
  search_query text default null, anime_season text[] default null, anime_year text[] default null,
  anime_status text[] default null, anime_id int default null, artist_filter text[] default null,
  sort_column text default 'theme_id', sort_direction text default 'desc'
) returns setof jsonb language plpgsql stable as $func$
declare
  v_col text; v_dir text;
  v_lim int := coalesce(nullif(limit_count,0),30);
  v_off int := (greatest(coalesce(page_number,1),1)-1)*coalesce(nullif(limit_count,0),30);
begin
  v_col := case lower(coalesce(sort_column,'theme_id')) when 'song_title' then 'song_title' when 'type' then 'type' else 'theme_id' end;
  v_dir := case when lower(coalesce(sort_direction,'desc'))='asc' then 'asc' else 'desc' end;
  return query execute format($q$
    select _music_json(m.theme_id)
    from music m left join anime a on a.mal_id=m.anime_id
    where ($1 is null or lower(m.type)=any(select lower(x) from unnest($1) x))
      and ($2 is null or m.song_title ilike '%%'||$2||'%%')
      and ($3 is null or lower(a.season)=any(select lower(x) from unnest($3) x))
      and ($4 is null or a.year::text=any($4))
      and ($5 is null or lower(a.status)=any(select lower(x) from unnest($5) x))
      and ($6 is null or m.anime_id=$6)
      and ($7 is null or lower(m.artist_name)=any(select lower(x) from unnest($7) x))
    order by m.%I %s nulls last
    limit %s offset %s
  $q$, v_col, v_dir, v_lim, v_off)
  using type_music, search_query, anime_season, anime_year, anime_status, anime_id, artist_filter;
end;
$func$;

create or replace function get_music_info(p_theme_id integer)
returns jsonb language sql stable as $func$
  select _music_json(p_theme_id)
$func$;

create or replace function get_music_count(
  limit_count int default 30, page_number int default 1, type_music text[] default null,
  search_query text default null, anime_season text[] default null, anime_year text[] default null,
  anime_status text[] default null, anime_id int default null, artist_filter text[] default null,
  sort_column text default 'theme_id', sort_direction text default 'desc'
) returns integer language sql stable as $func$
  select count(*)::int
  from music m left join anime a on a.mal_id=m.anime_id
  where (type_music is null or lower(m.type)=any(select lower(x) from unnest(type_music) x))
    and (search_query is null or m.song_title ilike '%'||search_query||'%')
    and (anime_season is null or lower(a.season)=any(select lower(x) from unnest(anime_season) x))
    and (anime_year is null or a.year::text=any(anime_year))
    and (anime_status is null or lower(a.status)=any(select lower(x) from unnest(anime_status) x))
    and (anime_id is null or m.anime_id=anime_id)
    and (artist_filter is null or lower(m.artist_name)=any(select lower(x) from unnest(artist_filter) x))
$func$;

-- ============ characters ============
create or replace function get_anime_characters(input_anime_id integer, language_filter text default null)
returns setof jsonb language sql stable as $func$
  select jsonb_build_object(
    'mal_id', c.character_id, 'character_id', c.character_id, 'character_name', c.character_name,
    'character_name_kanji', c.character_name_kanji, 'character_nicknames', c.character_nicknames,
    'character_about', c.character_about, 'character_image_url', c.character_image_url,
    'character_small_image_url', c.character_small_image_url, 'character_url', c.character_url,
    'role', ac.role,
    'voice_actor_id', va.voice_actor_id, 'voice_actor_name', va.name,
    'voice_actor_alternative_names', va.alternative_names, 'voice_actor_family_name', va.family_name,
    'voice_actor_given_name', va.given_name, 'voice_actor_birthday', va.birthday,
    'voice_actor_about', va.about, 'voice_actor_image_url', va.image_url,
    'voice_actor_language', cva.language
  )
  from anime_character ac
  join character c on c.character_id = ac.character_id
  left join character_voice_actor cva on cva.character_id = c.character_id
    and (language_filter is null or lower(cva.language) = lower(language_filter))
  left join voice_actors va on va.voice_actor_id = cva.voice_actor_id
  where ac.anime_id = input_anime_id
  order by case ac.role when 'Main' then 0 else 1 end, c.character_id
$func$;

create or replace function get_characters_list(
  limit_count int default 30, page_number int default 1, role_filter text[] default null,
  search_query text default null, language_filter text[] default null
) returns setof jsonb language sql stable as $func$
  select jsonb_build_object(
    'mal_id', c.character_id, 'character_id', c.character_id, 'character_name', c.character_name,
    'character_name_kanji', c.character_name_kanji, 'character_nicknames', c.character_nicknames,
    'character_about', c.character_about, 'character_image_url', c.character_image_url,
    'character_small_image_url', c.character_small_image_url, 'character_url', c.character_url,
    'role', (select ac.role from anime_character ac where ac.character_id=c.character_id limit 1),
    'voice_actor_id', va.voice_actor_id, 'voice_actor_name', va.name,
    'voice_actor_alternative_names', va.alternative_names, 'voice_actor_family_name', va.family_name,
    'voice_actor_given_name', va.given_name, 'voice_actor_birthday', va.birthday,
    'voice_actor_about', va.about, 'voice_actor_image_url', va.image_url,
    'voice_actor_language', va.language
  )
  from character c
  left join lateral (
    select v.*, cva.language from character_voice_actor cva
    join voice_actors v on v.voice_actor_id = cva.voice_actor_id
    where cva.character_id = c.character_id
      and (language_filter is null or lower(cva.language)=any(select lower(x) from unnest(language_filter) x))
    limit 1
  ) va on true
  where (search_query is null or c.character_name ilike '%'||search_query||'%')
    and (role_filter is null or exists(select 1 from anime_character ac where ac.character_id=c.character_id and lower(ac.role)=any(select lower(x) from unnest(role_filter) x)))
    and (language_filter is null or exists(select 1 from character_voice_actor cva where cva.character_id=c.character_id and lower(cva.language)=any(select lower(x) from unnest(language_filter) x)))
  order by c.favorites desc nulls last, c.character_id
  limit coalesce(nullif(limit_count,0),30)
  offset (greatest(coalesce(page_number,1),1)-1)*coalesce(nullif(limit_count,0),30)
$func$;

create or replace function get_characters_count(
  limit_count int default 30, page_number int default 1, role_filter text[] default null,
  search_query text default null, language_filter text[] default null
) returns integer language sql stable as $func$
  select count(*)::int from character c
  where (search_query is null or c.character_name ilike '%'||search_query||'%')
    and (role_filter is null or exists(select 1 from anime_character ac where ac.character_id=c.character_id and lower(ac.role)=any(select lower(x) from unnest(role_filter) x)))
    and (language_filter is null or exists(select 1 from character_voice_actor cva where cva.character_id=c.character_id and lower(cva.language)=any(select lower(x) from unnest(language_filter) x)))
$func$;

create or replace function get_character_images(p_anime_id integer, p_limit_count integer default 10)
returns setof jsonb language sql stable as $func$
  select jsonb_build_object(
    'character_id', c.character_id, 'character_name', c.character_name,
    'character_image_url', c.character_image_url, 'character_small_image_url', c.character_small_image_url,
    'anime_title', a.title
  )
  from anime_character ac
  join character c on c.character_id = ac.character_id
  join anime a on a.mal_id = ac.anime_id
  where ac.anime_id = p_anime_id
  order by case ac.role when 'Main' then 0 else 1 end, c.character_id
  limit p_limit_count
$func$;

create or replace function get_character_details_with_animes(input_character_id integer)
returns jsonb language sql stable as $func$
  select jsonb_build_object(
    'character_id', c.character_id, 'character_name', c.character_name, 'character_name_kanji', c.character_name_kanji,
    'character_nicknames', c.character_nicknames, 'character_about', c.character_about,
    'character_image_url', c.character_image_url, 'character_small_image_url', c.character_small_image_url,
    'character_url', c.character_url,
    'animes', coalesce((select jsonb_agg(jsonb_build_object(
        'mal_id', af.mal_id, 'title', af.title, 'image_webp', af.image_webp, 'year', af.year,
        'status', af.status, 'genres', af.genres, 'image_small_webp', af.image_small_webp,
        'image_large_webp', af.image_large_webp, 'banner_image', af.banner_image, 'role', ac.role))
      from anime_character ac join anime_full af on af.mal_id=ac.anime_id where ac.character_id=c.character_id), '[]'::jsonb),
    'voice_actors', coalesce((select jsonb_agg(jsonb_build_object(
        'id', va.voice_actor_id, 'voice_actor_id', va.voice_actor_id, 'name', va.name,
        'alternative_names', va.alternative_names, 'family_name', va.family_name, 'given_name', va.given_name,
        'birthday', va.birthday, 'image_url', va.image_url, 'language', cva.language))
      from character_voice_actor cva join voice_actors va on va.voice_actor_id=cva.voice_actor_id where cva.character_id=c.character_id), '[]'::jsonb)
  )
  from character c where c.character_id = input_character_id
$func$;

-- ============ artist ============
create or replace function get_artist_info(artist_name text)
returns setof artist language sql stable as $func$
  select * from artist where lower(name) = lower(artist_name) limit 5
$func$;

-- ============ user watch list ============
create or replace function get_user_watch_list(p_user_id uuid)
returns setof jsonb language sql stable as $func$
  select jsonb_build_object(
    'id', w.id, 'user_id', w.user_id, 'anime_id', w.anime_id, 'type', w.type,
    'mal_id', af.mal_id, 'title', af.title, 'image_webp', af.image_webp, 'year', af.year,
    'status', af.status, 'genres', af.genres, 'image_small_webp', af.image_small_webp,
    'image_large_webp', af.image_large_webp
  )
  from watch_list w join anime_full af on af.mal_id = w.anime_id
  where w.user_id = p_user_id
$func$;

-- ============ grants ============
grant execute on all functions in schema public to anon, authenticated, service_role;
grant select on anime_full to anon, authenticated, service_role;
