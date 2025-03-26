import { useGlobalUserPreferences } from '@store/global-user'

export const SelectColor = () => {
  const { enfasis, setEnfasis } = useGlobalUserPreferences()

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnfasis(e.target.value)
  }

  return (
    <input
      type="color"
      value={enfasis}
      onChange={handleColorChange}
      className="bg-Complementary h-10 w-10 rounded"
    />
  )
}
