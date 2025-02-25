import { CaretIcon } from '@components/icons/caret-icon';
import { FilterIcon } from '@components/icons/filter-icon';
import { MoreOptionsIcon } from '@components/icons/more-options-icon';

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
