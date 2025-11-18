import { Step } from '@auth/components/auth-steps/auth-step'
import { useAuthFormStore } from '@auth/stores/auth-store'
export const StepsContainer = () => {
  const { steps, currentStep, mode } = useAuthFormStore()
  const isSignUp = mode === 'signUp'

  return (
    <ul className="flex gap-4">
      {steps.map((step) => (
        <Step
          key={step.id}
          currentStep={currentStep}
          step={step}
          isSignUp={isSignUp}
        />
      ))}
    </ul>
  )
}
