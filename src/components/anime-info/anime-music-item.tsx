import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeSong } from 'types'

export const AnimeMusicItem = ({
  song,
  image,
  placeholder,
}: {
  song: AnimeSong
  image: string
  placeholder: string
}) => {
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
      href={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
      title={song.song_title}
      className="hover:bg-Primary-900 border-enfasisColor relative group flex max-h-28 flex-row md:gap-2 overflow-hidden rounded-lg border-l-2 bg-zinc-800 transition-colors duration-300 ease-in-out"
    >
      <Picture
        image={placeholder}
        styles="aspect-[225/330] w-full  overflow-hidden  relative max-w-20"
      >
        <img
          src={image}
          alt={song.song_title}
          className="relative aspect-[225/330] h-full w-full  object-cover object-center transition-all ease-in-out group-hover:scale-105"
        />
        <Overlay className="to-Primary-950/60 h-full w-full bg-gradient-to-b from-transparent" />
      </Picture>

      {song.type && (
        <span
          className={`absolute top-2 right-2 flex-shrink-0 rounded-full border md:px-2 md:py-1 p-1 text-xs font-medium ${getTypeColor(song.type)}`}
        >
          {song.type.toUpperCase()}
        </span>
      )}
      <footer className="flex flex-col gap-2 md:p-4 p-2 max-w-[60%] w-full">
        <h3 className="md:text-lg text-md font-bold text-pretty  group-hover:text-enfasisColor/80 transition-colors duration-300 ease-in-out">
          {song.song_title}
        </h3>
        <p className="md:text-sm text-xs text-gray-500">{song.artist_name}</p>
      </footer>
    </a>
  )
}
