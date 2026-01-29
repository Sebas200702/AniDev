import { AuthNavigation } from '@auth/components/auth-navigation/auth-navigation'
import { StepContent } from '@auth/components/auth-steps/auth-step-content'
import { UseAuthOpenForm } from '@auth/hooks/use-auth-open-form'
import type { AuthStep } from '@auth/types'

interface Props {
  currentStep: number
  step: AuthStep
  onSubmit: (e: React.FormEvent) => void
  steps: AuthStep[]
  onNext: () => void
  onPrev: () => void
  isSignUp: boolean
  loading: boolean
  error: string | null
  isLastStep: boolean
  isFirstStep: boolean
}

export const Main = ({
  step,
  steps,
  currentStep,
  isSignUp,
  onSubmit,
  onNext,
  onPrev,
  loading,
  error,
  isLastStep,
  isFirstStep,
}: Props) => {
  const { handleSignIn, handleSignUp } = UseAuthOpenForm()
  return (
    <section className="bg-Complementary/50 z-10 flex h-full w-full flex-col rounded-md backdrop-blur-sm">
      <form
        onSubmit={(e) => {
          if (isLastStep) {
            onSubmit(e)
            return
          }
          e.preventDefault()
          onNext()
        }}
        className="flex h-full w-full flex-col p-4 md:p-8"
      >
        <div className="flex-1">
          <StepContent step={step} />
          {error && (
            <span aria-live="assertive" className="sr-only">
              {error}
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <AuthNavigation
            currentStep={currentStep}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSignUp={isSignUp}
            loading={loading}
            steps={steps}
            onPrev={onPrev}
          />
          {currentStep === 1 && (
            <footer className="text-Primary-200 text-center text-sm">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSignIn(300)}
                    className="text-blue-500 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  <span>Don&apos;t have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => handleSignUp(300)}
                    className="text-blue-500 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </footer>
          )}
        </div>
      </form>
    </section>
  )
}
