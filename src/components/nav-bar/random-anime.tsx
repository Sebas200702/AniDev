import { navigate } from 'astro:transitions/client'
import { RandomIcon } from '@components/icons/random-icon'
import { normalizeString } from '@utils/normalize-string'

export const RandomAnimeButton = () => {
  const handleClick = async () => {
    const result = await fetch('/api/animes/random').then((res) => res.json())

    navigate(`/anime/${normalizeString(result.title)}_${result.mal_id}`)
  }
  return (
    <button
      onClick={handleClick}
      title="Random Anime"
      className="hover:text-enfasisColor transition-all duration-300 px-2 py-4 cursor-pointer"
    >
      <RandomIcon className="w-6 h-6" />
    </button>
  )
}
