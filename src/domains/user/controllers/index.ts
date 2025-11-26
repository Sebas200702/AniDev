import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserService } from '@user/services'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { AstroCookies } from 'astro'

/**
 * User Controller
 *
 * @description
 * Controller layer for user endpoints. Handles authentication,
 * request parsing, and response formatting.
 */
export const UserController = {
  /**
   * Get user info from session
   */
  async getUserFromSession(request: Request, cookies: AstroCookies) {
    const userInfo = await getSessionUserInfo({
      request,
      cookies,
    })

    if (!userInfo?.id) {
      throw AppError.unauthorized('Unauthorized')
    }

    return userInfo
  },

  /**
   * Handle add to watch list request
   */
  async handleAddToWatchList(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id
    const body = await request.json()
    const { animeId, type } = body

    if (!animeId || !type || !userId) {
      throw AppError.validation('Missing required fields: animeId and type')
    }

    return await UserService.addToWatchList(userId, animeId, type)
  },

  /**
   * Handle remove from watch list request
   */
  async handleRemoveFromWatchList(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id
    const body = await request.json()
    const { animeId } = body

    if (!animeId || !userId) {
      throw AppError.validation('Missing required field: animeId')
    }

    return await UserService.removeFromWatchList(userId, animeId)
  },

  /**
   * Handle get watch list request
   */
  async handleGetWatchList(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any[]>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string

    return await UserService.getWatchList(userId)
  },

  /**
   * Handle save search history request
   */
  async handleSaveSearchHistory(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string
    const searchHistory = await request.json()
    return await UserService.saveSearchHistory(userId, searchHistory)
  },

  /**
   * Handle get search history request
   */
  async handleGetSearchHistory(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any[]>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string
    return await UserService.getSearchHistory(userId)
  },

  /**
   * Handle delete search history request
   */
  async handleDeleteSearchHistory(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string
    return await UserService.deleteSearchHistory(userId)
  },

  /**
   * Handle update preferences request
   */
  async handleUpdatePreferences(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string
    const body = await request.json()
    const { enfasiscolor, parentalControl } = body

    return await UserService.updatePreferences(
      userId,
      enfasiscolor,
      parentalControl
    )
  },

  /**
   * Handle save profile request
   */
  async handleSaveProfile(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string
    const body = await request.json()

    return await UserService.saveProfile(userId, body)
  },

  /**
   * Handle update user images request
   */
  async handleUpdateUserImages(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const userInfo = await this.getUserFromSession(request, cookies)
    const userId = userInfo.id as string
    const body = await request.json()
    const { avatar, banner_image, name } = body

    if (!avatar && !banner_image && !name) {
      throw AppError.validation(
        'At least one field is required: avatar, banner_image, or name'
      )
    }

    return await UserService.updateUserImages(
      userId,
      avatar,
      banner_image,
      name
    )
  },
}
