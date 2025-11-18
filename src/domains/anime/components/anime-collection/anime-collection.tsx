import type { AnimeCollectionInfo } from '@anime/types'

import { Picture } from '@shared/components/media/picture'

import { normalizeString } from '@utils/normalize-string'

interface Props {
  animes: AnimeCollectionInfo[]
  title: string
  id: number
}
export const AnimeCollection = ({ animes, title, id }: Props) => {
  const style1 =
    'rotate-[-10deg] translate-x-10 translate-y-[35%] md:hover:translate-y-[20%] transition-transform duration-300 ease-in-out'
  const style2 =
    'z-10  translate-y-[40%] md:hover:translate-y-[25%] transition-transform duration-300 ease-in-out'
  const style3 =
    'z-20 -translate-x-10 translate-y-1/2 rotate-[10deg] md:hover:translate-y-[35%] transition-transform duration-300 ease-in-out'

  const getPosition = (i: number) => {
    if (i === 0) return style1
    if (i === 1) return style2
    return style3
  }

  return (
    <li className="bg-Complementary mx-auto flex h-54 w-full flex-col overflow-hidden rounded-lg transition-all duration-300 ease-in-out md:p-4 md:hover:scale-[1.03]">
      <a href={`/collection/${normalizeString(title)}_${id}`}>
        <h4 className="text-l mx-auto h-12 max-w-80 p-4 text-center font-bold text-balance text-white">
          {title || 'Sin Título'}
        </h4>

        <ul className="mx-auto -mt-4 flex h-full w-full flex-row justify-center">
          {animes.slice(0, 3).map((anime, i) => (
            <Picture
              key={anime.mal_id}
              image={anime.image_webp || ''}
              placeholder={anime.image_small_webp || ''}
              styles={`${getPosition(i)} w-full rounded-md relative aspect-[225/330] h-auto max-w-44 rounded-md object-cover object-center`}
              alt={anime.title}
            />
          ))}
        </ul>
      </a>
    </li>
  )
}
