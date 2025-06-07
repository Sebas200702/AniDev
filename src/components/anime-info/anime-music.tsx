import { useEffect, useState } from 'react'
import type { AnimeSong } from 'types'
import { AnimeMusicItem } from './anime-music-item'
export const AnimeMusic = ({
  animeId,
  image,
  placeholder,
  banner_image,
  anime_title,
}: {
  animeId: number
  image: string
  placeholder: string
  anime_title: string
  banner_image?: string
}) => {
  const [songs, setSongs] = useState<AnimeSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const formatCharacters = (songs: AnimeSong[]) => {
    const songMap = new Map<string, AnimeSong>()
    songs.forEach((song) => {
      const existing = songMap.get(song.song_title)
      if (!existing) {
        songMap.set(song.song_title, song)
      }
    })
    return Array.from(songMap.values())
  }

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`/api/getAnimeMusic?animeId=${animeId}`)
        const data = await response.json()
        setSongs(formatCharacters(data))
        setLoading(false)
      } catch (error) {
        setError(error as string)
      }
    }
    fetchSongs()
  }, [])

  if (loading)
    return (
      <div className="bg-Complementary z-10 flex flex-col gap-4 rounded-lg p-4">
        <h2 className="text-2xl font-bold">Anime Music</h2>
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="bg-Primary-900 h-10 animate-pulse rounded-lg"
            />
          ))}
        </ul>
      </div>
    )
  if (error) return <div>Error: {error}</div>
  return (
    <div className="bg-Complementary z-10 flex flex-col gap-4 rounded-lg p-4">
      <h2 className="text-2xl font-bold">Anime Music</h2>
      <ul className="flex flex-col gap-4">
        {songs.map((song) => (
          <AnimeMusicItem
            key={song.song_id}
            song={song}
            image={image}
            placeholder={placeholder}
            anime_title={anime_title}
            banner_image={banner_image}
          />
        ))}
      </ul>
    </div>
  )
}
