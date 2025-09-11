import { useModal } from '@hooks/useModal'
import { SearchBar } from 'domains/search/components/search-bar'

/**
 * SearchButton component provides a clickable button to open the search interface.
 *
 * @description This component renders a search icon button that, when clicked, opens the search interface
 * by updating the search store state. The button features a clean, minimal design with a search icon
 * and includes hover effects for better user interaction feedback.
 *
 * The component integrates with the search store to manage the search interface visibility state.
 * When clicked, it triggers the search interface to open, allowing users to perform searches
 * across the application. The button is styled with smooth transitions and hover effects
 * to provide visual feedback for user interactions.
 *
 * The search icon is implemented as an SVG, ensuring crisp rendering at any size and
 * maintaining consistency with the application's design system. The button is fully
 * accessible and includes proper cursor styling to indicate its interactive nature.
 *
 * @returns {JSX.Element} The rendered search button with icon and hover effects
 *
 * @example
 * <SearchButton />
 */
export const SearchButton = () => {
  const { openModal } = useModal()

  const handleClick = () => {
    openModal(SearchBar)
  }

  return (
    <button
      className="hover:text-enfasisColor cursor-pointer p-2 transition-all duration-300"
      onClick={handleClick}
      title="Search"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  )
}
