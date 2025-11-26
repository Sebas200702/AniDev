import { CharacterRepository } from '@character/repositories'
import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'

const logger = createContextLogger('CharacterService')

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

export const CharacterService = {
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
      logger.error('[CharacterService.searchCharacters] Error:', { error })
      if (isAppError(error)) throw error
      throw AppError.database('Failed to search characters', {
        originalError: error,
      })
    }
  },

  /**
   * Get character details by ID
   */
  async getCharacterById(characterId: number) {
    try {
      return await CharacterRepository.getCharacterDetails(characterId)
    } catch (error) {
      logger.error('[CharacterService.getCharacterById] Error:', { error })
      if (isAppError(error)) throw error
      throw AppError.database('Failed to get character by id', {
        characterId,
        originalError: error,
      })
    }
  },

  async getCharacterImages(animeId: number, limitCount: number = 10) {
    try {
      return await CharacterRepository.getCharacterImages(animeId, limitCount)
    } catch (error) {
      logger.error('[CharacterService.getCharacterImages] Error:', { error })
      if (isAppError(error)) throw error
      throw AppError.database('Failed to get character images', {
        animeId,
        limitCount,
        originalError: error,
      })
    }
  },

  async getCharactersForSitemap(limit: number = 1000) {
    try {
      return await CharacterRepository.getCharactersForSitemap(limit)
    } catch (error) {
      logger.error('[CharacterService.getCharactersForSitemap] Error:', {
        error,
      })
      if (isAppError(error)) throw error
      throw AppError.database('Failed to get characters for sitemap', {
        limit,
        originalError: error,
      })
    }
  },

  async getCharacterDetails(id: number) {
    try {
      const character = await CharacterRepository.getCharacterDetails(id)

      if (!character) {
        throw AppError.notFound('Character data not found', { id })
      }

      return character
    } catch (error) {
      logger.error('[CharacterService.getCharacterDetails] Error:', {
        error,
      })
      if (isAppError(error)) throw error
      throw AppError.database('Failed to get character details', {
        id,
        originalError: error,
      })
    }
  },

  async getAnimeCharacters(animeId: string, language: string) {
    try {
      return await CharacterRepository.getAnimeCharacters(animeId, language)
    } catch (error) {
      logger.error('[CharacterService.getAnimeCharacters] Error:', { error })
      if (isAppError(error)) throw error
      throw AppError.database('Failed to get anime characters', {
        animeId,
        language,
        originalError: error,
      })
    }
  },
}
