export function parseCookies(req: Request): Record<string, string> {
  return Object.fromEntries(
    req.headers
      .get('cookie')
      ?.split(';')
      .map((c) => c.trim().split('=')) ?? []
  )
}
