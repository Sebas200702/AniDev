import { AnimeCard } from '@components/anime-card'
import { UserListOptions } from '@components/profile/user-tabs/user-list-options'
import { LoadingCard } from '@components/search/results/loading-card'
import { SectionList } from '@components/section-list'
import { useGlobalUserPreferences } from '@store/global-user'
import { useUserListsStore } from '@store/user-list-store'
import { useEffect } from 'react'
/**
 * UserList component displays a navigation bar with user list sections and options.
 *
 * @description This component provides a horizontal navigation interface for browsing different
 * sections of the user's anime lists. It retrieves the navigation sections from the user lists store
 * and renders them as interactive list items. The navigation bar is designed to be responsive,
 * with consistent styling and spacing to create a cohesive user interface.
 *
 * The component uses the useUserListsStore hook to access the current list of sections and
 * the function to update them. Each section is rendered as a SectionList component, which
 * handles the individual section's display and interaction logic. Additionally, the component
 * displays UserListOptions which provides additional functionality for managing the user's lists.
 *
 * The UI presents the sections in a horizontal row with appropriate spacing and alignment on the left,
 * while the options are positioned on the right side of the navigation bar. Each section can be
 * selected to display its corresponding content in the user's profile page.
 *
 * @returns {JSX.Element} The rendered navigation bar with interactive section links and options
 *
 * @example
 * <UserList />
 */
export const UserList = () => {
  const {
    userList: sections,
    setUserList,
    isLoading,
  } = useUserListsStore()
  const { userInfo, watchList } = useGlobalUserPreferences()
  const currentSection = sections.find((section) => section.selected)

  return (
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
        {!userInfo?.name && (
          <div className="col-span-6 mt-20 flex flex-col items-center justify-center gap-4">
            <p className="text-l">Log in to see your lists</p>
            <a href="/signin" className="button-primary px-4 py-2">
              Sign in
            </a>
          </div>
        )}
        {userInfo?.name &&
          watchList
            .filter((watch) => watch.type === currentSection?.label)
            .map((watch) => <AnimeCard key={watch.id} anime={watch} />)}

        {isLoading &&
          !watchList.length &&
          userInfo?.name &&
          Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        {userInfo?.name &&
          watchList.filter((watch) => watch.type === currentSection?.label)
            .length === 0 &&
          !isLoading && (
            <div className="col-span-6 mt-20 flex w-full flex-col items-center justify-center gap-4">
              <p className="text-l text-center">No anime in this list</p>
            </div>
          )}
      </ul>
    </section>
  )
}
