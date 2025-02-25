import type { Section } from 'types'
import { useUserListsStore } from '@store/user-list-store'

interface Props {
  section: Section
}

export const UserListSection = ({ section }: Props) => {
  const { setUserList, userList } = useUserListsStore()

  const isSelected =
    userList.find((s) => s.label === section.label)?.selected || false

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    label: string
  ) => {
    if (isSelected) return
    setUserList(
      userList.map((s) => ({
        ...s,
        selected: s.label === label,
      }))
    )
  }

  return (
    <li key={section.label} title={section.label}>
      <button
        className={`flex h-full max-h-8 items-center gap-1 border-b p-2 transition duration-100 hover:bg-zinc-800/50 md:max-h-12 md:gap-3 md:p-5 ${
          isSelected
            ? 'border-enfasisColor text-enfasisColor'
            : 'border-gray-100/20 text-gray-400'
        }`}
        onClick={(e) => handleClick(e, section.label)}
      >
        <div className="flex h-4 w-4 items-center justify-center md:h-6 md:w-6">
          <section.icon className="h-full w-full transition-all duration-100" />
        </div>

        <ul
          className={`flex flex-row gap-3 text-xs transition-all duration-300 ease-in-out md:text-lg ${
            isSelected ? 'ml-2 w-auto opacity-100' : 'ml-0 hidden opacity-0'
          }`}
        >
          <span>{section.label}</span>
          <span>0</span>
        </ul>
      </button>
    </li>
  )
}
