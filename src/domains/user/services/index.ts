import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserRepository } from '@user/repositories'

/**
 * User Service
 *
 * @description
 * Service layer for user-related operations. Handles business logic
 * for watch list management and user data.
 *
 * @features
 * - Watch list management (add, remove, get)
 * - Error handling and logging
 */
export const UserService = {
  /**
   * Add or update anime in watch list
   */
  async addToWatchList(
    userId: string,
    animeId: number,
    type: string
  ): Promise<ApiResponse<any>> {
    try {
      const data = await UserRepository.upsertWatchListItem(
        userId,
        animeId,
        type
      )
      return { data }
    } catch (error) {
      console.error('[UserService.addToWatchList] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to add to watch list', {
        userId,
        animeId,
        type,
        originalError: error,
      })
    }
  },

  /**
   * Remove anime from watch list
   */
  async removeFromWatchList(
    userId: string,
    animeId: number
  ): Promise<ApiResponse<any>> {
    try {
      const data = await UserRepository.removeFromWatchList(userId, animeId)
      return { data }
    } catch (error) {
      console.error('[UserService.removeFromWatchList] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to remove from watch list', {
        userId,
        animeId,
        originalError: error,
      })
    }
  },

  /**
   * Get user's watch list
   */
  async getWatchList(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const data = await UserRepository.getWatchList(userId)
      return { data }
    } catch (error) {
      console.error('[UserService.getWatchList] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get watch list', {
        userId,
        originalError: error,
      })
    }
  },

  /**
   * Save search history
   */
  async saveSearchHistory(
    userId: string,
    searchHistory: any[]
  ): Promise<ApiResponse<any>> {
    try {
      const formatted = Array.isArray(searchHistory) ? searchHistory : []
      const data = await UserRepository.saveSearchHistory(userId, formatted)
      return { data }
    } catch (error) {
      console.error('[UserService.saveSearchHistory] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to save search history', {
        userId,
        originalError: error,
      })
    }
  },

  /**
   * Get search history
   */
  async getSearchHistory(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const data = await UserRepository.getSearchHistory(userId)
      return { data }
    } catch (error) {
      console.error('[UserService.getSearchHistory] Error:', error)

      if (isAppError(error)) {
        if (error.type === 'notFound') {
          return { data: [] }
        }

        throw error
      }

      throw AppError.database('Failed to get search history', {
        userId,
        originalError: error,
      })
    }
  },

  /**
   * Delete search history
   */
  async deleteSearchHistory(userId: string): Promise<ApiResponse<any>> {
    try {
      const data = await UserRepository.deleteSearchHistory(userId)
      return { data }
    } catch (error) {
      console.error('[UserService.deleteSearchHistory] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to delete search history', {
        userId,
        originalError: error,
      })
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    enfasisColor?: string,
    parentalControl?: boolean
  ): Promise<ApiResponse<any>> {
    try {
      if (!enfasisColor && parentalControl === undefined) {
        throw AppError.validation('User preferences is required')
      }

      const data = await UserRepository.updatePreferences(
        userId,
        enfasisColor,
        parentalControl
      )
      return { data }
    } catch (error) {
      console.error('[UserService.updatePreferences] Error:', error)

      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to update preferences', {
        userId,
        enfasisColor,
        parentalControl,
        originalError: error,
      })
    }
  },

  /**
   * Save or update user profile
   */
  async saveProfile(
    userId: string,
    profileData: any
  ): Promise<ApiResponse<any>> {
    try {
      // Map request fields to database fields
      const mappedData: any = {}

      if (profileData.name) mappedData.name = profileData.name
      if (profileData.last_name) mappedData.last_name = profileData.last_name
      if (profileData.birthday) mappedData.birthday = profileData.birthday
      if (profileData.gender) mappedData.gender = profileData.gender
      if (profileData.favorite_animes)
        mappedData.favorite_animes = profileData.favorite_animes
      if (profileData.frequency)
        mappedData.frequency_of_watch = profileData.frequency
      if (profileData.fanatic_level)
        mappedData.fanatic_level = profileData.fanatic_level
      if (profileData.preferred_format)
        mappedData.preferred_format = profileData.preferred_format
      if (profileData.watched_animes)
        mappedData.watched_animes = profileData.watched_animes
      if (profileData.favorite_studios)
        mappedData.favorite_studios = profileData.favorite_studios
      if (profileData.favorite_genres)
        mappedData.favorite_genres = profileData.favorite_genres

      const data = await UserRepository.upsertProfile(userId, mappedData)
      return { data }
    } catch (error) {
      console.error('[UserService.saveProfile] Error:', error)

      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to save profile', {
        userId,
        originalError: error,
      })
    }
  },

  /**
   * Update user avatar and banner
   */
  async updateUserImages(
    userId: string,
    avatar?: string,
    bannerImage?: string,
    name?: string
  ): Promise<ApiResponse<any>> {
    try {
      if (!avatar && !bannerImage && !name) {
        throw AppError.validation(
          'At least one field (avatar, banner, or name) is required'
        )
      }

      const data = await UserRepository.updateUserImages(
        userId,
        avatar,
        bannerImage,
        name
      )
      return { data }
    } catch (error) {
      console.error('[UserService.updateUserImages] Error:', error)

      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to update user images', {
        userId,
        avatar,
        bannerImage,
        name,
        originalError: error,
      })
    }
  },
}
