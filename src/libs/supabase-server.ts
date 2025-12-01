import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

export const createSupabaseServerClient = (context: {
  request: Request
  cookies: AstroCookies
}) => {
  return createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(
            context.request.headers.get('Cookie') ?? ''
          ).map((c) => ({
            name: c.name,
            value: c.value ?? '',
          }))
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            context.cookies.set(name, value, options)
          }
        },
      },
    }
  )
}
