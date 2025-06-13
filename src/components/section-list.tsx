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
  context?: string
}

/**
 * SectionList component displays an interactive navigation section item.
 *
 * @description This component renders a single navigation item with icon and label that can be
 * selected by the user. It manages the selected state of the section and provides visual feedback
 * through styling changes. When a section is selected, it updates the global section list state
 * through the provided setter function.
 *
 * The component implements a clean transition effect when sections are selected, displaying the
 * section label with a smooth animation. Each section item features an underline indicator that
 * appears when the section is active, and the icon scales slightly to provide additional visual feedback.
 *
 * The UI displays the section icon at all times, while the text label is conditionally rendered
 * based on the selected state. When selected, the text animates into view with a transition effect.
 * The component uses consistent styling to maintain visual harmony with other navigation elements.
 *
 * @param {Props} props - The component props
 * @param {Section} props.section - The section to be rendered
 * @param {Object} props.sections - Object containing the section list and setter function
 * @returns {JSX.Element} The rendered section list item with interactive functionality
 *
 * @example
 * <SectionList
 *   section={{ label: "Overview", icon: OverviewIcon, selected: true }}
 *   sections={{
 *     list: sectionsList,
 *     set: updateSections
 *   }}
 * />
 */
export const SectionList = ({ section, sections, context }: Props) => {
  const isSelected =
    sections.list.find((s) => s.label === section.label)?.selected || false

  const isNotDefault = context !== 'default' && context
  const handleClick = (
    _e: React.MouseEvent<HTMLButtonElement>,
    label: string
  ) => {
    if (isSelected) return
    sections.set(
      sections.list.map((s) => ({ ...s, selected: s.label === label }))
    )
  }
  const styles = isSelected
    ? 'ml-2 w-auto translate-x-0 opacity-100'
    : 'w-0 -translate-x-full opacity-0'
  return (
    <li key={section.label} title={section.label}>
      <button
        className={`group relative flex h-full max-h-10 cursor-pointer items-center justify-center overflow-hidden p-2 transition-colors duration-200 ease-in-out hover:bg-zinc-800/50 md:max-h-12 md:p-5 ${isSelected ? 'text-enfasisColor' : 'text-gray-400'} after:bg-enfasisColor after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 after:ease-in-out ${isSelected ? 'after:w-full' : 'after:w-0'}`}
        onClick={(e) => handleClick(e, section.label)}
      >
        {section.icon && (
          <div className="flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
            <section.icon
              className={`h-full w-full transition-transform duration-300 ${
                isSelected ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        )}

        <span
          className={`transition-all duration-300 ease-in-out ${
            !isNotDefault ? styles : 'ml-2 w-auto translate-x-0 opacity-100'
          }`}
        >
          {section.label}
        </span>
      </button>
    </li>
  )
}
