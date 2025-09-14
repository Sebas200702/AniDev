export enum MusicFilters {
  limit_count = 'limit_count',
  type_music = 'type_music',
  search_query = 'search_query',
  order_by = 'order_by',
  page_number = 'page_number',
  anime_season = 'anime_season',
  anime_year = 'anime_year',
  anime_status = 'anime_status',
  artist_filter = 'artist_filter',
  unique_per_anime = 'unique_per_anime',
}

export type TypeMusic = 'opening' | 'ending'

export interface AnimeSongWithImage extends AnimeSong {
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
}

export interface AnimeSong {
  anime_id: number
  anime_score: number
  song_title: string
  type: string
  video_url: string
  audio_url: string
  version: number
  resolution: string
  song_id: number
  artist_name: string | null
  episodes: string | null
  sequence: number | null
  theme_id: number | null
  version_id: number | null
}
