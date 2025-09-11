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
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={trackSearchHistory}
        onChange={handleChange}
        className="peer sr-only"
      />
      <div className="peer-checked:bg-enfasisColor relative h-6 w-11 rounded-full bg-gray-600 transition-all duration-200 ease-in-out">
        <div
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 ease-in-out ${
            trackSearchHistory ? 'translate-x-5' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  )
}
