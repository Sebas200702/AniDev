import { AuthFormContainer } from '@auth/components/auth-form/auth-form-container'
import { useAuthFormStore } from '@auth/stores/auth-store'
import { useModal } from '@shared/hooks/useModal'
export const UseAuthOpenForm = () => {
  const { setMode } = useAuthFormStore()
  const { openModal, closeModal } = useModal()
  const handleSignIn = (delay: number = 0) => {
    closeModal()
    setTimeout(() => {
      setMode('signIn')
      openModal(AuthFormContainer)
    }, delay)
  }
  const handleSignUp = (delay: number = 0) => {
    closeModal()
    setTimeout(() => {
      setMode('signUp')
      openModal(AuthFormContainer)
    }, delay)
  }
  return { handleSignIn, handleSignUp }
}
