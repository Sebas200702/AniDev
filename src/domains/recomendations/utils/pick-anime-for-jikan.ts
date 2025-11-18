import type { UserProfile } from '@user/types'
import { getFavoriteAnimeIds } from '@utils/get-favorite-anime-ids'

export async function pickAnimeForJikan(userProfile: UserProfile) {
  if (!userProfile.favorite_animes?.length) return {}
  const favs = await getFavoriteAnimeIds(userProfile.favorite_animes)
  if (favs.error || !favs.mal_ids.length) return {}

  const idx = Math.floor(Math.random() * favs.mal_ids.length)
  return {
    selectedFavoriteTitle: favs.matchedTitles[idx],
    selectedFavoriteId: favs.mal_ids[idx],
  }
}
