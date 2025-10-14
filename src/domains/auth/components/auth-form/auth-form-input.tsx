
import { InputBase } from '@shared/components/input'
import { InputType } from '@shared/types'
import { useAuthFormStore, type FormValues } from '@auth/stores/auth-form-store'
import type { ReactNode } from 'react'

interface Props {
  name: string
  type: InputType
  placeholder?: string
  required?: boolean
  children?: ReactNode
  value?: string | string[]
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  options?: {
    label: string
    value: string
  }[]
}

export const AuthInput = ({
  name,
  type,
  placeholder,
  value,
  required,
  children,
}: Props) => {
  const { setValue, clearMessages } = useAuthFormStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name as keyof FormValues, e.target.value)
    clearMessages()
  }

  return (
    <InputBase
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={handleChange}
    >
      {children}
    </InputBase>
  )
}
