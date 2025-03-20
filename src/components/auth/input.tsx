import type { ReactNode } from 'react'
import { useAuthFormStore, type FormValues } from '@store/auth-form-store'

/**
 * Props for the Input component.
 *
 * @typedef {Object} Props
 * @property {keyof FormValues} name - The name of the input field.
 * @property {string} type - The type of the input field.
 * @property {string} [placeholder] - The placeholder text for the input field.
 * @property {boolean} [required=false] - Whether the input field is required.
 * @property {ReactNode} [children] - The child elements to render inside the input field.
 */
interface Props {
  name: keyof FormValues
  type: string
  placeholder?: string
  required?: boolean
  children?: ReactNode
}

/**
 * Input component renders a text input field for user input.
 *
 * This component takes props for input attributes and uses the Auth Form Store to manage its state.
 *
 * @param {Props} props - The props for the component.
 * @param {keyof FormValues} props.name - The name of the input field.
 * @param {string} props.type - The type of the input field.
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @param {boolean} [props.required=false] - Whether the input field is required.
 * @param {ReactNode} [props.children] - The child elements to render inside the input field.
 * @returns {JSX.Element} The JSX element for the input field.
 */
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
