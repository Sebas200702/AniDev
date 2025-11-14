import { AnimeGenres, AnimeRating } from '@anime/types'

import type { FilterOption } from '@search/types'
import { studios } from 'constanst'

export const genreOptions: FilterOption[] = Object.values(AnimeGenres).map(
  (genre) => ({ value: genre.toLowerCase(), label: genre })
)

export const yearOptions: FilterOption[] = Array.from(
  { length: 71 },
  (_, i) => {
    const year = 2025 - i
    return { value: year.toString(), label: year.toString() }
  }
)
export const typeMusic: FilterOption[] = [
  { value: 'OP', label: 'Opening' },
  { value: 'ED', label: 'Ending' },
]
export const ratingOptions: FilterOption[] = [
  { value: AnimeRating.G, label: 'Everyone' },
  { value: AnimeRating.PG, label: 'Kids' },
  { value: AnimeRating.PG_13, label: 'Teens' },
  { value: AnimeRating.R, label: 'Adults' },
  { value: AnimeRating.RN, label: 'Mild Nudity' },
  { value: AnimeRating.RX, label: 'Hentai' },
]
export const typeSearchOptions: FilterOption[] = [
  { value: 'animes', label: 'Anime' },
  { value: 'music', label: 'Music' },
  { value: 'characters', label: 'Characters' },
]
export const airedDayOptions: FilterOption[] = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
]
export const languageOptions: FilterOption[] = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Hebrew', label: 'Hebrew' },
  { value: 'Hungarian', label: 'Hungarian' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Portuguese (BR)', label: 'Portuguese (BR)' },
  { value: 'Spanish', label: 'Spanish' },
]

export const statusOptions: FilterOption[] = [
  { value: 'currently airing', label: 'Airing' },
  { value: 'finished airing', label: 'Finished' },
  { value: 'not yet aired', label: 'Not Yet Aired' },
]
export const seasonOptions: FilterOption[] = [
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
]

export const formatOptions: FilterOption[] = [
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
]

export const orderByOptions: FilterOption[] = [
  { value: 'score asc', label: 'Lowest score' },
  { value: 'score', label: 'Highest Score' },
  { value: 'title asc', label: 'A-Z' },
  { value: 'title', label: 'Z-A ' },
]



export const studioOptions: FilterOption[] = studios.map((studio) => ({
  value: studio.toLowerCase(),
  label: studio,
}))
