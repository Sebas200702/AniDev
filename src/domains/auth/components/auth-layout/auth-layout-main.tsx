import { AuthNavigation } from '@auth/components/auth-navigation/auth-navigation'
import { StepContent } from '@auth/components/auth-steps/auth-step-content'
import type { AuthStep } from '@auth/types'

interface Props {
  currentStep: number
  step: AuthStep
  onSubmit: (e: React.FormEvent) => void
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
  return (
    <section className="bg-Complementary/50 z-10 flex h-full w-full flex-col  rounded-md  backdrop-blur-sm ">
      <form
        onSubmit={(e) => {
          if (isLastStep) {
            onSubmit(e)
            return
          }
          e.preventDefault()
          onNext()
        }}
        className="flex flex-col w-full h-full md:p-8 p-4"
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
            onPrev={onPrev}
          />
          {currentStep === 1 && (
            <footer className="text-Primary-200 text-center text-sm">
              {isSignUp ? (
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
        </div>
      </form>
    </section>
  )
}
