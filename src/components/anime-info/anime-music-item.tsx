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

// Componente para el icono de drag handle
const DragIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="12" r="1"/>
    <circle cx="9" cy="5" r="1"/>
    <circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="12" r="1"/>
    <circle cx="15" cy="5" r="1"/>
    <circle cx="15" cy="19" r="1"/>
  </svg>
)

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
  showDragHandle?: boolean
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
      className="hover:bg-Primary-900 group border-enfasisColor group relative flex max-h-28 cursor-pointer flex-row items-start overflow-hidden rounded-lg border-l-2 bg-zinc-800 transition-colors duration-300 ease-in-out md:gap-2"
    >
      <Picture
        image={placeholder}
        styles="aspect-[225/330] w-full  overflow-hidden  relative max-w-20"
      >
        {isCurrentSong && (
          <div className="bg-Complementary/30 absolute inset-0 z-10 flex items-center justify-center gap-[3px]">
            {heights.map((height, index) => (
              <div
                key={index}
                className="bg-enfasisColor w-[3px] rounded-md transition-all duration-150 ease-out group-hover:opacity-0"
                style={{ height: `${height}px` }}
              />
            ))}

            <button
              className="pointer-events-none absolute inset-0 z-20 mx-auto flex h-full w-full cursor-pointer items-center justify-center p-4 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-90 disabled:pointer-events-none"
              onClick={(e) => handlePlay(e)}
              disabled={!canPlay}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
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
        className="hover:bg-Primary-950 absolute right-2 bottom-2 z-10 flex-shrink-0 cursor-pointer rounded-full p-2 transition-colors duration-300"
        title={`${isInPlaylist ? 'Remove' : 'Add'} to playlist ${song.song_title}`}
        onClick={(e) => {
          e.stopPropagation()
          handleClickList()
        }}
      >
        {isInPlaylist ? (
          <DeleteIcon className="h-6 w-6" />
        ) : (
          <AddToPlayList className="h-6 w-6" />
        )}
      </button>
      <footer className="flex w-full max-w-[60%] flex-col items-start gap-2 p-2 md:p-4">
        <h3 className="text-md group-hover:text-enfasisColor/80 font-bold text-pretty transition-colors duration-300 ease-in-out select-none md:text-lg">
          {song.song_title}
        </h3>
        <p className="text-xs text-gray-500 select-none md:text-sm">
          {song.artist_name}
        </p>
      </footer>
    </article>
  )
}
