import { AnimeController } from '@anime/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const id = url.searchParams.get('id')
      const cacheKey = CacheUtils.generateKey('anime-metadatas', id ?? '')

      const metadata = await CacheUtils.withCache(
        cacheKey,
        () => AnimeController.handleGetAnimeMetadata(url),
        { ttl: CacheTTL.ONE_DAY }
      )

      return ResponseBuilder.success(metadata)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/animes/getAnimeMetadatas')
    }
  })
)
