import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeSong } from 'types'

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
  anime_title: string
  banner_image?: string
}) => {
  const { setCurrentSong, setIsPlaying } = useMusicPlayerStore()
  const handleClick = () => {
    setCurrentSong({
      ...song,
      image: banner_image ? banner_image : image,
      placeholder,
      anime_title,
    })
    setIsPlaying(true)
  }
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
    <a
      href={`/music/${normalizeString(song.song_title)}`}
      onClick={handleClick}
      className="hover:bg-Primary-900 border-enfasisColor relative flex max-h-28 flex-row gap-2 overflow-hidden rounded-lg border-l-2 bg-zinc-800 transition-all duration-300"
    >
      <Picture
        image={placeholder}
        styles="aspect-[225/330]  relative overflow-hidden"
      >
        <img
          src={image}
          alt={song.song_title}
          className="relative h-full w-full object-cover"
        />
        <Overlay className="to-Primary-950/60 h-full w-full bg-gradient-to-b from-transparent" />
      </Picture>

      {song.type && (
        <span
          className={`absolute top-2 right-2 flex-shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${getTypeColor(song.type)}`}
        >
          {song.type.toUpperCase()}
        </span>
      )}
      <footer className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-bold">{song.song_title}</h3>
        <p className="text-sm text-gray-500">{song.artist_name}</p>
      </footer>
    </a>
  )
}
