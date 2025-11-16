import type { Anime } from '@anime/types'
import { AnimeRepository } from '@anime/repositories'

export interface AnimeResult {
  anime?: Anime
  blocked?: boolean
  message?: string
}

/**
 * Anime Service
 *
 * @description
 * Service layer for anime-related business logic. This service provides
 * methods for fetching anime data and performing anime-related operations.
 * It uses the AnimeRepository for data access and adds additional business
 * logic, error handling, and data validation.
 *
 * @features
 * - Random anime selection with parental control
 * - Anime search with filters and pagination
 * - Get anime by ID with parental control and blocked content handling
 * - Centralized error handling
 * - Business logic layer between controllers and repositories
 */
export const AnimeService = {
  /**
   * Gets a random anime for the user
   *
   * @param userId - The user ID (can be null for guests)
   * @param parentalControl - Whether parental control is enabled
   * @returns Random anime data or null if not found
   */
  async getRandomAnime(userId: string | null, parentalControl: boolean | null) {
    try {
      const result = await AnimeRepository.getRandom(userId, parentalControl)

      if (!result) {
        return null
      }

      return result
    } catch (error) {
      console.error('[AnimeService.getRandomAnime] Error:', error)
      throw new Error('Failed to fetch random anime')
    }
  },

  /**
   * Searches for anime with filters and pagination
   *
   * @param format - The search format (e.g., 'anime-card', 'anime-list')
   * @param filters - Search filters to apply (includes pagination, sorting, etc.)
   * @param countFilters - Filters for counting total results
   * @returns Anime search results with total count
   */
  async searchAnime({
    format,
    filters,
    countFilters,
  }: {
    format: string
    filters: Record<string, any>
    countFilters: Record<string, any>
  }) {
    try {
      const result = await AnimeRepository.searchAnime({
        format,
        filters,
        countFilters,
      })

      // Validar que haya resultados
      if (!result.data || result.data.length === 0) {
        return {
          data: [],
          total: 0,
        }
      }

      return result
    } catch (error) {
      console.error('[AnimeService.searchAnime] Error:', error)
      throw new Error('Failed to search anime')
    }
  },

  /**
   * Gets an anime by ID with parental control handling
   *
   * @param animeId - The anime MAL ID
   * @param parentalControl - Whether parental control is enabled
   * @returns AnimeResult object containing anime data, or blocked/not found status
   */
  async getById(
    animeId: number,
    parentalControl: boolean = true
  ): Promise<AnimeResult> {
    try {
      const result = await AnimeRepository.getById(animeId, parentalControl)

      // Anime no encontrado
      if (result === null) {
        return {}
      }

      // Anime bloqueado por control parental
      if ('blocked' in result && result.blocked) {
        return {
          blocked: true,
          message: result.message,
        }
      }

      // Anime encontrado
      return {
        anime: result as Anime,
      }
    } catch (error) {
      console.error('[AnimeService.getById] Error:', error)
      throw new Error('Failed to fetch anime by ID')
    }
  },
}
