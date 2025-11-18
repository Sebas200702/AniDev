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
  async addToWatchList(userId: string, animeId: number, type: string) {
    try {
      return await UserRepository.upsertWatchListItem(userId, animeId, type)
    } catch (error) {
      console.error('[UserService.addToWatchList] Error:', error)
      throw error
    }
  },

  /**
   * Remove anime from watch list
   */
  async removeFromWatchList(userId: string, animeId: number) {
    try {
      return await UserRepository.removeFromWatchList(userId, animeId)
    } catch (error) {
      console.error('[UserService.removeFromWatchList] Error:', error)
      throw error
    }
  },

  /**
   * Get user's watch list
   */
  async getWatchList(userId: string) {
    try {
      return await UserRepository.getWatchList(userId)
    } catch (error) {
      console.error('[UserService.getWatchList] Error:', error)
      throw error
    }
  },

  /**
   * Save search history
   */
  async saveSearchHistory(userId: string, searchHistory: any[]) {
    try {
      const formatted = Array.isArray(searchHistory) ? searchHistory : []
      return await UserRepository.saveSearchHistory(userId, formatted)
    } catch (error) {
      console.error('[UserService.saveSearchHistory] Error:', error)
      throw error
    }
  },

  /**
   * Get search history
   */
  async getSearchHistory(userId: string) {
    try {
      return await UserRepository.getSearchHistory(userId)
    } catch (error: any) {
      if (error.message === 'No search history found') {
        return []
      }
      console.error('[UserService.getSearchHistory] Error:', error)
      throw error
    }
  },

  /**
   * Delete search history
   */
  async deleteSearchHistory(userId: string) {
    try {
      return await UserRepository.deleteSearchHistory(userId)
    } catch (error) {
      console.error('[UserService.deleteSearchHistory] Error:', error)
      throw error
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    enfasisColor?: string,
    parentalControl?: boolean
  ) {
    try {
      if (!enfasisColor && parentalControl === undefined) {
        throw new Error('User preferences is required')
      }

      return await UserRepository.updatePreferences(
        userId,
        enfasisColor,
        parentalControl
      )
    } catch (error) {
      console.error('[UserService.updatePreferences] Error:', error)
      throw error
    }
  },

  /**
   * Save or update user profile
   */
  async saveProfile(userId: string, profileData: any) {
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

      return await UserRepository.upsertProfile(userId, mappedData)
    } catch (error) {
      console.error('[UserService.saveProfile] Error:', error)
      throw error
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
  ) {
    try {
      if (!avatar && !bannerImage && !name) {
        throw new Error(
          'At least one field (avatar, banner, or name) is required'
        )
      }

      return await UserRepository.updateUserImages(
        userId,
        avatar,
        bannerImage,
        name
      )
    } catch (error) {
      console.error('[UserService.updateUserImages] Error:', error)
      throw error
    }
  },
}
