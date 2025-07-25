import { getFailedUrlsCount, clearFailedUrls } from '@utils/failed-urls-cache'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * API endpoint for monitoring failed URL statistics and management.
 *
 * @description This endpoint provides information about failed URL combinations
 * that have been cached in Redis. It supports both GET requests to retrieve
 * statistics and DELETE requests to clear the cache.
 *
 * GET: Returns the count of failed URLs currently cached
 * DELETE: Clears all failed URLs from the cache
 *
 * @param {APIRoute} context - The API context containing request information
 * @returns {Promise<Response>} A Response object containing statistics or confirmation
 */

export const GET: APIRoute = rateLimit(async () => {
  try {
    const count = await getFailedUrlsCount()

    return new Response(
      JSON.stringify({
        failedUrlsCount: count,
        message: `Currently tracking ${count} failed URL combinations`,
        cacheInfo: {
          ttl: '30 days',
          purpose: 'Avoid regenerating known failing URL combinations'
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching failed URLs stats:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve statistics' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

export const DELETE: APIRoute = rateLimit(async () => {
  try {
    await clearFailedUrls()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Failed URLs cache has been cleared successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error clearing failed URLs cache:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to clear cache' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
