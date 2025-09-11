import { useGlobalUserPreferences } from '@store/global-user'

export const SelectColor = () => {
  const { enfasis, setEnfasis } = useGlobalUserPreferences()

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setEnfasis(color)
    localStorage.setItem('enfasis', color)
  }

  return (
    <input
      type="color"
      value={enfasis}
      onChange={handleColorChange}
      className="bg-Complementary h-10 w-10 cursor-pointer [appearance:none] [-moz-appearance:none] [-webkit-appearance:none] [&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
    />
  )
}
