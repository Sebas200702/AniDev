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
    const uniqueSongs = Array.from(songMap.values())

    return uniqueSongs.sort((a, b) => {
      if (a.type.startsWith('OP') && !b.type.startsWith('OP')) {
        return -1
      }
      if (!a.type.startsWith('OP') && b.type.startsWith('OP')) {
        return 1
      }
      if (a.sequence && b.sequence) {
        return a.sequence - b.sequence
      }
      return 0
    })
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
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-zinc-700 h-28 animate-pulse rounded-lg"
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
        {songs.length === 0 && !loading && (
          <div className="text-center text-2xl font-bold">No music found</div>
        )}
        {songs.map((song) => (
          <AnimeMusicItem
            key={song.song_id}
            song={song}
            image={image}
            placeholder={placeholder}
          />
        ))}
      </ul>
    </div>
  )
}
