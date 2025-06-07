import { navigate } from 'astro:transitions/client'
import { RandomIcon } from '@components/icons/random-icon'
import { useGlobalUserPreferences } from '@store/global-user'
import { normalizeString } from '@utils/normalize-string'

/**
 * RandomAnimeButton component provides a button to navigate to a random anime.
 *
 * @description This component renders a button that, when clicked, fetches a random anime from the API
 * and navigates to its detail page. The button features a clean design with a random icon and includes
 * hover effects for better user interaction feedback.
 *
 * The component integrates with the Astro client-side navigation system to provide smooth transitions
 * between pages. When clicked, it makes an API call to fetch a random anime and then navigates to
 * the corresponding anime detail page using the normalized title and MAL ID.
 *
 * The random icon is implemented as a custom SVG component, ensuring consistent styling with the
 * application's design system. The button includes proper cursor styling and hover effects to
 * indicate its interactive nature, along with a title attribute for accessibility.
 *
 * @returns {JSX.Element} The rendered random anime button with icon and hover effects
 *
 * @example
 * <RandomAnimeButton />
 */
export const RandomAnimeButton = () => {
  const { parentalControl } = useGlobalUserPreferences()
  const handleClick = async () => {
    const result = await fetch(
      `/api/animes/random?parental_control=${parentalControl}`
    ).then((res) => res.json())

    navigate(`/anime/${normalizeString(result.title)}_${result.mal_id}`)
  }
  return (
    <button
      onClick={handleClick}
      title="Random Anime"
      className="group hover:text-enfasisColor flex cursor-pointer items-center rounded-lg p-2 transition-all duration-300"
    >
      <RandomIcon className="h-6 w-6" />
    </button>
  )
}
