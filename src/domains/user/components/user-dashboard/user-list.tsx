import { AnimeCard } from '@anime/components/anime-card/anime-card'
import { EmptyState } from '@user/components/user-dashboard/empty-state'
import { ListLayout } from '@user/components/user-dashboard/list-layout'
import { LoadingState } from '@user/components/user-dashboard/loading-state'
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

  if (isLoading) {
    return <LoadingState sections={sections} setUserList={setUserList} />
  }

  if (!userInfo?.name) {
    return (
      <ListLayout sections={sections} setUserList={setUserList}>
        <EmptyState message="Log in to see your lists" showButton />
      </ListLayout>
    )
  }

  if (filteredAnimes.length === 0) {
    return (
      <ListLayout sections={sections} setUserList={setUserList}>
        <EmptyState message="You have no animes in your list" />
      </ListLayout>
    )
  }

  return (
    <ListLayout sections={sections} setUserList={setUserList}>
      {filteredAnimes.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </ListLayout>
  )
}
