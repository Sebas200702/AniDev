import { InputType } from '@shared/types'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { type ReactNode, useState } from 'react'
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

export const InputBase = ({
  name,
  type,
  placeholder,
  required = false,
  value,
  onChange,
  children,
}: Props) => {
  const [inputType, setInputType] = useState<InputType>(type)

  const togglePasswordVisibility = () => {
    setInputType(
      inputType === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD
    )
  }

  return (
    <div
      className={`group relative ${inputType === InputType.FILE ? 'hidden' : ''}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {children}
      </div>
      <Overlay className="bg-enfasisColor/5 group-hover:bg-enfasisColor/10 h-full w-full" />
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={
          inputType === InputType.PASSWORD
            ? 'current-password'
            : inputType === InputType.EMAIL
              ? 'email'
              : 'on'
        }
        required={required}
        className="text-m focus:ring-enfasisColor bg-Complementary placeholder-Primary-300 hover:border-enfasisColor/50 w-full rounded-md border border-gray-100/10 px-10 py-2 text-white transition-all duration-300 ease-in-out focus:ring-1 focus:outline-none"
      />
      {type === InputType.PASSWORD && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
          aria-label={`${inputType === InputType.PASSWORD ? 'Show' : 'Hide'} password`}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {inputType === InputType.PASSWORD ? (
              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9z" />
            ) : (
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
            )}
          </svg>
        </button>
      )}
    </div>
  )
}
