import { CharacterController } from '@character/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const slug = url.searchParams.get('slug')
    const cacheKey = CacheUtils.generateKey('character', slug ?? '')

    const character = await CacheUtils.withCache(
      cacheKey,
      () => CharacterController.handleGetCharacter(url),
      { ttl: CacheTTL.ONE_HOUR }
    )

    return ResponseBuilder.success({ character })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/characters/getCharacter')
  }
})
