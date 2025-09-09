import { Aside } from '@components/auth/aside'
import { Main } from '@components/auth/main'
import { toast } from '@pheralb/toast'
import { useAuthFormStore } from '@store/auth-form-store'
import { useStepsStore } from '@store/steps-store'
import { useEffect } from 'react'
import { ToastType } from 'types'

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
export const Formulary = ({ title, bgImage, step }: Props) => {
  const { resetForm, isLoading, errorMessage, successMessage } =
    useAuthFormStore()

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
    <section className="flex  w-full items-center justify-center px-4 text-white h-full max-h-[75vh] md:mt-20 md:px-20">
      <article className="bg-Complementary border-enfasisColor/30 relative flex h-full   w-full max-w-7xl rounded-lg border-1 ">
        <Aside bgImage={bgImage ?? ''} isSignUp={isSignUp} />
        <Main isLoading={isLoading} isSignUp={isSignUp} title={title} />
      </article>
    </section>
  )
}
