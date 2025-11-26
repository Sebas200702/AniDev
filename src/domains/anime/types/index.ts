// Anime Types and Enums
export enum AnimeTypes {
  CM = 'CM',
  MOVIE = 'Movie',
  MUSIC = 'Music',
  ONA = 'ONA',
  OVA = 'OVA',
  PV = 'PV',
  SPECIAL = 'Special',
  TV = 'TV',
  TV_SPECIAL = 'TV Special',
}

export enum AnimeGenres {
  ACTION = 'Action',
  ADVENTURE = 'Adventure',
  AVANT_GARDE = 'Avant Garde',
  AWARD_WINNING = 'Award Winning',
  BOYS_LOVE = 'Boys Love',
  COMEDY = 'Comedy',
  DRAMA = 'Drama',
  ECCHI = 'Ecchi',
  EROTICA = 'Erotica',
  FANTASY = 'Fantasy',
  GIRLS_LOVE = 'Girls Love',
  GOURMET = 'Gourmet',
  HORROR = 'Horror',
  MYSTERY = 'Mystery',
  ROMANCE = 'Romance',
  SCI_FI = 'Sci-Fi',
  SLICE_OF_LIFE = 'Slice of Life',
  SPORTS = 'Sports',
  SUPERNATURAL = 'Supernatural',
  SUSPENSE = 'Suspense',
}

export enum AnimeFilters {
  Genre = 'genre_filter',
  Type = 'type_filter',
  Studio = 'studio_filter',
  Score = 'score_filter',
  Status = 'status_filter',
  Year = 'year_filter',
  Rating = 'rating_filter',
  SearcType = 'type',
}

export enum AnimeRating {
  G = 'g - all ages',
  PG = 'pg - children',
  PG_13 = 'pg-13 - teens 13 or older',
  R = 'r - 17+ (violence & profanity)',
  RN = 'r+ - mild nudity',
  RX = 'rx+-+hentai',
}

export enum NormalizedRating {
  G = 'E',
  PG = 'E10+',
  PG_13 = '13+',
  R = '15+',
  RN = '17+',
  RX = '18+',
}

export enum OrderFunctions {
  score = 'get_animes_order_by_score',
  score_asc = 'get_animes_order_by_score_asc',
  title = 'get_animes_order_by_title',
  title_asc = 'get_animes_order_by_title_asc',
}

// Anime Interfaces
export interface Anime {
  readonly mal_id: number
  readonly url: string | null
  readonly image_url: string | null
  readonly image_small_jpg: string | null
  readonly image_large_jpg: string | null
  readonly image_webp: string | null
  readonly image_small_webp: string | null
  readonly image_large_webp: string | null
  readonly youtube_id: string | null
  readonly trailer_url: string | null
  readonly trailer_embed_url: string | null
  readonly trailer_image_url: string | null
  readonly approved: boolean | null
  readonly title: string
  readonly title_english: string | null
  readonly title_japanese: string | null
  readonly type: string | null
  readonly source: string | null
  readonly episodes: number | null
  readonly status: string
  readonly airing: boolean | null
  readonly aired_from: string | null
  readonly aired_to: string | null
  readonly duration: string | null
  readonly rating: string | null
  readonly score: number | null
  readonly scored_by: number | null
  readonly popularity: number | null
  readonly members: number | null
  readonly favorites: number | null
  readonly synopsis: string | null
  readonly background: string | null
  readonly season: string | null
  readonly year: number
  readonly broadcast_day: string | null
  readonly broadcast_time: string | null
  readonly broadcast_timezone: string | null
  readonly title_synonyms: string[] | null
  readonly banner_image: string | null
  readonly genres: string[]
  readonly studios: string[]
  readonly producers: string[]
  readonly licensors: string[]
  readonly themes: string[]
}

export interface AnimeEpisode {
  episode: number
  title: string
  aired: string
  filler: boolean
  recap: boolean
  video_url: string
  forum_url: string
}

export interface BannerImage {
  title: string
  banner_image: string
  mal_id: number
}

export interface DataImage {
  type: 'avatar' | 'banner'
  url?: string
}

export interface AnimeRecommendation {
  mal_id: number
  title: string
  score?: number
  episodes?: number | null
  image_url?: string
  url?: string
  synopsis?: string | null
  [key: string]: unknown
}

export interface JikanRecommendationsRaw {
  mal_ids: number[]
  titles: string[]
  error?: string
}

export interface JikanRecommendationsMeta {
  count: number
  titles: string[]
  basedOn: string
  isFromFavorites: boolean
  favoriteTitle?: string
}

export interface PickAnimeForJikanResult {
  animeForJikan?: string
  isFromFavorites?: boolean
  selectedFavoriteTitle?: string
}

export interface AnimeCardInfo
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
    | 'year'
    | 'status'
    | 'genres'
    | 'image_small_webp'
    | 'image_large_webp'
  > {}
export interface AnimeBannerInfo
  extends Pick<Anime, 'mal_id' | 'title' | 'synopsis' | 'banner_image'> {}

export interface AnimeCollectionInfo
  extends Pick<Anime, 'mal_id' | 'title' | 'image_webp' | 'image_small_webp'> {}
export interface AnimeDetail
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
    | 'image_small_webp'
    | 'image_large_webp'
    | 'banner_image'
    | 'year'
    | 'type'
    | 'episodes'
  > {}
export interface AnimeTopInfo
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
    | 'image_small_webp'
    | 'score'
    | 'genres'
    | 'season'
    | 'type'
    | 'episodes'
  > {}
export interface RandomAnime extends Pick<Anime, 'mal_id' | 'title'> {}

export interface AnimeSummary extends AnimeCardInfo {
  banner_image: string | null
  role: string
}

export enum Formats {
  AnimeCard = 'anime-card',
  AnimeBanner = 'anime-banner',
  TopAnime = 'top-anime',
  AnimeCollection = 'anime-collection',
  AnimeDetail = 'anime-detail',
  Search = 'search',
  Schedule = 'schedule',
}
