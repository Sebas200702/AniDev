-- Fix get_characters_list: limit BEFORE the lateral VA join (was scanning all
-- 217k characters through the lateral join pre-LIMIT → statement timeout).
create or replace function get_characters_list(
  limit_count int default 30, page_number int default 1, role_filter text[] default null,
  search_query text default null, language_filter text[] default null
) returns setof jsonb language sql stable as $func$
  with base as (
    select c.* from character c
    where (search_query is null or c.character_name ilike '%'||search_query||'%')
      and (role_filter is null or exists(select 1 from anime_character ac where ac.character_id=c.character_id and lower(ac.role)=any(select lower(x) from unnest(role_filter) x)))
      and (language_filter is null or exists(select 1 from character_voice_actor cva where cva.character_id=c.character_id and lower(cva.language)=any(select lower(x) from unnest(language_filter) x)))
    order by c.favorites desc nulls last, c.character_id
    limit coalesce(nullif(limit_count,0),30)
    offset (greatest(coalesce(page_number,1),1)-1)*coalesce(nullif(limit_count,0),30)
  )
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
  from base c
  left join lateral (
    select v.*, cva.language from character_voice_actor cva
    join voice_actors v on v.voice_actor_id = cva.voice_actor_id
    where cva.character_id = c.character_id
      and (language_filter is null or lower(cva.language)=any(select lower(x) from unnest(language_filter) x))
    limit 1
  ) va on true
$func$;
