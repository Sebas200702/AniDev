import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { UserService } from '@user/services'
import type { AstroCookies } from 'astro'
import { getUserFromSession } from './utils'

export const handleAddToWatchList = async (
  request: Request,
  cookies: AstroCookies
): Promise<ApiResponse<any>> => {
  const userInfo = await getUserFromSession(request, cookies)
  const userId = userInfo.id
  const body = await request.json()
  const { animeId, type } = body

  if (!animeId || !type || !userId) {
    throw AppError.validation('Missing required fields: animeId and type')
  }

  return await UserService.addToWatchList(userId, animeId, type)
}

export const handleRemoveFromWatchList = async (
  request: Request,
  cookies: AstroCookies
): Promise<ApiResponse<any>> => {
  const userInfo = await getUserFromSession(request, cookies)
  const userId = userInfo.id
  const body = await request.json()
  const { animeId } = body

  if (!animeId || !userId) {
    throw AppError.validation('Missing required field: animeId')
  }

  return await UserService.removeFromWatchList(userId, animeId)
}

export const handleGetWatchList = async (
  request: Request,
  cookies: AstroCookies
): Promise<ApiResponse<any[]>> => {
  const userInfo = await getUserFromSession(request, cookies)
  const userId = userInfo.id as string

  return await UserService.getWatchList(userId)
}
