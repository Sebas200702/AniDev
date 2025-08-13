import { fetchRecomendations } from '@utils/fetch-recomendations'
import { type CreateJikanFallbackFn } from 'types'

export const createJikanFallback: CreateJikanFallbackFn = async (
  jikan,
  count,
  animeId,
  parentalControl
) => {
  if (!jikan?.mal_ids?.length)
    return fetchRecomendations([], count, animeId, null, parentalControl)

  const ids = jikan.mal_ids.map(String)
  const primary = await fetchRecomendations(
    ids,
    count,
    animeId,
    jikan,
    parentalControl
  )

  if (primary.length >= count * 0.8) return primary

  const secondary = await fetchRecomendations(
    [],
    count,
    animeId,
    jikan,
    parentalControl
  )
  const existing = new Set(primary.map((a) => a.mal_id))
  return [
    ...primary,
    ...secondary.filter((a) => !existing.has(a.mal_id)),
  ].slice(0, count)
}
