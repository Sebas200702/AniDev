/**
 * AddToListButton component renders a button that allows users to add an anime to their personal list.
 *
 * @description This component provides a clickable button with an intuitive icon that enables users
 * to add the current anime to their personal watchlist or favorites. The button features a clean,
 * minimalist design that integrates seamlessly with the overall user interface.
 *
 * The component uses an SVG icon to represent the "add to list" action, which scales appropriately
 * on different screen sizes. The button includes proper accessibility attributes such as a title
 * to ensure screen readers can correctly identify its purpose.
 *
 * The component is designed to be responsive, with the icon size adjusting based on screen width
 * using Tailwind's responsive classes. On extra-large screens, the icon displays at a larger size
 * for better visibility and interaction.
 *
 * @returns {JSX.Element} A button with an "add to list" icon that allows users to add anime to their personal list
 *
 * @example
 * <AddToListButton />
 */
export const AddToListButton = () => {
  return (
    <button className="button-secondary" title="Add to List">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-3 w-3 xl:h-4 xl:w-4"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M19 8H5M5 12h9M11 16H5M15 16h6M18 13v6" />
      </svg>
    </button>
  )
}
