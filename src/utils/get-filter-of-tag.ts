import { AnimeFilters } from 'types'
export const getFilterOfTag = (tag: string) => {
  if (tag === 'Anime') return AnimeFilters.Type
  if (tag === 'Special') return AnimeFilters.Type
  if (tag === 'OVA') return AnimeFilters.Type
  if (tag === 'ONA') return AnimeFilters.Type
  if (tag === 'Movie') return AnimeFilters.Type
  if (tag === 'Music') return AnimeFilters.Type
  return AnimeFilters.Genre
}
