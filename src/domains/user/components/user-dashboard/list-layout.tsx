import { SectionList } from '@shared/components/buttons/section-list'
import type { Section } from '@shared/types'
import { UserListOptions } from '@user/components/user-dashboard/user-list-options'

interface ListLayoutProps {
  children: React.ReactNode
  sections: Section[]
  setUserList: (sections: Section[]) => void
}

export const ListLayout = ({
  children,
  sections,
  setUserList,
}: ListLayoutProps) => (
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
