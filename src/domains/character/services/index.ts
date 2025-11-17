import { CharacterRepository } from '@character/repositories'

interface SearchCharactersParams {
  filters: Record<string, any>
  countFilters: Record<string, any>
  page: number
  limit: number
}

interface SearchCharactersResult {
  data: any[]
  total_items: number
  current_page: number
  last_page: number
}

/**
 * Character Service
 *
 * @description
 * Service layer for character-related operations. Handles business logic
 * for character search, filtering, and pagination.
 *
 * @features
 * - Character list search with filters
 * - Pagination support
 * - Error handling and logging
 */
export const CharacterService = {
  /**
   * Search characters with filters and pagination
   */
  async searchCharacters({
    filters,
    countFilters,
    page,
    limit,
  }: SearchCharactersParams): Promise<SearchCharactersResult> {
    try {
      const [data, totalCount] = await Promise.all([
        CharacterRepository.getCharactersList(filters),
        CharacterRepository.getCharactersCount(countFilters),
      ])

      return {
        data,
        total_items: totalCount,
        current_page: page,
        last_page: Math.ceil(totalCount / limit),
      }
    } catch (error) {
      console.error('[CharacterService.searchCharacters] Error:', error)
      throw error
    }
  },

  /**
   * Get character details by ID
   */
  async getCharacterById(characterId: number) {
    try {
      return await CharacterRepository.getCharacterDetails(characterId)
    } catch (error) {
      console.error('[CharacterService.getCharacterById] Error:', error)
      throw error
    }
  },

  /**
   * Get character images for an anime
   */
  async getCharacterImages(animeId: number, limitCount: number = 10) {
    try {
      return await CharacterRepository.getCharacterImages(animeId, limitCount)
    } catch (error) {
      console.error('[CharacterService.getCharacterImages] Error:', error)
      throw error
    }
  },

  /**
   * Get top characters for sitemap generation
   */
  async getCharactersForSitemap(limit: number = 1000) {
    try {
      return await CharacterRepository.getCharactersForSitemap(limit)
    } catch (error) {
      console.error('[CharacterService.getCharactersForSitemap] Error:', error)
      throw error
    }
  },
}
