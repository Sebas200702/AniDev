import { useGlobalUserPreferences } from '@store/global-user'

export const SelectColor = () => {
  const { enfasis, setEnfasis } = useGlobalUserPreferences()

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnfasis(e.target.value)
  }

  return <input type="color" value={enfasis} onChange={handleColorChange} className="w-10 h-10 rounded bg-Complementary" />
}
