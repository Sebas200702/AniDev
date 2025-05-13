import { useGlobalUserPreferences } from '@store/global-user'

export const ParentalControl = () => {
  const { parentalControl, setParentalControl } = useGlobalUserPreferences()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setParentalControl(checked)
    localStorage.setItem('parental_control', JSON.stringify(checked))
  }

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={parentalControl}
        onChange={handleChange}
        className="peer sr-only"
      />
      <div className="relative h-6 w-11 rounded-full bg-gray-600 transition-all duration-200 ease-in-out peer-checked:bg-enfasisColor">
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 ease-in-out ${
            parentalControl ? 'translate-x-5' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  )
}
