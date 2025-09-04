import type { AnimeSongWithImage } from 'types'

interface Props {
  song: AnimeSongWithImage
}
export const Song = ({ song }: Props) => {
  return (
    <li className="flex items-center gap-4 rounded-md bg-Primary-800 p-2 pr-4">
      <img
        src={song.image}
        alt={song.title}
        className="aspect-square w-16 rounded-md object-cover"
      />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-white">{song.title}</h3>
        <p className="text-sm text-gray-400">
          {song.anime} | {song.type}
        </p>
      </div>
    </li>
  )
}
