import type { Anime } from 'types'

export const getAnimeData = async (
  slug: string
): Promise<Anime | undefined> => {
  try {
    const response = await fetch(`/api/getAnime?slug=${slug}`, {
      cache: 'force-cache',
    })

    if (response.status === 404) {
      window.location.href = '/404'
    }

    const animeData = await response.json().then((data) => data.anime)

    return animeData
  } catch (error) {
    console.log(error)
    return
  }
}
