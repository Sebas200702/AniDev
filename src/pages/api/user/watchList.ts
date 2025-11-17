import { checkSession } from '@middlewares/auth'
import { UserController } from '@user/controlers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    await UserController.handleAddToWatchList(request, cookies)
    return ResponseBuilder.success({ message: 'Anime added to watch list' })
  } catch (error: any) {
    return ResponseBuilder.fromError(error, 'POST /api/watchList')
  }
})

export const DELETE: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    await UserController.handleRemoveFromWatchList(request, cookies)
    return ResponseBuilder.success({ message: 'Anime removed from watch list' })
  } catch (error: any) {
    return ResponseBuilder.fromError(error, 'DELETE /api/watchList')
  }
})

export const GET: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const data = await UserController.handleGetWatchList(request, cookies)
    return ResponseBuilder.success(data)
  } catch (error: any) {
    return ResponseBuilder.fromError(error, 'GET /api/watchList')
  }
})
