import { EmailIcon } from '@components/icons/email-icon'
import { Favicon } from '@components/icons/favicon'
import { GoogleBtn } from '@components/auth/forms/google-btn'
import { Input } from '@components/auth/forms/input'
import { Overlay } from '@components/overlay'
import { PasswordIcon } from '@components/icons/password-icon'
import { Picture } from '@components/picture'
import { ToastType } from 'types'
import { UserIcon } from '@components/icons/user-icon'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { toast } from '@pheralb/toast'
import { useAuthFormStore } from '@store/auth-form-store'
import { useEffect } from 'react'

interface Props {
  title: string
  action: string
  bgImage?: string
}
interface ApiJsonResponse {
  url?: string
  message?: string
  [key: string]: unknown
}

const parseResponse = async (
  response: Response
): Promise<ApiJsonResponse | string> => {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    try {
      return (await response.json()) as ApiJsonResponse
    } catch (e) {
      console.error('Error parsing JSON response:', e)
      return {}
    }
  } else {
    return await response.text()
  }
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
        throw new Error(
          typeof responseContent === 'object' && responseContent.message
            ? responseContent.message
            : typeof responseContent === 'string'
              ? responseContent
              : 'Error en la solicitud'
        )
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
    <section className="flex h-full items-center justify-center p-4  md:mt-0 mt-8 text-white">
      <div
        className={`border-enfasisColor/50 flex w-full max-w-5xl flex-col rounded-lg border-2 ${title === 'Sign Up' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        <Picture
          image={
            createImageUrlProxy(`${baseUrl}${bgImage}`, '100', '0', 'webp') ??
            ''
          }
          styles="md:w-1/2 relative"
        >
          <Favicon
            className={`absolute top-2 w-8 h-8 md:w-16 z-20 md:h-16 ${title === 'Sign Up' ? 'left-4' : 'right-4'} `}
          />
          <Overlay className="to-Complementary/40 h-full w-full bg-gradient-to-t via-transparent" />
          <Overlay className="to-Complementary/80 h-full w-full bg-gradient-to-r via-transparent" />
          <img
            src={bgImage}
            className="h-full  object-cover object-center"
            alt=""
          />
        </Picture>

        <div className="bg-Complementary md:w-1/2 md:p-8 p-6  ">
          <h2 className="text-Primary-50 mb-6 text-lx font-bold">{title}</h2>

          <form onSubmit={onSubmit} className="space-y-6">
            {isSignUp && (
              <Input
                name="user_name"
                type="text"
                placeholder="Username"
                required
              >
                <UserIcon style="h-5 w-5" />
              </Input>
            )}

            <Input name="email" type="email" placeholder="Email" required>
              <EmailIcon style="h-5 w-5" />
            </Input>

            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            >
              <PasswordIcon style="h-5 w-5" />
            </Input>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full focus:ring-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : title}
            </button>

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
          </form>
          <div>
            <GoogleBtn />
          </div>

          <div className="text-Primary-400 mt-6 text-center text-sm">
            {title === 'Sign In' ? (
              <p>
                Don't have an account?{' '}
                <a href="/signup" className="text-enfasisColor hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="/signin" className="text-enfasisColor hover:underline">
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
