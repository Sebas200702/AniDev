import { SectionList } from '@components/section-list'
import { UserListOptions } from '@components/profile/user-tabs/user-list-options'
import { useUserListsStore } from '@store/user-list-store'
export const UserList = () => {
  const { userList: sections, setUserList } = useUserListsStore()

  return (
    <nav className="mt-16 flex w-full flex-row items-center justify-between md:mt-0">
      <ul className="flex flex-row py-4 md:p-4">
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
