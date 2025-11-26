import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserRepository } from '@user/repositories'

export const saveSearchHistory = async (
  userId: string,
  searchHistory: any[]
): Promise<ApiResponse<any>> => {
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
}

export const getSearchHistory = async (
  userId: string
): Promise<ApiResponse<any[]>> => {
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
}

export const deleteSearchHistory = async (
  userId: string
): Promise<ApiResponse<any>> => {
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
}
