import { SectionList } from '@components/section-list'
import { useAnimeListsStore } from '@store/anime-list-store'

/**
 * AnimeNavBar component renders a navigation bar for anime details.
 *
 * This component does not take any props and is used as a visual representation.
 */
export const AnimeNavBar = () => {
  const { animeList, setAnimeList } = useAnimeListsStore()
  return (
    <nav className="flex flex-row items-center justify-between md:mt-0">
      <ul className="flex flex-row">
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
