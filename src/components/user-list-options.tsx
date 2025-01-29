import { FilterIcon } from '@components/icons/filter-icon'
import { MoreOptionsIcon } from '@components/more-options-icon'
import { CaretIcon } from '@components/icons/caret-icon'

export const UserListOptions = () => {
  const handleClick = () => {
    document.querySelector('#user-list-options')?.classList.toggle('hidden')
  }
  return (
    <>
      <div
        id="user-list-options"
        className="absolute bottom-0 right-4 z-10 hidden translate-y-full flex-col items-center justify-center gap-3 rounded-md bg-zinc-800 p-4 text-sm md:static md:flex md:translate-y-0 md:flex-row md:bg-inherit"
      >
        <button className="mb-4 flex w-full md:mb-0">
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
