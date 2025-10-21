import { useAuthFormStore } from '@auth/stores/auth-store'


export const useAuthFormState = () => {
  const {
    mode,
    currentStep,
    steps,
    values,
    error,
    loading,
    isGoogleAuth,
    setMode,
    setCurrentStep,
    setField,
    setGoogleAuth,
    nextStep,
    prevStep,
    submit,
    reset,
  } = useAuthFormStore()

  const step = steps[currentStep - 1]
  const isLastStep = currentStep === steps.length
  const isFirstStep = currentStep === 1
  const isSignUp = mode === 'signUp'

  return {
    // Estado
    mode,
    currentStep,
    steps,
    step,
    values,
    error,
    loading,
    isGoogleAuth,
    isSignUp,
    isLastStep,
    isFirstStep,

    // Acciones
    setMode,
    setCurrentStep,
    setField,
    setGoogleAuth,
    nextStep,
    prevStep,
    submit,
    reset,
  }
}
