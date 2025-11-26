import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserRepository } from '@user/repositories'

export const addToWatchList = async (
  userId: string,
  animeId: number,
  type: string
): Promise<ApiResponse<any>> => {
  try {
    const data = await UserRepository.upsertWatchListItem(userId, animeId, type)
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
}

export const removeFromWatchList = async (
  userId: string,
  animeId: number
): Promise<ApiResponse<any>> => {
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
}

export const getWatchList = async (
  userId: string
): Promise<ApiResponse<any[]>> => {
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
}
