import { Aside } from '@components/auth/aside'
import { Main } from '@components/auth/main'
import { toast } from '@pheralb/toast'
import { useAuthFormStore } from '@store/auth-form-store'
import { useStepsStore } from '@store/steps-store'
import { useEffect } from 'react'
import { ToastType } from 'types'
import type { ApiJsonResponse } from 'types'

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
  /**
   * The step of the formulary.
   */
  step?: string
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
export const Formulary = ({
  title,
  action,
  bgImage,
  step,
}: Props): JSX.Element => {
  const {
    values,

    resetForm,
    isLoading,
    errorMessage,
    successMessage,
  } = useAuthFormStore()

  const { setCurrentStep } = useStepsStore()

  useEffect(() => {
    if (step) {
      setCurrentStep(parseInt(step))
    }
  }, [step])

  if (errorMessage) {
    toast[ToastType.Error]({
      text: errorMessage,
    })
  }

  if (successMessage) {
    toast[ToastType.Success]({
      text: successMessage,
    })
  }

  useEffect(() => {
    resetForm()
  }, [resetForm])

  const isSignUp = title === 'Sign Up'


  return (
    <section className="flex h-full items-center justify-center p-4 text-white w-full md:p-20">
      <article className="bg-Complementary border-1 border-enfasisColor/30 flex h-full max-h-[75vh] rounded-lg p-4 w-full max-w-7xl">
        <Aside bgImage={bgImage ?? ''} isSignUp={isSignUp} />
        <Main isLoading={isLoading} isSignUp={isSignUp} title={title} />
      </article>
    </section>
  )
}
