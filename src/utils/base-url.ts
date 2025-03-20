/**
 * baseUrl is the base URL for the application, determined by the environment.
 *
 * @constant {string} baseUrl - The base URL for API requests.
 * @constant {string} baseTitle - The default title for the application.
 */
export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://ani-dev.vercel.app'
    : 'http://localhost:4321'

export const baseTitle = 'AniDev - Watch anime online free'
