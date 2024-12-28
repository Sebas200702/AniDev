import { baseUrl } from '@utils/base-url'
import type { FilterOption } from 'types'
const studios: string[] = await fetch(`${baseUrl}/api/studios`).then(
  (response) => response.json()
)

export const studioOptions: FilterOption[] = studios.map((studio) => ({
  value: studio.toLowerCase(),
  label: studio,
}))
