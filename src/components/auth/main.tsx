import { Step1, Step2, Step3 } from '@components/auth/steps/index'
import { useStepsStore } from '@store/steps-store'

interface Props {
  isLoading: boolean
  isSignUp: boolean
  title: string
}

export const Main = ({ isLoading, isSignUp, title }: Props) => {
  const { currentStep, steps } = useStepsStore()

  return (
    <section className="z-10 flex h-full w-full flex-col items-center justify-center px-4 py-8 md:px-18">
      {steps[currentStep - 1] && (
        <>
          <h2 className="text-Primary-50 text-lx mb-4 font-bold">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-Primary-100 mb-6 text-sm">
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
