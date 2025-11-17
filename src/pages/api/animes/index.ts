import { AnimeService } from '@anime/services'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { Filters } from '@shared/types'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { getFilters } from '@utils/get-filters-of-search-params'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = CacheUtils.generateKey(
        'animes-partial',
        url.searchParams
      )

      const format = url.searchParams.get('format') ?? 'anime-card'
      const limit = Number.parseInt(url.searchParams.get('limit_count') ?? '10')
      const page = Number.parseInt(url.searchParams.get('page_number') ?? '1')

      const CountFilters = Object.keys(Filters).filter(
        (key) =>
          key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
      )

      const filters = getFilters(Object.values(Filters), url, true)
      const countFilters = getFilters(CountFilters, url, false)

      const result = await CacheUtils.withCache(
        cacheKey,
        async () => {
          const { data, total } = await AnimeService.searchAnime({
            format,
            filters,
            countFilters,
          })

          if (!data || data.length === 0) {
            throw new Error('No se encontraron animes.')
          }

          return {
            total_items: total,
            data,
            current_page: page,
            last_page: Math.ceil(total / limit),
          }
        },
        { ttl: CacheTTL.ONE_HOUR * 2 }
      )

      return ResponseBuilder.success(result)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/animes')
    }
  })
)
