import { AnimeEpisodes } from '@components/watch-anime/episodes/anime-episodes'
import { getAnimeData } from '@utils/get-anime-data'
import { useEffect, useState } from 'react'
import type { Anime } from 'types'

interface Props {
  slug: string
}

export const WatchAnime = ({ slug }: Props) => {
  const [animeData, setAnimeData] = useState<Anime>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAnimeData(slug)
      if (!data) return
      setAnimeData(data)
    }
    fetchData()
  }, [])
  if (!animeData) return
  return (
    <section className=" ">
      <AnimeEpisodes
        mal_id={animeData?.mal_id}
        totalEpisodes={animeData.episodes}
        image_webp={animeData.image_webp}
        slug={slug}
        duration={animeData.duration}
      />
    </section>
  )
}
