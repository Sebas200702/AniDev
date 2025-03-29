import { baseUrl } from '@utils/base-url'
import type { FilterOption } from 'types'

const studios: string[] = await fetch(`${baseUrl}/api/studios`).then(
  (response) => response.json()
)

/**
 * createStudioOptions function generates filter options for anime studios.
 *
 * @description This function fetches a list of studios from the API and transforms them into
 * a standardized format for use in filter components. It creates a mapping between the original
 * studio names and their lowercase values used for filtering. The function ensures consistent
 * data structure for all studio options across the application.
 *
 * The function makes an API request to retrieve the complete list of available studios and
 * processes the response to generate option objects. Each option contains a lowercase value
 * for data operations and the original studio name for display purposes. This structure
 * supports case-insensitive filtering while maintaining proper display names.
 *
 * The resulting array is used in dropdown menus, filter panels, and search interfaces
 * throughout the application to provide users with studio filtering capabilities.
 *
 * @returns {FilterOption[]} An array of studio filter options with value and label properties
 *
 * @example
 * const options = createStudioOptions();
 * // Returns: [{ value: "mappa", label: "MAPPA" }, { value: "ufotable", label: "Ufotable" }, ...]
 */
export const studioOptions: FilterOption[] = studios.map((studio) => ({
  value: studio.toLowerCase(),
  label: studio,
}))
