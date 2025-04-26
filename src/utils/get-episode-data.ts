import type { AnimeEpisode } from 'types'

interface Props {
  slug: string
  episodeNumber: number
}
export const getEpisodeData = async ({ slug, episodeNumber }: Props) => {
  try {
    const response = await fetch(
      `/api/getEpisode?slug=${slug}&ep=${episodeNumber}`
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const episodeData: AnimeEpisode = await response
      .json()
      .then((data) => data.episode)

    return episodeData
  } catch (error) {
    console.error('Error fetching episode data:', error)
    return null
  }
}
