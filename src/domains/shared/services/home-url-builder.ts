import { AnimeFilters } from '@anime/types'


export const HomeUrlBuilder = {
  buildGenreUrl: (genre: string, limit = 24): string => {
    const normalizedGenre =
      genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()
    return `/animes?limit_count=${limit}&${AnimeFilters.Genre}=${normalizedGenre}&banners_filter=false`
  },

  buildYearUrl: (year: number, type?: string, limit = 24): string => {
    const typeParam = type ? `&${AnimeFilters.Type}=${type}` : ''
    return `/animes?limit_count=${limit}&${AnimeFilters.Year}=${year}${typeParam}&banners_filter=false`
  },

  buildTypeUrl: (type: string, limit = 24): string => {
    const normalizedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    return `/animes?limit_count=${limit}&${AnimeFilters.Type}=${normalizedType}&banners_filter=false`
  },

  buildStudioUrl: (studio: string, limit = 24): string => {
    return `/animes?limit_count=${limit}&${AnimeFilters.Studio}=${encodeURIComponent(studio)}&banners_filter=false`
  },

  buildRecommendationsUrl: (count = 24): string => {
    return `/recomendations?count=${count}`
  },
}
