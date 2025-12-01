import { CharacterRepository } from '@character/repositories'
import type { Character, CharacterDetails } from '@character/types'
import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'

const logger = createContextLogger('CharacterService')

interface SearchCharactersParams {
  filters: Record<string, any>
  countFilters: Record<string, any>
  page: number
  limit: number
}

export const CharacterService = {
  async searchCharacters({
    filters,
    countFilters,
    page,
    limit,
  }: SearchCharactersParams): Promise<ApiResponse<Character[]>> {
    try {
      const [data, totalCount] = await Promise.all([
        CharacterRepository.getCharactersList(filters),
        CharacterRepository.getCharactersCount(countFilters),
      ])

      return {
        data,
        meta: {
          total_items: totalCount,
          current_page: page,
          last_page: Math.ceil(totalCount / limit),
        },
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
  async getCharacterById(characterId: number): Promise<CharacterDetails> {
    try {
      const data = await CharacterRepository.getCharacterDetails(characterId)
      return data
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
      const data = await CharacterRepository.getCharacterImages(
        animeId,
        limitCount
      )
      return data
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

  async getCharactersForSitemap(
    limit: number = 1000
  ): Promise<ApiResponse<any[]>> {
    try {
      const data = await CharacterRepository.getCharactersForSitemap(limit)
      return { data }
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

  async getCharacterDetails(
    id: number
  ): Promise<ApiResponse<CharacterDetails>> {
    try {
      const character = await CharacterRepository.getCharacterDetails(id)

      if (!character) {
        throw AppError.notFound('Character data not found', { id })
      }

      return { data: character }
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

  async getAnimeCharacters(
    animeId: string,
    language: string
  ): Promise<ApiResponse<Character[]>> {
    try {
      const result = await CharacterRepository.getAnimeCharacters(
        animeId,
        language
      )
      console.log('Fetched anime characters:', result)
      return { data: result }
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
