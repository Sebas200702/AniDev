import { checkSession } from '@middlewares/auth'
import { UserController } from '@user/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    await UserController.handleSaveSearchHistory(request, cookies)
    return ResponseBuilder.success({ data: { message: 'Search history saved' } })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/user/searchHistory')
  }
})

export const GET: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const data = await UserController.handleGetSearchHistory(request, cookies)
    return ResponseBuilder.success(data)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/user/searchHistory')
  }
})

export const DELETE: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    await UserController.handleDeleteSearchHistory(request, cookies)
    return ResponseBuilder.success({ data: { message: 'Search history deleted' } })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'DELETE /api/searchHistory')
  }
})
