import { SectionList } from '@components/section-list'
import { UserListOptions } from '@components/profile/user-tabs/user-list-options'
import { useUserListsStore } from '@store/user-list-store'

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
  const { userList: sections, setUserList } = useUserListsStore()

  return (
    <nav className="flex w-full flex-row items-center justify-between">
      <ul className="flex flex-row">
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
  )
}
