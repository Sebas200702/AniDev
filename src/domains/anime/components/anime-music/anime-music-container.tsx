import { AnimeMusic } from '@anime/components/anime-music/anime-music'
import type { AnimeSong } from '@music/types'
import { formatSongs } from '@music/utils/format-songs'
import { useFetch } from '@shared/hooks/useFetch'
import { useEffect, useState } from 'react'

interface Props {
  animeId: number
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
}
export const AnimeMusicContainer = ({
  animeId,
  image,
  placeholder,
  banner_image,
  anime_title,
}: Props) => {
  const [songs, setSongs] = useState<AnimeSong[]>([])

  const { data, error, loading } = useFetch<AnimeSong[]>({
    url: `/api/getAnimeMusic?animeId=${animeId}`,
  })

  useEffect(() => {
    if (data) {
      const formattedSongs = formatSongs(data)
      setSongs(formattedSongs)
    }
  }, [data])

  return (
    <AnimeMusic
      songs={songs}
      loading={loading}
      image={image}
      placeholder={placeholder}
      banner_image={banner_image}
      anime_title={anime_title}
      error={error!}
    />
  )
}
