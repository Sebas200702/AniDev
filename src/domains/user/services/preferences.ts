import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserRepository } from '@user/repositories'

export const updatePreferences = async (
  userId: string,
  enfasisColor?: string,
  parentalControl?: boolean
): Promise<ApiResponse<any>> => {
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
}
