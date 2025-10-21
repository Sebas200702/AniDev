import { Main } from '@auth/components/auth-layout/auth-layout-main'
import { useAuthFormState } from '@auth/hooks/use-auth-form-state'
import { useAuthFormSubmission } from '@auth/hooks/use-auth-form-submission'

export const MainContainer = () => {
  const {
    step,
    currentStep,
    isSignUp,
    isLastStep,
    isFirstStep,
    nextStep,
    prevStep,
  } = useAuthFormState()

  const { handleSubmit, loading, error } = useAuthFormSubmission()

  return (
    <Main
      step={step}
      currentStep={currentStep}
      onSubmit={handleSubmit}
      onNext={nextStep}
      onPrev={prevStep}
      isSignUp={isSignUp}
      loading={loading}
      error={error}
      isLastStep={isLastStep}
      isFirstStep={isFirstStep}
    />
  )
}
