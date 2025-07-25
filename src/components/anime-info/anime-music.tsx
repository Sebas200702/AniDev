import { useEffect, useState } from 'react'
import type { AnimeSong } from 'types'
import { AnimeMusicItem } from '../music/anime-music-item'

/**
 * AnimeMusic component displays a list of music tracks associated with an anime.
 *
 * @description This component fetches and displays all music tracks (openings, endings, and inserts)
 * for a specific anime. It includes loading states, error handling, and empty state management.
 * The component organizes the songs in a specific order, prioritizing openings first and then
 * sorting by sequence number when available.
 *
 * Key features:
 * - Automatic fetching of music data based on anime ID
 * - Deduplication of songs with the same title
 * - Prioritized sorting (OPs first, then by sequence)
 * - Loading skeleton animation during data fetching
 * - Error state handling and display
 * - Empty state handling when no music is found
 * - Responsive layout with consistent spacing
 *
 * The component uses a Map to ensure unique songs and implements a custom sorting algorithm
 * to display songs in a logical order that matches typical anime episode progression
 * (openings first, followed by other types).
 *
 * @param {Props} props - The component props
 * @param {number} props.animeId - The unique identifier of the anime to fetch music for
 * @param {string} props.image - The URL of the anime's cover image to display with each track
 * @param {string} props.placeholder - The URL of the placeholder image to show while loading
 * @returns {JSX.Element} A section containing a list of music tracks or appropriate loading/error states
 *
 * @example
 * <AnimeMusic
 *   animeId={1234}
 *   image="/path/to/anime-cover.webp"
 *   placeholder="/path/to/placeholder.webp"
 * />
 */
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
  banner_image: string
  anime_title: string
}) => {
  const [songs, setSongs] = useState<AnimeSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const formatSongs = (songs: AnimeSong[]) => {
    const songMap = new Map<string, AnimeSong>()
    songs.forEach((song) => {
      const existing = songMap.get(`${song.song_title}_${song.theme_id}`)
      if (!existing) {
        songMap.set(`${song.song_title}_${song.theme_id}`, song)
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
        setSongs(formatSongs(data))
        setLoading(false)
      } catch (error) {
        setError(error as string)
      }
    }
    fetchSongs()
  }, [])

  if (loading)
    return (
      <div className="z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
        <h2 className="text-lxx font-bold">Anime Music</h2>
        <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i + 1}
              className="mx-auto flex aspect-[100/30] h-full w-full animate-pulse flex-row rounded-lg bg-zinc-800 md:max-h-36"
            >
              <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
            </div>
          ))}
        </ul>
      </div>
    )
  if (error) return <div>Error: {error}</div>
  return (
    <div className="z-10 flex h-full flex-col gap-8 rounded-lg p-4 md:p-6">
      <h2 className="text-lxx font-bold">Anime Music</h2>

      {songs.length === 0 && !loading && (
        <div className="text-l text-Primary-200 flex h-full items-center justify-center">
          {' '}
          No music found{' '}
        </div>
      )}
      {
        <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          {songs.map((song) => (
            <AnimeMusicItem
              key={song.song_id}
              song={song}
              image={image}
              placeholder={placeholder}
              banner_image={banner_image}
              anime_title={anime_title}
            />
          ))}
        </ul>
      }
    </div>
  )
}
