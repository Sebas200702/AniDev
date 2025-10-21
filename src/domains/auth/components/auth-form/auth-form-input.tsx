
import { InputBase } from '@shared/components/input'
import { InputType } from '@shared/types'

import type { ReactNode } from 'react'

interface Props {
  name: string
  type: InputType
  placeholder?: string
  required?: boolean
  children?: ReactNode
  value?: string | string[]
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void

}

export const AuthInput = ({
  name,
  type,
  placeholder,
  value,
  required,
  onChange,
  children,
}: Props) => {

  return (
    <InputBase
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}

    >
      {children}
    </InputBase>
  )
}
