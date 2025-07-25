import { rateLimit } from '@middlewares/rate-limit'
import { createDynamicUrlServer } from '@utils/create-dynamic-url-server'
import type { APIRoute } from 'astro'

/**
 * API endpoint for generating smart URL combinations.
 *
 * @description This endpoint generates URLs using the optimized async version of
 * createDynamicUrlServer which checks against the Redis cache of failed URL combinations.
 * This ensures that generated URLs have a higher probability of returning results.
 *
 * GET: Generates a smart URL with optional parameters
 *
 * @param {APIRoute} context - The API context containing request information
 * @returns {Promise<Response>} A Response object containing the generated URL and title
 */

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const searchParams = url.searchParams
    const limit = parseInt(searchParams.get('limit') || '6')
    const parentalControl = searchParams.get('parental_control') !== 'false'
    const maxAttempts = parseInt(searchParams.get('max_attempts') || '5')

    // Validate parameters
    if (limit < 1 || limit > 50) {
      return new Response(
        JSON.stringify({
          error: 'Invalid limit. Must be between 1 and 50.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    if (maxAttempts < 1 || maxAttempts > 10) {
      return new Response(
        JSON.stringify({
          error: 'Invalid max_attempts. Must be between 1 and 10.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Generate smart URL using the optimized server function
    const result = await createDynamicUrlServer(
      limit,
      parentalControl,
      maxAttempts
    )

    return new Response(
      JSON.stringify({
        success: true,
        url: result.url,
        title: result.title,
        parameters: {
          limit,
          parentalControl,
          maxAttempts,
        },
        info: 'URL generated using smart cache-aware algorithm',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error generating smart URL:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to generate smart URL',
        details: error instanceof Error ? error.message : 'Unknown error',
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
