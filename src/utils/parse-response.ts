import type { ApiJsonResponse } from 'types'
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
