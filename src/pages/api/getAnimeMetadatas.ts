import { CacheTTL, CacheUtils } from '@utils/cache-utils'

import type { APIRoute } from 'astro'
import { MetadataService } from '@shared/services/metadata-service'
import { ResponseBuilder } from '@utils/response-builder'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const id = url.searchParams.get('id')

      if (!id) {
        return ResponseBuilder.notFound('Anime ID not provided')
      }

      const animeId = Number(id)
      if (Number.isNaN(animeId)) {
        return ResponseBuilder.validationError('Invalid anime ID')
      }

      const cacheKey = CacheUtils.generateKey('anime-metadatas', id)
      const metadata = await CacheUtils.withCache(
        cacheKey,
        () => MetadataService.getAnimeMetadata(animeId),
        { ttl: CacheTTL.ONE_DAY }
      )

      return ResponseBuilder.success(metadata)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/getAnimeMetadatas')
    }
  })
)
