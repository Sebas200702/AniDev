import { UserListOptions } from '@components/user-list-options'
import { UserListSection } from '@components/user-list-section'
import { useUserListsStore } from '@store/user-list-store'

export const UserList = () => {
  const { userList: sections } = useUserListsStore()
  return (
    <nav className="mt-16 flex w-full flex-row items-center justify-between md:mt-0">
      <ul className="flex flex-row py-4 md:p-4">
        {sections.map((section) => (
          <UserListSection key={section.label} section={section} />
        ))}
      </ul>
      <UserListOptions />
    </nav>
  )
}
