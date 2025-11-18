import { AnimeFilters } from '@anime/types'

/**
 * Home URL Builder Service
 *
 * @description
 * Servicio centralizado para construir URLs de secciones del home.
 * Genera URLs consistentes para diferentes tipos de filtros.
 */

export const HomeUrlBuilder = {
  /**
   * Construye URL para sección de género
   */
  buildGenreUrl: (genre: string, limit = 24): string => {
    // Normalizar género: capitalize first letter
    const normalizedGenre =
      genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()
    return `/animes?limit_count=${limit}&${AnimeFilters.Genre}=${normalizedGenre}&banners_filter=false`
  },

  /**
   * Construye URL para sección de año
   */
  buildYearUrl: (year: number, type?: string, limit = 24): string => {
    const typeParam = type ? `&${AnimeFilters.Type}=${type}` : ''
    return `/animes?limit_count=${limit}&${AnimeFilters.Year}=${year}${typeParam}&banners_filter=false`
  },

  /**
   * Construye URL para sección de tipo (TV, Movie, etc.)
   */
  buildTypeUrl: (type: string, limit = 24): string => {
    // Normalizar tipo: capitalize first letter
    const normalizedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    return `/animes?limit_count=${limit}&${AnimeFilters.Type}=${normalizedType}&banners_filter=false`
  },

  /**
   * Construye URL para sección de estudio
   */
  buildStudioUrl: (studio: string, limit = 24): string => {
    return `/animes?limit_count=${limit}&${AnimeFilters.Studio}=${encodeURIComponent(studio)}&banners_filter=false`
  },

  /**
   * Construye URL para recomendaciones
   */
  buildRecommendationsUrl: (count = 24): string => {
    return `/recomendations?count=${count}`
  },
}
