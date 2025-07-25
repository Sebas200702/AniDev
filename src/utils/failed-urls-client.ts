/**
 * Client-side utility for managing failed URL combinations.
 *
 * @description This module provides functions to register failed URLs through
 * API calls instead of direct Redis operations. This is safe to use in frontend
 * components as it doesn't rely on Node.js specific modules like Buffer or Redis.
 */

/**
 * Registers a failed URL through the API endpoint.
 * This function is safe to use in frontend components.
 *
 * @param {string} url - The URL query string that failed
 * @returns {Promise<void>}
 */
export const addFailedUrlClient = async (url: string): Promise<void> => {
  try {
    // Skip empty URLs
    if (!url || typeof url !== 'string') return

    const response = await fetch('/api/register-failed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      // Don't throw errors for failed registration to avoid breaking the main flow
      console.warn(`Failed to register failed URL: ${response.status}`)
    }
  } catch (error) {
    // Silently handle errors to not break the main application flow
    console.warn('Failed to register failed URL:', error)
  }
}

/**
 * Checks if a URL combination might be a failed one by making an API call.
 * Note: This is an expensive operation, so it's not used in the normal flow.
 * The main prevention happens at the URL generation level on the server.
 *
 * @param {string} url - The URL query string to check
 * @returns {Promise<boolean>} True if the URL might be failed (defaults to false on errors)
 */
export const isFailedUrlClient = async (url: string): Promise<boolean> => {
  try {
    if (!url || typeof url !== 'string') return false

    const response = await fetch(`/api/failed-urls-stats`)

    if (!response.ok) {
      return false
    }

    // For simplicity, we'll rely on server-side checking during URL generation
    // This function is kept for potential future use
    return false
  } catch (error) {
    console.warn('Failed to check failed URL status:', error)
    return false
  }
}
