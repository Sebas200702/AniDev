export enum MusicFilters {
  limit_count = 'limit_count',
  type_music = 'type_music',
  search_query = 'search_query',
  order_by = 'order_by',
  page_number = 'page_number',
  anime_season = 'anime_season',
  anime_year = 'anime_year',
  anime_status = 'anime_status',
  anime_id = 'anime_id',
  artist_filter = 'artist_filter',
}

export type TypeMusic = 'OP' | 'ED'

export interface AnimeSongResolution {
  song_id: number | null
  resolution: string
  audio_url: string | null
  video_url: string | null
}

export interface AnimeSongVersion {
  version: number
  version_id: number
  resolutions: AnimeSongResolution[]
}

export interface AnimeSong {
  theme_id: number
  song_title: string | null
  artist_name: string | null
  type: TypeMusic | null

  anime: {
    id: number | null
    title: string | null
    image: string | null
    score: number | null
    banner_image: string | null
  } | null

  versions: AnimeSongVersion[]
}
