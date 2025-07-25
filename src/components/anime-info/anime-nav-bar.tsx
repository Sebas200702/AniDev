import { SectionList } from '@components/common/section-list'
import { useAnimeListsStore } from '@store/anime-list-store'

/**
 * AnimeNavBar component renders a navigation bar for anime details.
 *
 * @description This component provides a horizontal navigation interface for browsing different
 * sections of anime details. It retrieves the navigation sections from the anime lists store
 * and renders them as interactive list items. The navigation bar is designed to be responsive,
 * adjusting its layout based on screen size.
 *
 * The component uses the useAnimeListsStore hook to access the current list of sections and
 * the function to update them. Each section is rendered as a SectionList component, which
 * handles the individual section's display and interaction logic. The navigation maintains
 * consistent styling and spacing to create a cohesive user interface.
 *
 * The UI presents the sections in a horizontal row with appropriate spacing and alignment.
 * Each section can be selected to display its corresponding content in the anime details page.
 * The component does not require any props as it retrieves all necessary data from the global store.
 *
 * @returns {JSX.Element} The rendered navigation bar with interactive section links
 *
 * @example
 * <AnimeNavBar />
 */
export const AnimeNavBar = () => {
  const { animeList, setAnimeList } = useAnimeListsStore()
  return (
    <nav className="z-10 flex w-full flex-row items-center justify-between md:mt-0">
      <ul className="text-m flex flex-row">
        {animeList.map((section) => (
          <SectionList
            key={section.label}
            section={section}
            sections={{ list: animeList, set: setAnimeList }}
          />
        ))}
      </ul>
    </nav>
  )
}
