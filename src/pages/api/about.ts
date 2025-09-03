import { safeRedisOperation } from '@libs/redis'
import { redisConnection } from '@middlewares/redis-connection'
import { formatAbout } from '@utils/format-about'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const about = url.searchParams.get('about')
    const cacheKey = `about:${url.searchParams}`
    const cached = await safeRedisOperation((client) => client.get(cacheKey))
    if (cached) {
      return new Response(JSON.stringify(JSON.parse(cached)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    if (!about) {
      return new Response(
        JSON.stringify({ error: 'Missing about parameter.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    const aboutFormatted = await formatAbout(about)

    await safeRedisOperation((client) =>
      client.set(cacheKey, JSON.stringify(aboutFormatted), { EX: 24 * 60 * 60 })
    )
    return new Response(JSON.stringify(aboutFormatted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to format about.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
