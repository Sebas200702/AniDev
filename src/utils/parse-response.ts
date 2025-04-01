import type { ApiJsonResponse } from 'types'

/**
 * Parses a Response object into either a JSON object or a string based on the content type.
 *
 * @description This utility function handles the parsing of API responses by checking the
 * content-type header. If the response is JSON, it attempts to parse it into an ApiJsonResponse
 * object. If parsing fails, it returns an empty object. For non-JSON responses, it returns
 * the response body as a string.
 *
 * This function is essential for handling different types of API responses consistently
 * throughout the application, ensuring proper type safety and error handling.
 *
 * @param {Response} response - The Response object from a fetch request
 * @returns {Promise<ApiJsonResponse | string>} A promise that resolves to either a parsed JSON object or a string
 *
 * @example
 * const response = await fetch('/api/anime');
 * const data = await parseResponse(response);
 * // If JSON: { data: [...], status: 200 }
 * // If text: "Some text response"
 */
export const parseResponse = async (
  response: Response
): Promise<ApiJsonResponse | string> => {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    try {
      return (await response.json()) as ApiJsonResponse
    } catch (e) {
      console.error('Error parsing JSON response:', e)
      return {}
    }
  } else {
    return await response.text()
  }
}
