import { GoogleBtn } from '@components/auth/google-btn'
import { Input } from '@components/auth/input'
import { EmailIcon } from '@components/icons/email-icon'
import { Favicon } from '@components/icons/favicon'
import { PasswordIcon } from '@components/icons/password-icon'
import { UserIcon } from '@components/icons/user-icon'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { toast } from '@pheralb/toast'
import { useAuthFormStore } from '@store/auth-form-store'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { useEffect } from 'react'
import { ToastType } from 'types'
import type{ ApiJsonResponse } from 'types'
import { parseResponse } from '@utils/parse-response'

interface Props {
  /**
   * The title of the formulary.
   */
  title: string
  /**
   * The action URL for the form submission.
   */
  action: string
  /**
   * The background image URL for the formulary.
   */
  bgImage?: string
}





enum RedirectionResult {
  URL_FROM_JSON,
  SUCCESS_MESSAGE,
  REDIRECT_HEADER,
  DEFAULT_REDIRECT,
  NO_REDIRECT,
}

const handleResponseRedirection = (
  response: Response,
  responseContent: ApiJsonResponse | string,
  isSignUp: boolean,
  setSuccessMessage: (message: string | null) => void
): RedirectionResult => {
  if (typeof responseContent === 'object' && responseContent.url) {
    window.location.href = responseContent.url
    return RedirectionResult.URL_FROM_JSON
  }

  if (typeof responseContent === 'object' && responseContent.message) {
    setSuccessMessage(responseContent.message)
    return RedirectionResult.SUCCESS_MESSAGE
  }

  if (response.redirected) {
    window.location.href = response.url
    return RedirectionResult.REDIRECT_HEADER
  }

  window.location.href = isSignUp ? '/signin' : '/'
  return RedirectionResult.DEFAULT_REDIRECT
}

/**
 * Formulary component handles user authentication for sign-in and sign-up processes.
 *
 * @description This component manages the authentication flow, form validation, and submission
 * process for both sign-in and sign-up scenarios. It dynamically adjusts its interface based on
 * the provided title to show appropriate fields and messaging. The component handles form data
 * collection, validation against schemas, submission to backend endpoints, and processing of
 * responses including redirections and error handling.
 *
 * The component maintains internal state for form values, validation errors, loading status,
 * and feedback messages through the useAuthFormStore. It implements proper form validation
 * before submission and handles various response types from the server including JSON responses,
 * redirects, and error messages.
 *
 * The UI presents a responsive layout with email/password fields (plus username for sign-up),
 * submission button, alternative authentication methods like Google sign-in, and navigation
 * links between sign-in and sign-up pages. Error and success messages are displayed as toasts
 * for better user experience.
 *
 * @param {Props} props - The component props
 * @param {string} props.title - The title of the formulary that determines the mode (Sign In/Sign Up)
 * @param {string} props.action - The backend endpoint URL for form submission
 * @param {string} [props.bgImage] - Optional background image URL for the form
 * @returns {JSX.Element} The rendered authentication form with inputs, buttons and messaging
 *
 * @example
 * <Formulary title="Sign In" action="/api/auth/signin" bgImage="/sign-in.webp" />
 */
export const Formulary = ({ title, action, bgImage }: Props): JSX.Element => {
  const {
    values,
    validate,
    resetForm,
    isLoading,
    errorMessage,
    successMessage,
    setIsLoading,
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    errors,
  } = useAuthFormStore()

  useEffect(() => {
    resetForm()
  }, [resetForm])

  const isSignUp = title === 'Sign Up'

  const prepareFormData = (): FormData => {
    const formData = new FormData()
    formData.append('provider', 'email')
    formData.append('email', values.email)
    formData.append('password', values.password)

    if (isSignUp && values.user_name) {
      formData.append('user_name', values.user_name)
    }
    return formData
  }

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const isValid = validate(isSignUp)

    Object.values(errors).forEach((error) => {
      if (error) {
        setErrorMessage(error)
      }
    })

    if (!isValid) return

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
          errorMessage = 'Error en la solicitud'
        }

        throw new Error(errorMessage)
      }

      const redirectionResult = handleResponseRedirection(
        response,
        responseContent,
        isSignUp,
        setSuccessMessage
      )

      if (redirectionResult === RedirectionResult.NO_REDIRECT) {
        setSuccessMessage('Formulario enviado con éxito')
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error en la solicitud'
      setErrorMessage(errorMsg)
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  errorMessage &&
    toast[ToastType.Error]({
      text: errorMessage,
    })

  successMessage &&
    toast[ToastType.Success]({
      text: successMessage,
    })

  return (
    <section className="mt-8 flex h-full items-center justify-center p-4 text-white md:mt-0">
      <div
        className={`border-enfasisColor/50 relative h-136 w-full max-w-5xl overflow-hidden rounded-lg border-2 ${title === 'Sign Up' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        <Picture
          image={
            createImageUrlProxy(`${baseUrl}${bgImage}`, '100', '0', 'webp') ??
            ''
          }
          styles="w-full"
        >
          <Favicon
            className={`absolute top-2 right-4 z-20 h-8 w-8 md:h-16 md:w-16 ${title === 'Sign Up' ? 'md:left-4' : 'md:right-4'} `}
          />

          <Overlay
            className={`to-Primary-950/40 h-full w-full ${title === 'Sign Up' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}`}
          />
          <img
            src={bgImage}
            className="h-full w-full object-cover object-center"
            alt=""
          />
        </Picture>
        <div
          className={`bg-Primary-950/70 absolute top-0 flex h-full flex-col justify-between backdrop-blur-xs ${title === 'Sign Up' ? 'right-0' : 'left-0'} w-full p-6 md:w-1/2 md:p-8`}
        >
          <h2 className="text-Primary-50 text-lx mb-6 font-bold">{title}</h2>

          <form onSubmit={onSubmit} className="space-y-6">
            {isSignUp && (
              <Input
                name="user_name"
                type="text"
                placeholder="Username"
                required
              >
                <UserIcon className="h-5 w-5" />
              </Input>
            )}

            <Input name="email" type="email" placeholder="Email" required>
              <EmailIcon className="h-5 w-5" />
            </Input>

            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            >
              <PasswordIcon className="h-5 w-5" />
            </Input>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full focus:ring-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : title}
            </button>

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="mx-4 text-gray-200">or</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </form>
          <div>
            <GoogleBtn />
          </div>

          <div className="text-Primary-200 mt-6 text-center text-sm">
            {title === 'Sign In' ? (
              <p>
                <span>Don&apos;t have an account?</span>{' '}
                <a href="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="/signin" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
