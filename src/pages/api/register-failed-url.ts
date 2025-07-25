import { addFailedUrl } from '@utils/failed-urls-cache'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * API endpoint for registering failed URL combinations.
 *
 * @description This endpoint allows frontend components to register URL combinations
 * that have resulted in 404 errors or other failures. The URLs are stored in Redis
 * cache to prevent the system from generating the same failing combinations in the future.
 *
 * POST: Registers a failed URL in the cache
 *
 * @param {APIRoute} context - The API context containing request information
 * @returns {Promise<Response>} A Response object confirming registration or error
 */

export const POST: APIRoute = rateLimit(async ({ request }) => {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid request. URL is required and must be a string.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Register the failed URL in Redis
    await addFailedUrl(url)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Failed URL registered successfully',
        url: url
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error registering failed URL:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to register URL in cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
