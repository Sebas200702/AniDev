/**
 * AddToListButton component renders a button to add an anime to the user's list.
 */
export const AddToListButton = () => {
  return (
    <button className="button-secondary" title="Add to List" >
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
