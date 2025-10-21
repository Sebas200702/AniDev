import type { AuthStep } from '@auth/types'

interface Props {
  step: AuthStep
  currentStep: number
  isSignUp: boolean
}
export const Step = ({ step, currentStep, isSignUp }: Props) => {
  return (
    <div
      key={step.id}
      className={`relative ${isSignUp ? '' : 'hidden'} flex h-36 w-full flex-col justify-end rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 ${currentStep === step.id ? 'bg-enfasisColor/40' : 'bg-black/50'}`}
    >
      <span
        className={`text-Primary-50 bg-Primary-200/30 absolute top-4 left-4 z-10 flex h-6 w-6 items-center justify-center rounded-full p-2 text-sm backdrop-blur-2xl ${currentStep === step.id ? 'bg-enfasisColor' : ''}`}
      >
        {step.id}
      </span>
      <h5 className="w-full text-sm font-bold">{step.title}</h5>
    </div>
  )
}
