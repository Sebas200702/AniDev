/**
 * UserListOptions component provides sorting and filtering controls for user anime lists.
 *
 * @description This component manages the display of list control options with responsive behavior.
 * It provides a toggle mechanism for showing/hiding options on mobile devices while maintaining
 * a persistent display on larger screens. The component implements a clean interface for sorting
 * and filtering anime list entries.
 *
 * The component uses a simple toggle function to show or hide the options menu on mobile devices.
 * On desktop screens, the options are always visible and styled differently to match the layout.
 * The responsive design adapts to different screen sizes by changing the positioning, background,
 * and layout of elements.
 *
 * The UI displays sort and filter buttons with appropriate icons. On mobile, these options are
 * hidden by default and can be toggled with a "More Options" button. The component uses CSS
 * transitions for smooth visual feedback during interactions.
 *
 * @returns {JSX.Element} The rendered options panel with sort and filter controls
 *
 * @example
 * <UserListOptions />
 */
import { CaretIcon } from '@shared/components/icons/common/caret-icon'
import { MoreOptionsIcon } from '@shared/components/icons/common/more-options-icon'
import { FilterIcon } from '@shared/components/icons/search/filter-icon'

export const UserListOptions = () => {
  const handleClick = () => {
    document.querySelector('#user-list-options')?.classList.toggle('hidden')
  }
  return (
    <>
      <div
        id="user-list-options"
        className="absolute right-4 bottom-0 z-10 hidden translate-y-full flex-col items-center justify-center gap-3 rounded-md bg-zinc-800 p-4 text-xs md:static md:flex md:translate-y-0 md:flex-row md:bg-inherit md:text-sm"
      >
        <button className="mb-4 flex w-full items-center justify-center text-gray-400 transition-all duration-300 ease-in-out md:mb-0 hover:md:text-white">
          Sort by
          <CaretIcon className="ml-2 h-3 w-3 md:h-4 md:w-4" />
        </button>
        <button className="button-primary flex w-full gap-2">
          <FilterIcon className="h-3 w-3 md:h-4 md:w-4" /> Filters
        </button>
      </div>
      <div className="flex py-4 md:hidden">
        <button title="More Options" onClick={handleClick}>
          <MoreOptionsIcon className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}
