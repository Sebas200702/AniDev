import { AuthFormulary } from '@auth/components/auth-form/auth-form'
import { useAuthFormStore } from '@auth/stores/auth-form-store'
import { useStepsStore } from '@auth/stores/steps-store'
import { toast } from '@pheralb/toast'
import { ToastType } from '@shared/types'
import { useEffect } from 'react'

interface Props {
  title: string
  bgImage?: string
  step?: string
}

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
    <AuthFormulary
      isSignUp={isSignUp}
      isLoading={isLoading}
      bgImage={bgImage ?? ''}
      title={title}
    />
  )
}
