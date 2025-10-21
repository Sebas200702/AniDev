import { toast } from '@pheralb/toast'
import { ToastType } from '@shared/types'
import { useAuthFormState } from './use-auth-form-state'

export const useAuthFormSubmission = () => {
  const { submit, error, loading } = useAuthFormState()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submit()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      toast[ToastType.Error]({ text: message })
    }
  }

  // Mostrar error si existe
  if (error) {
    toast[ToastType.Error]({ text: error })
  }

  return {
    handleSubmit,
    loading,
    error,
  }
}
