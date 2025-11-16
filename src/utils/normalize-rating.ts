import { AnimeRating, NormalizedRating } from '@anime/types'

export const normalizeRating = (rating: string): string => {
  const lowerRating = rating.toLowerCase()

  if (lowerRating === AnimeRating.G) return NormalizedRating.G
  if (lowerRating === AnimeRating.PG) return NormalizedRating.PG
  if (lowerRating === AnimeRating.PG_13) return NormalizedRating.PG_13
  if (lowerRating === AnimeRating.R) return NormalizedRating.R
  if (lowerRating === AnimeRating.RN) return NormalizedRating.RN
  if (lowerRating === AnimeRating.RX) return NormalizedRating.RX

  return NormalizedRating.G
}
