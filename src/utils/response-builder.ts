import { type BuildResponseOptions } from '@ai/types'
import { RedisCacheService } from '@shared/services/redis-cache-service'

export const buildResponse = ({
  data,
  context,
  wasRetried = false,
  quotaExhausted = false,
  fallbackUsed = null,
  jikan,
  animeForJikan,
  isFromFavorites,
  favoriteTitle,
}: BuildResponseOptions) => {
  return {
    data,
    context,
    totalRecommendations: data.length,
    wasRetried,
    quotaExhausted,
    fallbackUsed,
    jikanRecommendations: jikan?.mal_ids?.length
      ? {
          count: jikan.mal_ids.length,
          titles: jikan.titles.slice(0, 5),
          basedOn: isFromFavorites
            ? `favorite_anime_${animeForJikan}`
            : `current_anime_${animeForJikan}`,
          isFromFavorites,
          favoriteTitle: isFromFavorites ? favoriteTitle : undefined,
        }
      : null,
  }
}

export async function cacheAndRespond(key: string, payload: any, headers = {}) {
  await RedisCacheService.set(key, payload, { ttl: 21600 })
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

/**
 * Generic response utilities for API endpoints
 */

interface ResponseOptions {
  status?: number
  headers?: Record<string, string>
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

export const ResponseBuilder = {
  /**
   * Build success response
   */
  success<T>(data: T, options: ResponseOptions = {}): Response {
    const { status = 200, headers = {} } = options

    return new Response(JSON.stringify(data), {
      status,
      headers: { ...DEFAULT_HEADERS, ...headers },
    })
  },

  /**
   * Build error response
   */
  error(message: string, options: ResponseOptions = {}): Response {
    const { status = 500, headers = {} } = options

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...DEFAULT_HEADERS, ...headers },
    })
  },

  /**
   * Build validation error response (400)
   */
  validationError(message: string): Response {
    return this.error(message, { status: 400 })
  },

  /**
   * Build unauthorized error response (401)
   */
  unauthorized(message: string = 'Unauthorized'): Response {
    return this.error(message, { status: 401 })
  },

  /**
   * Build forbidden error response (403)
   */
  forbidden(message: string = 'Forbidden'): Response {
    return this.error(message, { status: 403 })
  },

  /**
   * Build not found error response (404)
   */
  notFound(message: string = 'Not found'): Response {
    return this.error(message, { status: 404 })
  },

  /**
   * Build server error response (500)
   */
  serverError(message: string = 'Internal server error'): Response {
    return this.error(message, { status: 500 })
  },

  /**
   * Build response based on error type
   */
  fromError(error: any, context: string): Response {
    console.error(`[${context}] Error:`, error)

    const message = error?.message || 'Internal server error'

    // Check for specific error types
    if (message === 'Unauthorized') {
      return this.unauthorized()
    }

    if (message.includes('Missing required')) {
      return this.validationError(message)
    }

    if (message.includes('not found') || message.includes('Not found')) {
      return this.notFound(message)
    }

    return this.serverError(message)
  },
}
