import { Step1, Step2, Step3 } from '@components/auth/steps/index'
import { useStepsStore } from '@store/steps-store'

interface Props {
  isLoading: boolean
  isSignUp: boolean
  title: string
}

/**
 * Main authentication component orchestrating the multi-step auth flow.
 *
 * @description This component serves as the primary container for the authentication
 * process, managing the display and transitions between different authentication steps.
 * It provides a consistent layout and navigation structure for both signup and signin flows.
 *
 * Key features:
 * - Multi-step form management (3 steps)
 * - Dynamic content based on current step
 * - Consistent header structure per step
 * - Conditional footer with auth toggle
 * - Responsive layout and spacing
 *
 * Step structure:
 * 1. Step1: Initial authentication (email/password or Google)
 * 2. Step2: Profile information collection
 * 3. Step3: User preferences setup
 *
 * The component integrates with useStepsStore for:
 * - Current step tracking
 * - Step configuration access
 * - Step navigation management
 *
 * Footer features:
 * - Only shown on Step1
 * - Toggle between signup/signin
 * - Context-aware messaging
 *
 * @param {Props} props - The component props
 * @param {boolean} props.isLoading - Controls loading state
 * @param {boolean} props.isSignUp - Determines if in signup or signin mode
 * @param {string} props.title - The title text for the current auth mode
 * @returns {JSX.Element} The main authentication interface
 *
 * @example
 * <Main
 *   isLoading={false}
 *   isSignUp={true}
 *   title="Sign Up"
 * />
 */

export const Main = ({ isLoading, isSignUp, title }: Props) => {
  const { currentStep, steps } = useStepsStore()

  return (
    <section className="z-10 flex h-full w-full flex-col items-center justify-center px-8 py-4">
      {steps[currentStep - 1] && (
        <>
          <h2 className="text-Primary-50 text-lxx mb-4 font-bold">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-Primary-100 mb-6 text-sm text-pretty">
            {steps[currentStep - 1].description}
          </p>
          {currentStep === 1 ? (
            <Step1 isLoading={isLoading} title={title} isSignUp={isSignUp} />
          ) : currentStep === 2 ? (
            <Step2 isSignUp={isSignUp} />
          ) : (
            <Step3 />
          )}
          {currentStep === 1 && (
            <footer className="text-Primary-200 mt-6 text-center text-sm">
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
            </footer>
          )}
        </>
      )}
    </section>
  )
}
