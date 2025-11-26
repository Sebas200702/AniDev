import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

export const UserRepository = {
  /**
   * Add or update an anime in user's watch list
   */
  async upsertWatchListItem(userId: string, animeId: number, type: string) {
    const { error } = await supabase.from('watch_list').upsert({
      anime_id: animeId,
      user_id: userId,
      type: type,
    })

    if (error) {
      throw AppError.database('Failed to add anime to watch list', {
        userId,
        animeId,
        type,
        ...error,
      })
    }

    return { success: true }
  },

  /**
   * Remove an anime from user's watch list
   */
  async removeFromWatchList(userId: string, animeId: number) {
    const { error } = await supabase
      .from('watch_list')
      .delete()
      .eq('anime_id', animeId)
      .eq('user_id', userId)

    if (error) {
      throw AppError.database('Failed to remove anime from watch list', {
        userId,
        animeId,
        ...error,
      })
    }

    return { success: true }
  },

  /**
   * Get user's watch list
   */
  async getWatchList(userId: string) {
    const { data, error } = await supabase.rpc('get_user_watch_list', {
      p_user_id: userId,
    })

    if (error) {
      throw AppError.database('Failed to fetch watch list', {
        userId,
        ...error,
      })
    }
    if (!data) {
      throw AppError.notFound('Watch list not found', { userId })
    }

    return data
  },

  /**
   * Save user's search history
   */
  async saveSearchHistory(userId: string, searchHistory: any[]) {
    const { error } = await supabase.from('search_history').upsert(
      {
        search_history: JSON.stringify(searchHistory),
        user_id: userId,
      },
      {
        onConflict: 'user_id',
      }
    )

    if (error) {
      throw AppError.database('Failed to save search history', {
        userId,
        ...error,
      })
    }

    return { success: true }
  },

  /**
   * Get user's search history
   */
  async getSearchHistory(userId: string) {
    const { data, error } = await supabase
      .from('search_history')
      .select('search_history')
      .eq('id', userId)

    if (error) {
      throw AppError.database('Failed to fetch search history', {
        userId,
        ...error,
      })
    }

    if (!data || data.length === 0) {
      throw AppError.notFound('No search history found', { userId })
    }

    return JSON.parse(data[0].search_history)
  },

  /**
   * Delete user's search history
   */
  async deleteSearchHistory(userId: string) {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('id', userId)

    if (error) {
      throw AppError.database('Failed to delete search history', {
        userId,
        ...error,
      })
    }

    return { success: true }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    enfasisColor?: string,
    parentalControl?: boolean
  ) {
    const updates: any = {}
    if (enfasisColor !== undefined) updates.enfasis_color = enfasisColor
    if (parentalControl !== undefined)
      updates.parental_control = parentalControl

    const { data, error } = await supabase
      .from('public_users')
      .update(updates)
      .eq('id', userId)

    if (error) {
      throw AppError.database('Failed to update preferences', {
        userId,
        updates,
        ...error,
      })
    }
    if (!data) {
      throw AppError.notFound('Preferences not found', { userId })
    }

    return data
  },

  /**
   * Upsert user profile (create or update)
   */
  async upsertProfile(userId: string, profileData: any) {
    const cleanedData = this.cleanProfileData({
      id: userId,
      ...profileData,
    })

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(cleanedData, { onConflict: 'id' })
      .select()

    if (error) {
      throw AppError.database('Failed to save profile', {
        userId,
        ...error,
      })
    }

    return data
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
    const updates: any = {}
    if (avatar) updates.avatar_url = avatar
    if (bannerImage) updates.banner_image = bannerImage
    if (name) updates.name = name

    const { data, error } = await supabase
      .from('public_users')
      .update(updates)
      .eq('id', userId)

    if (error) {
      throw AppError.database('Failed to update profile images', {
        userId,
        updates,
        ...error,
      })
    }

    return data
  },

  /**
   * Helper: Clean profile data by removing empty values
   */
  cleanProfileData<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
        if (value == null) return false
        if (typeof value === 'string') return value.trim() !== ''
        if (Array.isArray(value)) return value.length > 0
        return true
      })
    ) as Partial<T>
  },
}
