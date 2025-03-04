import { SectionList } from '@components/section-list'
import { useAnimeListsStore } from '@store/anime-list-store'

export const AnimeNavBar = () => {
  const { animeList, setAnimeList } = useAnimeListsStore()
  return (
    <nav className=" flex  flex-row items-center justify-between xl:col-span-2  md:mt-0">
      <ul className="flex flex-row ">
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
