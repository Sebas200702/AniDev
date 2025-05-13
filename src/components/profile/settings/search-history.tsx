import { useGlobalUserPreferences } from '@store/global-user'

export const SearchHistory = () => {
  const { trackSearchHistory, setTrackSearchHistory } =
    useGlobalUserPreferences()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setTrackSearchHistory(checked)
        localStorage.setItem('track_search_history', JSON.stringify(checked))
      }
  return (
    <button
      className="flex items-center gap-2"
      onClick={(e) => {
        e.preventDefault()
        const checkbox = document.getElementById(
          'search-history'
        ) as HTMLInputElement
        checkbox.click()
      }}
    >
      <input
        type="checkbox"
        id="search-history"
        checked={trackSearchHistory}
        onChange={handleChange}
        className="border-Complementary bg-Complementary text-Complementary peer hidden cursor-pointer rounded-lg border-2 focus:ring-0"
      />
      <span className="peer-checked:border-enfasisColor peer-checked:bg-enfasisColor flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-2 border-gray-500 transition-all duration-200 ease-in-out">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5.5 w-5.5 text-white transition-all duration-200 ease-in-out"
          style={{ display: trackSearchHistory ? 'block' : 'none' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    </button>
  )
}
