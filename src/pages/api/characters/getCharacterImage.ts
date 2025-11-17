import type { APIRoute } from 'astro'
import { CharacterController } from '@character/controlers'
import { ResponseBuilder } from '@utils/response-builder'

export const GET: APIRoute = async ({ url }) => {
  try {
    const data = await CharacterController.handleGetCharacterImages(url)
    return ResponseBuilder.success({ data })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/characters/getCharacterImage')
  }
}
