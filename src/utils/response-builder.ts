import type { BuildResponseOptions } from '@ai/types'
import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
import { createContextLogger } from '@libs/pino'
import { getHttpStatus, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'

const logger = createContextLogger('ResponseBuilder')

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
  await CacheService.set(key, payload, TtlValues.HOUR)
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
  success<T>(data: ApiResponse<T>, options: ResponseOptions = {}): Response {
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
   * Build response based on AppError type
   */
  fromError(error: unknown, context: string): Response {
    // Handle AppError
    if (isAppError(error)) {
      const status = getHttpStatus(error)

      if (status >= 500) {
        logger.error(`[${context}] Server error`, {
          type: error.type,
          message: error.message,
          context: error.context,
        })
      } else {
        logger.warn(`[${context}] Client error`, {
          type: error.type,
          message: error.message,
        })
      }

      return new Response(
        JSON.stringify({
          error: error.message,
          type: error.type,
          ...(process.env.NODE_ENV === 'development' && error.context
            ? { context: error.context }
            : {}),
        }),
        {
          status,
          headers: DEFAULT_HEADERS,
        }
      )
    }

    // Unknown errors
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    logger.error(`[${context}] Unexpected error`, { error, message })

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: DEFAULT_HEADERS,
    })
  },
}
