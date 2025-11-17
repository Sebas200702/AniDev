import { supabase } from '@libs/supabase'

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
      throw new Error(`Failed to add anime to watch list: ${error.message}`)
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
      throw new Error(
        `Failed to remove anime from watch list: ${error.message}`
      )
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
      throw new Error(`Failed to fetch watch list: ${error.message}`)
    }

    return data ?? []
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
      throw new Error(`Failed to save search history: ${error.message}`)
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
      throw new Error(`Failed to fetch search history: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No search history found')
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
      throw new Error(`Failed to delete search history: ${error.message}`)
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
      throw new Error(`Failed to update preferences: ${error.message}`)
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
      throw new Error(`Failed to save profile: ${error.message}`)
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
      throw new Error(`Failed to update profile images: ${error.message}`)
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
