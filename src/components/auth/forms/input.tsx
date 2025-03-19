import type { ReactNode } from 'react'
import { useAuthFormStore, type FormValues } from '@store/auth-form-store'

interface Props {
  name: keyof FormValues
  type: string
  placeholder?: string
  required?: boolean
  children?: ReactNode
}

export const Input = ({
  name,
  type,
  placeholder,
  required = false,
  children,
}: Props): JSX.Element => {
  const { values, setValue, clearMessages } = useAuthFormStore()

  const value = values[name] ?? ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(name, e.target.value)
    clearMessages()
  }

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
        {children}
      </div>
      <input
        value={value}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        required={required}
        className="text-m focus:ring-enfasisColor w-full rounded bg-zinc-800 px-10 py-2 text-white placeholder-gray-400 focus:ring-2 focus:outline-none"
      />
    </div>
  )
}
