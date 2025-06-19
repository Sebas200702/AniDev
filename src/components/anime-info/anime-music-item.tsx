import { navigate } from 'astro:transitions/client'
import { AddToPlayList } from '@components/icons/add-to-play-list-icon'
import { DeleteIcon } from '@components/icons/delete-icon'
import { PauseIcon } from '@components/icons/pause-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'
import type { AnimeSong, AnimeSongWithImage } from 'types'

/**
 * AnimeMusicItem component displays a music track item for an anime series.
 *
 * @description This component renders a clickable card that showcases an anime song or theme.
 * It provides a consistent and visually appealing way to display music tracks with their
 * associated metadata, including the song title, artist name, and type (Opening, Ending, or Insert).
 *
 * The component features a responsive design with hover animations and visual feedback. It includes
 * a thumbnail image that scales slightly on hover, a type indicator badge with color coding based
 * on the song type (blue for openings, purple for endings, green for inserts), and the song's
 * basic information.
 *
 * The component uses the Picture component for optimized image loading and includes an overlay
 * gradient for better text visibility. The layout adjusts based on screen size, providing
 * appropriate spacing and text sizes for both mobile and desktop views.
 *
 * @param {Props} props - The component props
 * @param {AnimeSong} props.song - The song object containing details like title, artist, and type
 * @param {string} props.image - The URL of the song's associated image (usually anime cover)
 * @param {string} props.placeholder - The URL of the placeholder image to show while loading
 * @returns {JSX.Element} A card-style element displaying the song information
 *
 * @example
 * <AnimeMusicItem
 *   song={{
 *     song_title: "Cruel Angel's Thesis",
 *     artist_name: "Yoko Takahashi",
 *     type: "opening",
 *     theme_id: "123"
 *   }}
 *   image="/path/to/image.webp"
 *   placeholder="/path/to/placeholder.webp"
 * />
 */

export const AnimeMusicItem = ({
  song,
  image,
  placeholder,
  banner_image,
  anime_title,
}: {
  song: AnimeSong
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
}) => {
  const [heights, setHeights] = useState([0, 0, 0, 0])

  const { isPlaying, currentSong, list, setList, playerRef, canPlay } =
    useMusicPlayerStore()
  const isInPlaylist = list.find(
    (songList) => songList.song_id === song.song_id
  )

  const isCurrentSong = currentSong?.song_id === song.song_id
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    isPlaying && canPlay
      ? playerRef.current?.pause()
      : playerRef.current?.play()
  }

  const handleClick = () => {
    if (isCurrentSong) return
    navigate(`/music/${normalizeString(song.song_title)}_${song.theme_id}`)
  }

  const handleAddTolist = (newSong: AnimeSongWithImage) => {
    setList([...list, newSong])
  }
  const handleClickList = () => {
    if (!isInPlaylist) {
      const newSong = {
        image,
        placeholder,
        banner_image,
        anime_title,
        ...song,
      }
      handleAddTolist(newSong)
      return
    }
    const index = list.findIndex((item) => item.song_id === song.song_id)

    handleRemoveTolist(index)
  }
  const handleRemoveTolist = (indexToDelete: number) => {
    setList([...list].filter((_, index) => index !== indexToDelete))
  }

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined

    if (isPlaying) {
      interval = setInterval(() => {
        const newHeights = Array.from(
          { length: 4 },
          () => Math.floor(Math.random() * 24) + 8
        )
        setHeights(newHeights)
      }, 150)
    } else {
      setHeights([0, 0, 0, 0])
    }

    return () => clearInterval(interval)
  }, [isPlaying])
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'opening':
      case 'op':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'ending':
      case 'ed':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'insert':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }
  return (
    <article
      onClick={() => handleClick()}
      title={song.song_title}
      className="hover:bg-Primary-900 cursor-pointer group border-enfasisColor group relative flex max-h-28 flex-row overflow-hidden rounded-lg border-l-2 bg-zinc-800 transition-colors duration-300 ease-in-out md:gap-2 items-start"
    >
      <Picture
        image={placeholder}
        styles="aspect-[225/330] w-full  overflow-hidden  relative max-w-20"
      >
        {isCurrentSong && (
          <div className="absolute inset-0 z-10 flex items-center gap-[3px] justify-center bg-Complementary/30">
            {heights.map((height, index) => (
              <div
                key={index}
                className="w-[3px] group-hover:opacity-0 bg-enfasisColor transition-all duration-150 ease-out rounded-md"
                style={{ height: `${height}px` }}
              />
            ))}

            <button
              className="absolute inset-0 opacity-0 pointer-events-none z-20 flex p-4 cursor-pointer group-hover:pointer-events-auto group-hover:opacity-90 transition-all disabled:pointer-events-none  duration-150 w-full h-full items-center justify-center mx-auto"
              onClick={(e) => handlePlay(e)}
              disabled={!canPlay}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        )}

        <img
          src={image}
          alt={song.song_title}
          className="relative aspect-[225/330] h-full w-full object-cover object-center transition-all ease-in-out group-hover:scale-105"
        />
        <Overlay className="to-Primary-950/60 h-full w-full bg-gradient-to-b from-transparent" />
      </Picture>

      {song.type && (
        <span
          className={`absolute top-2 right-2 flex-shrink-0 rounded-full border p-1 text-xs font-medium md:px-2 md:py-1 ${getTypeColor(song.type)}`}
        >
          {song.type.toUpperCase()}
        </span>
      )}

      <button
        className="absolute bottom-2 right-2 flex-shrink-0 p-2 cursor-pointer hover:bg-Primary-950 rounded-full transition-colors duration-300 z-10"
        title={`Add to playlist ${song.song_title}`}
        onClick={(e) => {
          e.stopPropagation()
          handleClickList()
        }}
      >
        {isInPlaylist ? (
          <DeleteIcon className="w-6 h-6" />
        ) : (
          <AddToPlayList className="w-6 h-6" />
        )}
      </button>
      <footer className="flex w-full max-w-[60%] flex-col gap-2 p-2 md:p-4 items-start">
        <h3 className="text-md group-hover:text-enfasisColor/80 font-bold text-pretty select-none transition-colors duration-300 ease-in-out md:text-lg">
          {song.song_title}
        </h3>
        <p className="text-xs text-gray-500 md:text-sm select-none">{song.artist_name}</p>
      </footer>
    </article>
  )
}
