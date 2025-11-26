import { CharacterController } from '@character/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  try {
    const data = await CharacterController.handleGetCharacterImages(url)
    return ResponseBuilder.success({ data })
  } catch (error) {
    return ResponseBuilder.fromError(
      error,
      'GET /api/characters/getCharacterImage'
    )
  }
}
