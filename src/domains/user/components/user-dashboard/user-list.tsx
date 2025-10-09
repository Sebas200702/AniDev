import { AnimeCard } from '@anime/components/anime-card/anime-card'
import { LoadingCard } from '@search/components/search-results/loading-card'
import { SectionList } from '@shared/components/buttons/section-list'
import { UserListOptions } from '@user/components/user-dashboard/user-list-options'
import { useUserListsStore } from '@user/stores/user-list-store'
import { useGlobalUserPreferences } from '@user/stores/user-store'

export const UserList = () => {
  const { userList: sections, setUserList, isLoading } = useUserListsStore()
  const { userInfo, watchList } = useGlobalUserPreferences()
  const currentSection = sections.find((section) => section.selected)

  const filteredAnimes =
    currentSection && watchList
      ? watchList.filter((watch) => watch.type === currentSection.label)
      : []

  const ListLayout = ({ children }: { children: React.ReactNode }) => (
    <section className="flex flex-col gap-4">
      <nav className="flex w-full flex-row items-center justify-between">
        <ul className="text-m flex flex-row">
          {sections.map((section) => (
            <SectionList
              key={section.label}
              section={section}
              sections={{ list: sections, set: setUserList }}
            />
          ))}
        </ul>
        <UserListOptions />
      </nav>
      <ul className="grid grid-cols-2 gap-6 p-4 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-6">
        {children}
      </ul>
    </section>
  )

  const EmptyState = ({
    message,
    showButton = false,
  }: { message: string; showButton?: boolean }) => (
    <div className="col-span-6 mt-20 flex flex-col items-center justify-center gap-4">
      <p className="text-l">{message}</p>
      {showButton && (
        <a href="/signin" className="button-primary px-4 py-2">
          Sign in
        </a>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <ListLayout>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </ListLayout>
    )
  }

  if (!userInfo?.name) {
    return (
      <ListLayout>
        <EmptyState message="Log in to see your lists" showButton />
      </ListLayout>
    )
  }

  if (filteredAnimes.length === 0 || isLoading) {
    return (
      <ListLayout>
        <EmptyState message="No have animes in your list" />
      </ListLayout>
    )
  }

  return (
    <ListLayout>
      {filteredAnimes.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </ListLayout>
  )
}
