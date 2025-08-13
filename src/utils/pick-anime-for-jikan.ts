import { getFavoriteAnimeIds } from '@utils/get-favorite-anime-ids'
import { type UserProfile } from 'types'

export async function pickAnimeForJikan(userProfile: UserProfile) {
  if (!userProfile.favorite_animes?.length) return {}
  const favs = await getFavoriteAnimeIds(userProfile.favorite_animes)
  if (favs.error || !favs.mal_ids.length) return {}

  const idx = Math.floor(Math.random() * favs.mal_ids.length)
  return {
    animeForJikan: favs.mal_ids[idx].toString(),
    isFromFavorites: true,
    selectedFavoriteTitle: favs.matchedTitles[idx],
  }
}
