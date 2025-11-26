import type { ApiResponse } from '@shared/types/api-response'
import { UserService } from '@user/services'
import type { AstroCookies } from 'astro'
import { getUserFromSession } from './utils'

export const handleSaveSearchHistory = async (
  request: Request,
  cookies: AstroCookies
): Promise<ApiResponse<any>> => {
  const userInfo = await getUserFromSession(request, cookies)
  const userId = userInfo.id as string
  const searchHistory = await request.json()
  return await UserService.saveSearchHistory(userId, searchHistory)
}

export const handleGetSearchHistory = async (
  request: Request,
  cookies: AstroCookies
): Promise<ApiResponse<any[]>> => {
  const userInfo = await getUserFromSession(request, cookies)
  const userId = userInfo.id as string
  return await UserService.getSearchHistory(userId)
}

export const handleDeleteSearchHistory = async (
  request: Request,
  cookies: AstroCookies
): Promise<ApiResponse<any>> => {
  const userInfo = await getUserFromSession(request, cookies)
  const userId = userInfo.id as string
  return await UserService.deleteSearchHistory(userId)
}
