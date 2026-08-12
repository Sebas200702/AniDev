/**
 * Seed the v1 local Supabase DB from the anidev-v2 Postgres.
 * Run: bun run revival/scripts/seed.ts   (needs both DBs up)
 *   - source (v2):  postgres://anidev:anidev@localhost:5432/anidev
 *   - target (v1):  postgres://postgres:postgres@127.0.0.1:54322/postgres
 * Idempotent (ON CONFLICT DO NOTHING). See revival/data-mapping.md.
 */
import { SQL } from 'bun'

const src = new SQL('postgres://anidev:anidev@localhost:5432/anidev')
const dst = new SQL('postgres://postgres:postgres@127.0.0.1:54322/postgres')

const ARRAY_COLS = new Set([
  'title_synonyms',
  'character_nicknames',
  'alternative_names',
])

function toPgArray(v: unknown): string | null {
  if (v == null) return null
  const arr = (Array.isArray(v) ? v : [v]).filter((x) => x != null)
  if (!arr.length) return null
  return (
    '{' +
    arr
      .map(
        (x) =>
          '"' + String(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
      )
      .join(',') +
    '}'
  )
}

async function insertBatch(
  table: string,
  cols: string[],
  rows: Record<string, unknown>[]
) {
  if (!rows.length) return 0
  const batch = Math.max(1, Math.min(3000, Math.floor(55000 / cols.length)))
  const colList = cols.map((c) => `"${c}"`).join(',')
  let inserted = 0
  for (let i = 0; i < rows.length; i += batch) {
    const chunk = rows.slice(i, i + batch)
    const ph: string[] = []
    const vals: unknown[] = []
    let p = 1
    for (const r of chunk) {
      ph.push('(' + cols.map(() => `$${p++}`).join(',') + ')')
      for (const c of cols) {
        let v = r[c] === undefined ? null : r[c]
        if (ARRAY_COLS.has(c)) v = toPgArray(v)
        vals.push(v)
      }
    }
    const res = await dst.unsafe(
      `INSERT INTO "${table}" (${colList}) VALUES ${ph.join(',')} ON CONFLICT DO NOTHING`,
      vals
    )
    inserted += Array.isArray(res) ? res.length : (res?.count ?? 0)
  }
  return inserted
}

// Copy a full (small/medium) result set.
async function copy(table: string, selectSql: string, cols: string[], xform?: (r: any) => any) {
  let rows: any[] = await src.unsafe(selectSql)
  if (xform) rows = rows.map(xform)
  const n = await insertBatch(table, cols, rows)
  console.log(`  ${table.padEnd(22)} src=${String(rows.length).padStart(7)}  ok`)
}

// Keyset-paginate a grouped select on an integer key column `keyCol`.
async function copyKeyset(
  table: string,
  keyCol: string,
  buildSql: (whereGt: string) => string,
  cols: string[],
  xform?: (r: any) => any,
  page = 20000
) {
  let last = -1
  let total = 0
  for (;;) {
    let rows: any[] = await src.unsafe(buildSql(`${last}`))
    if (!rows.length) break
    last = rows[rows.length - 1][keyCol]
    if (xform) rows = rows.map(xform)
    await insertBatch(table, cols, rows)
    total += rows.length
    if (rows.length < page) break
  }
  console.log(`  ${table.padEnd(22)} src=${String(total).padStart(7)}  ok (keyset)`)
}

// OFFSET-paginate a plain select (for large junction tables).
async function copyOffset(table: string, base: string, order: string, cols: string[], page = 40000) {
  let off = 0
  let total = 0
  for (;;) {
    const rows: any[] = await src.unsafe(`${base} ORDER BY ${order} LIMIT ${page} OFFSET ${off}`)
    if (!rows.length) break
    await insertBatch(table, cols, rows)
    total += rows.length
    off += page
    if (rows.length < page) break
  }
  console.log(`  ${table.padEnd(22)} src=${String(total).padStart(7)}  ok (offset)`)
}

const jpg = (u: string | null) => (u ? u.replace(/\.webp$/, '.jpg') : null)
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)

console.log('== catalogs ==')
await copy('genres', 'SELECT mal_id, name FROM genre', ['mal_id', 'name'])
await copy('themes', 'SELECT mal_id, name FROM theme', ['mal_id', 'name'])
await copy(
  'producers',
  `SELECT p.mal_id,
     COALESCE(max(case when pt.type='Default' then pt.title end), max(pt.title), 'Producer '||p.mal_id) AS name
   FROM producer p LEFT JOIN producer_title pt ON pt.producer_id=p.mal_id
   GROUP BY p.mal_id`,
  ['mal_id', 'name']
)

console.log('== anime ==')
await copyKeyset(
  'anime',
  'mal_id',
  (gt) => `
    SELECT a.mal_id, a.title, a.title_english, a.title_japanese, a.type, a.status,
      a.episodes, a.score, a.scored_by, a.rating, a.year, a.season, a.synopsis, a.background,
      a.popularity_rank AS popularity,
      ('https://myanimelist.net/anime/'||a.mal_id) AS url,
      (a.status ILIKE 'currently airing') AS airing,
      max(case when am.media_type='poster' and am.size='default' then am.src end) AS image_webp,
      max(case when am.media_type='poster' and am.size='large'   then am.src end) AS image_large_webp,
      max(case when am.media_type='poster' and am.size='small'   then am.src end) AS image_small_webp,
      max(case when am.media_type='banner' then am.src end) AS banner_image,
      (select array_agg(distinct s.title) from anime_title_synonym s where s.anime_id=a.mal_id) AS title_synonyms
    FROM anime a LEFT JOIN anime_media am ON am.anime_id=a.mal_id
    WHERE a.mal_id > ${gt}
    GROUP BY a.mal_id
    ORDER BY a.mal_id
    LIMIT 20000`,
  [
    'mal_id', 'url', 'image_url', 'image_small_jpg', 'image_large_jpg',
    'image_webp', 'image_small_webp', 'image_large_webp', 'title', 'title_english',
    'title_japanese', 'type', 'status', 'episodes', 'score', 'scored_by',
    'popularity', 'rating', 'year', 'season', 'synopsis', 'background', 'airing',
    'title_synonyms', 'banner_image',
  ],
  (r) => ({
    ...r,
    image_url: jpg(r.image_webp),
    image_small_jpg: jpg(r.image_small_webp),
    image_large_jpg: jpg(r.image_large_webp),
  })
)

console.log('== anime junctions ==')
await copy('anime_genres', 'SELECT anime_id, genre_id FROM anime_genre', ['anime_id', 'genre_id'])
await copy('anime_themes', 'SELECT anime_id, theme_id FROM anime_theme', ['anime_id', 'theme_id'])
await copy('anime_producers', 'SELECT anime_id, producer_id FROM anime_producer', ['anime_id', 'producer_id'])
await copy('anime_relation', 'SELECT anime_id, related_anime_id, relation_type FROM anime_relation', ['anime_id', 'related_anime_id', 'relation_type'])

console.log('== episodes ==')
await copyKeyset(
  'anime_episodes',
  '__k',
  (gt) => `
    SELECT id AS __k, anime_id AS anime_mal_id, number AS episode_id, title, synopsis AS description
    FROM episode WHERE id > ${gt} ORDER BY id LIMIT 20000`,
  ['anime_mal_id', 'episode_id', 'title', 'description']
)

console.log('== music ==')
await copy(
  'music',
  `SELECT m.id AS theme_id, m.title AS song_title, m.type,
     (select min(am.anime_id) from anime_music am where am.music_id=m.id) AS anime_id,
     (select a.name from music_artist ma join artist a on a.id=ma.artist_id where ma.music_id=m.id limit 1) AS artist_name
   FROM music m`,
  ['theme_id', 'song_title', 'type', 'anime_id', 'artist_name']
)
await copy('song_versions', 'SELECT version_id, music_id AS theme_id, version FROM music_version', ['version_id', 'theme_id', 'version'])
await copy('song_resolutions', 'SELECT music_version_id AS version_id, song_id, resolution, audio_url, video_url FROM music_resolution', ['version_id', 'song_id', 'resolution', 'audio_url', 'video_url'])

console.log('== characters ==')
await copyKeyset(
  'character',
  'character_id',
  (gt) => `
    SELECT c.mal_id AS character_id, c.name AS character_name, c.name_kanji AS character_name_kanji,
      c.about AS character_about,
      max(case when cm.media_type='picture' then cm.src end) AS character_image_url,
      (select array_agg(cn.nickname) from character_nickname cn where cn.character_id=c.mal_id) AS character_nicknames
    FROM character c LEFT JOIN character_media cm ON cm.character_id=c.mal_id
    WHERE c.mal_id > ${gt}
    GROUP BY c.mal_id
    ORDER BY c.mal_id
    LIMIT 20000`,
  ['character_id', 'character_name', 'character_name_kanji', 'character_about', 'character_image_url', 'character_small_image_url', 'character_url', 'slug', 'character_nicknames'],
  (r) => ({
    ...r,
    character_small_image_url: r.character_image_url,
    character_url: `https://myanimelist.net/character/${r.character_id}`,
    slug: `${slugify(r.character_name || 'character')}-${r.character_id}`,
  })
)
await copyOffset('anime_character', 'SELECT anime_id, character_id, role FROM anime_character', 'anime_id, character_id, role', ['anime_id', 'character_id', 'role'])

console.log('== voice actors ==')
await copyKeyset(
  'voice_actors',
  'voice_actor_id',
  (gt) => `
    SELECT s.mal_id AS voice_actor_id, s.name, s.given_name, s.family_name, s.birthday, s.about,
      max(case when sm.media_type='picture' then sm.src end) AS image_url,
      (select array_agg(san.name) from staff_alternative_name san where san.staff_id=s.mal_id) AS alternative_names
    FROM staff s LEFT JOIN staff_media sm ON sm.staff_id=s.mal_id
    WHERE s.mal_id > ${gt}
    GROUP BY s.mal_id
    ORDER BY s.mal_id
    LIMIT 20000`,
  ['voice_actor_id', 'name', 'given_name', 'family_name', 'birthday', 'about', 'image_url', 'alternative_names']
)
await copy('character_voice_actor', 'SELECT character_id, staff_id AS voice_actor_id, language FROM character_voice_actor', ['character_id', 'voice_actor_id', 'language'])

console.log('== artists ==')
await copy(
  'artist',
  `SELECT a.id, a.mal_id, a.name, s.about, s.birthday, s.given_name, s.family_name,
     max(case when sm.media_type='picture' then sm.src end) AS image_url,
     (select array_agg(san.name) from staff_alternative_name san where san.staff_id=a.mal_id) AS alternative_names
   FROM artist a
   LEFT JOIN staff s ON s.mal_id=a.mal_id
   LEFT JOIN staff_media sm ON sm.staff_id=a.mal_id
   GROUP BY a.id, a.mal_id, a.name, s.about, s.birthday, s.given_name, s.family_name`,
  ['id', 'mal_id', 'name', 'about', 'birthday', 'given_name', 'family_name', 'image_url', 'alternative_names']
)

console.log('== reset sequences ==')
await dst.unsafe(`SELECT setval(pg_get_serial_sequence('artist','id'), GREATEST((SELECT COALESCE(max(id),1) FROM artist),1))`)
await dst.unsafe(`SELECT setval(pg_get_serial_sequence('song_resolutions','id'), GREATEST((SELECT COALESCE(max(id),1) FROM song_resolutions),1))`)

console.log('\nDONE.')
await src.end()
await dst.end()
