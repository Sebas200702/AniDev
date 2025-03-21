import type { ReactNode } from 'react'
import { useAuthFormStore, type FormValues } from '@store/auth-form-store'
import { useState } from 'react'

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
 * @description This component provides an accessible and styled input field for collecting user data
 * in authentication forms. It integrates with the Auth Form Store to manage state and validation.
 * The component supports various input types (text, email, password) and includes visual elements
 * like icons and placeholder text to enhance usability.
 *
 * The component maintains its value state through the useAuthFormStore hook, ensuring form data
 * is properly collected and validated. When the input value changes, it updates the store and
 * clears any previous error or success messages to provide immediate feedback to the user.
 *
 * For password fields, the component includes a toggle button that allows users to show or hide
 * the password text, improving usability while maintaining security. The visibility state is
 * managed internally using React's useState hook.
 *
 * The UI presents a consistent styled input with proper spacing, icons positioned on the left side,
 * and focus states that highlight the active field with an emphasis color. The component is designed
 * to be used within authentication forms for sign-in and sign-up processes.
 *
 * @param {Props} props - The component props
 * @param {keyof FormValues} props.name - The name of the input field used as identifier in the form state
 * @param {string} props.type - The HTML input type (text, email, password, etc.)
 * @param {string} [props.placeholder] - Optional placeholder text shown when the field is empty
 * @param {boolean} [props.required=false] - Whether the input field is required for form submission
 * @param {ReactNode} [props.children] - Optional icon or other content to display inside the input
 * @returns {JSX.Element} The rendered input field with proper styling and behavior
 *
 * @example
 * <Input name="email" type="email" placeholder="Enter your email" required>
 *   <EmailIcon />
 * </Input>
 */
export const Input = ({
  name,
  type,
  placeholder,
  required = false,
  children,
}: Props): JSX.Element => {
  const { values, setValue, clearMessages } = useAuthFormStore()
  const [inputType, setInputType] = useState(type)

  const value = values[name] ?? ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(name, e.target.value)
    clearMessages()
  }

  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password')
  }

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
        {children}
      </div>
      <input
        value={value}
        onChange={handleChange}
        type={inputType}
        placeholder={placeholder}
        required={required}
        className="text-m focus:ring-enfasisColor w-full rounded bg-zinc-800 px-10 py-2 text-white placeholder-gray-400 focus:ring-2 focus:outline-none"
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
          aria-label={`${inputType === 'password' ? 'Show' : 'Hide'} password`}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {inputType === 'password' ? (
              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
            ) : (
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            )}
          </svg>
        </button>
      )}
    </div>
  )
}
