import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

const cleanProfileData = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value == null) return false
      if (typeof value === 'string') return value.trim() !== ''
      if (Array.isArray(value)) return value.length > 0
      return true
    })
  ) as Partial<T>
}

export const upsertProfile = async (userId: string, profileData: any) => {
  const cleanedData = cleanProfileData({
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
}

export const updateUserImages = async (
  userId: string,
  avatar?: string,
  bannerImage?: string,
  name?: string
) => {
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
}
