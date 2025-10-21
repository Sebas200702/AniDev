import { RenderField } from '@auth/components/auth-steps/auth-step-render'
import type { AuthStep } from '@auth/types'

interface Props {
  step: AuthStep
}

export const StepContent = ({ step }: Props) => {
  return (
    <>
      <h2 className="text-Primary-50 text-lxx mb-4 font-bold text-center">
        {step.title}
      </h2>
      <p className="text-Primary-100 mb-6 text-sm text-pretty text-center">
        {step.description}
      </p>
      <div className={` ${step.id === 3 ? 'grid grid-cols-2 items-center gap-4' : 'flex flex-col gap-6'}`}>
        {step.fields.map((field) => (
          <RenderField key={field.name} field={field} />
        ))}
      </div>
    </>
  )
}
