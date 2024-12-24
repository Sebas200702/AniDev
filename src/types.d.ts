export type Anime = {
  readonly mal_id: number
  readonly title: string
  readonly title_japanese: string
  readonly title_synonyms: string[]
  readonly type: string
  readonly source: string
  readonly episodes: number | null
  readonly status: string
  readonly aired_from: string
  readonly year: string
  readonly aired_to?: string | null
  readonly duration: string
  readonly rating: string
  readonly score: number
  readonly scored_by: number
  readonly synopsis: string
  readonly genres: string[]
  readonly studios: string[]
  readonly trailer_url: string
  readonly image_url: string
  readonly image_webp: string
  readonly image_small_jpg: string
  readonly image_small_webp: string
  readonly image_large_jpg: string
  readonly image_large_webp: string
  readonly banner_image: string
  readonly created_at: string
  readonly relevance_score: number
}

export type Animes = {
  animes: Anime[]
}

export interface FilterOption {
  value: string
  label: string
}
export interface AnimeEpisode {
    episode_number: number
    video_url: string
    image_url: string
}
export interface AppliedFilters {
  [category: string]: string[]
}
