import { redisConnection } from '@middlewares/redis-connection'
import { formatAbout } from '@shared/utils/format-about'

import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const about = url.searchParams.get('about')

    if (!about) {
      return ResponseBuilder.validationError('Missing about parameter')
    }

    const formatted = await formatAbout(about)

    return ResponseBuilder.success(formatted)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/about')
  }
})
