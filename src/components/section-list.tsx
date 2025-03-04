import type { Section } from 'types'

interface Props {
  section: Section
  sections: {
    list: Section[]
    set: (list: Section[]) => void
  }
}

export const SectionList = ({ section, sections }: Props) => {
  const isSelected =
    sections.list.find((s) => s.label === section.label)?.selected || false
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    label: string
  ) => {
    if (isSelected) return
    sections.set(
      sections.list.map((s) => ({ ...s, selected: s.label === label }))
    )
  }

  return (
    <li key={section.label} title={section.label}>
      <button
        className={`flex h-full max-h-8 items-center gap-1 border-b p-2 transition ease-in-out duration-100 cursor-pointer hover:bg-zinc-800/50 md:max-h-12 xl:gap-3 xl:p-5 ${
          isSelected
            ? 'border-enfasisColor text-enfasisColor'
            : 'border-gray-100/20 text-gray-400'
        }`}
        onClick={(e) => handleClick(e, section.label)}
      >
        <div className="flex h-4 w-4 items-center justify-center xl:h-6 xl:w-6">
          {section.icon ? (
            <section.icon className="h-full w-full transition-all duration-100 ease-in-out" />
          ) : (
            <span className="text-red-500">⚠️</span>
          )}
        </div>

        <ul
          className={`flex flex-row gap-3 text-m transition-all duration-300 ease-in-out xl:text-l ${
            isSelected ? 'ml-2 w-auto opacity-100' : 'ml-0 hidden opacity-0'
          }`}
        >
          <span>{section.label}</span>
        </ul>
      </button>
    </li>
  )
}
