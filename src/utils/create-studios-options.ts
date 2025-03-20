import { baseUrl } from '@utils/base-url'

import type { FilterOption } from 'types'
const studios: string[] = await fetch(`${baseUrl}/api/studios`).then(
  (response) => response.json()
)

/**
 * studioOptions is an array of filter options for studios fetched from the API.
 *
 * Each option contains a value and a label for display.
 *
 * @returns {Promise<FilterOption[]>} An array of studio filter options.
 */
export const studioOptions: FilterOption[] = studios.map((studio) => ({
  value: studio.toLowerCase(),
  label: studio,
}))
