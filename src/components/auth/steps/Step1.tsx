import { GoogleBtn } from '@components/auth/google-btn'
import { Input } from '@components/auth/input'
import { EmailIcon } from '@components/icons/email-icon'
import { PasswordIcon } from '@components/icons/password-icon'
import { UserIcon } from '@components/icons/user-icon'
import { toast } from '@pheralb/toast'
import { useAuthFormStore } from '@store/auth-form-store'
import { useGlobalUserPreferences } from '@store/global-user'
import { useStepsStore } from '@store/steps-store'
import { parseResponse } from '@utils/parse-response'
import { ToastType, type UserInfo } from 'types'

interface Props {
  isLoading: boolean
  title: string
  isSignUp: boolean
}

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
