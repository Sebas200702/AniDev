import type { Section } from 'types'

/**
 * Props for the SectionList component.
 *
 * @typedef {Object} Props
 * @property {Section} section - The current section being displayed.
 * @property {Object} sections - An object containing the list of sections and a setter function.
 * @property {Section[]} sections.list - Array of sections.
 * @property {function} sections.set - Function to update the selected section.
 */
interface Props {
  section: Section
  sections: {
    list: Section[]
    set: (list: Section[]) => void
  }
}

/**
 * SectionList component displays a list of sections and allows selection of a section.
 *
 * @param {Props} props - The props for the component.
 */
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
        className={`group relative flex h-full  cursor-pointer items-center justify-center overflow-hidden  transition-colors duration-200 ease-in-out hover:bg-zinc-800/50 max-h-12 p-5 ${isSelected ? 'text-enfasisColor' : 'text-gray-400'} after:bg-enfasisColor after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 after:ease-in-out ${isSelected ? 'after:w-full' : 'after:w-0'}`}
        onClick={(e) => handleClick(e, section.label)}
      >
        <div className="flex  items-center justify-center h-6 w-6">
          {section.icon ? (
            <section.icon
              className={`h-full w-full transition-transform duration-300 ${
                isSelected ? 'scale-110' : 'scale-100'
              }`}
            />
          ) : (
            <span className="text-red-500">⚠️</span>
          )}
        </div>

        <span
          className={`text-m xl:text-l transition-all duration-300 ease-in-out ${
            isSelected
              ? 'ml-2 w-auto translate-x-0 opacity-100'
              : 'w-0 -translate-x-full opacity-0'
          }`}
        >
          {section.label}
        </span>
      </button>
    </li>
  )
}
