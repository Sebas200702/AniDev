import { redisConnection } from '@middlewares/redis-connection'
import { formatAbout } from '@shared/utils/format-about'

import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = redisConnection(async ({ request }) => {
  try {
    const body = await request.json()
    const { about } = body

    console.log(about)

    if (!about) {
      return ResponseBuilder.validationError('Missing about parameter')
    }

    const formatted = await formatAbout(about)

    return ResponseBuilder.success({ data: formatted })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/characters/about')
  }
})
