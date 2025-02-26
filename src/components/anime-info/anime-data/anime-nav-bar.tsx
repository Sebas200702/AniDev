import { SectionList } from '@components/section-list'
import { useAnimeListsStore } from '@store/anime-list-store'

export const AnimeNavBar = () => {
  const { animeList, setAnimeList } = useAnimeListsStore()
  return (
    <nav className="mt-16 flex w-full flex-row items-center justify-between md:mt-0">
      <ul className="flex flex-row py-4 md:p-4">
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
