import { AnimeFilters } from '@anime/types'

export const HomeUrlBuilder = {
  buildGenreUrl: (genre: string, limit = 24, withBanner = false): string => {
    const normalizedGenre =
      genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()
    return `/animes?limit_count=${limit}&${AnimeFilters.Genre}=${normalizedGenre}&banners_filter=${withBanner}`
  },

  buildYearUrl: (
    year: number,
    type?: string,
    limit = 24,
    withBanner = false
  ): string => {
    const typeParam = type ? `&${AnimeFilters.Type}=${type}` : ''
    return `/animes?limit_count=${limit}&${AnimeFilters.Year}=${year}${typeParam}&banners_filter=${withBanner}`
  },

  buildTypeUrl: (type: string, limit = 24, withBanner = false): string => {
    const normalizedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    return `/animes?limit_count=${limit}&${AnimeFilters.Type}=${normalizedType}&banners_filter=${withBanner}`
  },

  buildStudioUrl: (studio: string, limit = 24, withBanner = false): string => {
    return `/animes?limit_count=${limit}&${AnimeFilters.Studio}=${encodeURIComponent(studio)}&banners_filter=${withBanner}`
  },

  buildComplexUrl: (params: {
    genre?: string
    year?: number
    type?: string
    studio?: string
    limit?: number
    withBanner?: boolean
  }): string => {
    const { genre, year, type, studio, limit = 24, withBanner = false } = params
    const query = new URLSearchParams()
    query.set('limit_count', limit.toString())
    query.set('banners_filter', withBanner.toString())

    if (genre) query.set(AnimeFilters.Genre, genre)
    if (year) query.set(AnimeFilters.Year, year.toString())
    if (type) query.set(AnimeFilters.Type, type)
    if (studio) query.set(AnimeFilters.Studio, studio)

    return `/animes?${query.toString()}`
  },

  buildRecommendationsUrl: (
    count = 24,
    options?: {
      mood?: string
      focus?: string
      referenceAnime?: string
    }
  ): string => {
    const query = new URLSearchParams()
    query.set('count', count.toString())

    if (options?.mood) query.set('mood', options.mood)
    if (options?.focus) query.set('focus', options.focus)
    if (options?.referenceAnime)
      query.set('referenceAnime', options.referenceAnime)

    return `/recommendations?${query.toString()}`
  },
}
