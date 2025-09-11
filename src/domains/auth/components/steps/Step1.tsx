import { toast } from '@pheralb/toast'
import { useAuthFormStore } from '@store/auth-form-store'
import { useGlobalUserPreferences } from '@store/global-user'
import { useStepsStore } from '@store/steps-store'
import { parseResponse } from '@utils/parse-response'
import { GoogleBtn } from 'domains/auth/components/google-btn'
import { Input } from 'domains/auth/components/input'
import { EmailIcon } from 'domains/shared/components/icons/email-icon'
import { PasswordIcon } from 'domains/shared/components/icons/password-icon'
import { UserIcon } from 'domains/shared/components/icons/user-icon'
import { ToastType, type UserInfo } from 'types'

interface Props {
  isLoading: boolean
  title: string
  isSignUp: boolean
}

/**
 * Step1 component handles the first step of the authentication process.
 *
 * @description This component renders a form for user authentication, supporting both
 * email/password and Google authentication methods. It's part of a multi-step
 * authentication flow and handles form validation, submission, and error management.
 *
 * Key features:
 * - Dynamic form field rendering based on step configuration
 * - Form validation with immediate feedback
 * - Multiple authentication methods (Email/Password and Google)
 * - Toast notifications for success/error states
 * - Loading state management
 * - Error handling and display
 * - Integration with global user preferences
 * - Support for both signup and login flows
 *
 * The component uses several stores for state management:
 * - useAuthFormStore: Manages form values, validation, and messages
 * - useGlobalUserPreferences: Handles user information persistence
 * - useStepsStore: Controls multi-step form navigation
 *
 * Form submission includes:
 * - Client-side validation
 * - FormData preparation
 * - Error handling with user-friendly messages
 * - Success flow with user data persistence
 * - Loading state indication
 *
 * @param {Props} props - The component props
 * @param {boolean} props.isLoading - Controls loading state of the form
 * @param {string} props.title - The title/action text for the submit button
 * @param {boolean} props.isSignUp - Determines if this is a signup or login flow
 * @returns {JSX.Element} A form with authentication fields and submit button
 *
 * @example
 * <Step1
 *   isLoading={false}
 *   title="Sign Up"
 *   isSignUp={true}
 * />
 */

export const Step1 = ({ isLoading, title, isSignUp }: Props) => {
  const {
    values,
    validate,
    errors,
    setErrorMessage,
    setIsLoading,
    setSuccessMessage,
    clearMessages,
  } = useAuthFormStore()
  const { setUserInfo } = useGlobalUserPreferences()

  const { steps, nextStep } = useStepsStore()

  const action = '/api/auth/signup'

  const prepareFormData = (): FormData => {
    const formData = new FormData()
    formData.append('provider', 'email')
    formData.append('email', values.email)
    formData.append('password', values.password)
    if (values.user_name) {
      formData.append('user_name', values.user_name)
    }
    return formData
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = validate(true)
    if (!isValid) {
      const firstError = Object.values(errors).find((error) => error)
      if (firstError) {
        setErrorMessage(firstError)
        toast[ToastType.Error]({ text: firstError })
      }
      return
    }
    clearMessages()
    setIsLoading(true)
    try {
      const formData = prepareFormData()
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
      })
      const responseContent = await parseResponse(response)
      if (!response.ok) {
        let errorMessage: string
        if (typeof responseContent === 'object' && responseContent.message) {
          errorMessage = responseContent.message
        } else if (typeof responseContent === 'string') {
          errorMessage = responseContent
        } else {
          errorMessage = 'Error in the request'
        }
        throw new Error(errorMessage)
      }

      if (typeof responseContent === 'object' && responseContent.session) {
        const userInfo = responseContent.user
        setUserInfo(userInfo as UserInfo)
        setSuccessMessage('Signup successful')
        toast[ToastType.Success]({ text: 'Signup successful' })
        nextStep()
      } else {
        throw new Error('Error in the server response')
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error in the request'
      setErrorMessage(errorMsg)
      toast[ToastType.Error]({ text: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (field: any) => {
    if (
      field.type === 'text' ||
      field.type === 'email' ||
      field.type === 'password'
    ) {
      return (
        <Input
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required
        >
          {field.type === 'email' && <EmailIcon className="h-5 w-5" />}
          {field.type === 'password' && <PasswordIcon className="h-5 w-5" />}
          {field.type === 'text' && <UserIcon className="h-5 w-5" />}
        </Input>
      )
    }
    return null
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      {steps[0].fields.map(renderField)}
      <button
        type="submit"
        disabled={isLoading}
        className="button-primary mt-4 w-full focus:ring-2 focus:outline-none disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : title}
      </button>
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4 text-gray-200">or</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <GoogleBtn isSignUp={isSignUp} />
    </form>
  )
}
