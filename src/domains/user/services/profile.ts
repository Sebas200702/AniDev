import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserRepository } from '@user/repositories'

export const saveProfile = async (
  userId: string,
  profileData: any
): Promise<ApiResponse<any>> => {
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
}

export const updateUserImages = async (
  userId: string,
  avatar?: string,
  bannerImage?: string,
  name?: string
): Promise<ApiResponse<any>> => {
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
}
