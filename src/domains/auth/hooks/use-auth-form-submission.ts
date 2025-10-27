import { toast } from '@pheralb/toast'
import { ToastType } from '@shared/types'
import { useAuthFormState } from './use-auth-form-state'
import { navigate } from 'astro:transitions/client'

export const useAuthFormSubmission = () => {
  const { submit, error, loading } = useAuthFormState()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const {success, message} = await submit()
      if (success){
        toast[ToastType.Success]({text:message })
        navigate('/profile')

      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      toast[ToastType.Error]({ text: message })
    }
  }

  if (error) {
    toast[ToastType.Error]({ text: error })
  }

  return {
    handleSubmit,
    loading,
    error,
  }
}
