import { AuthFormContainer } from '@auth/components/auth-form/auth-form-container'
import { useAuthFormStore } from '@auth/stores/auth-store'
import { useModal } from '@shared/hooks/useModal'
export const UseAuthOpenForm = () => {
  const { setMode } = useAuthFormStore()
  const { openModal } = useModal()
  const handleSignIn = () => {
    setMode('signIn')
    openModal(AuthFormContainer)
  }
  const handleSignUp = () => {
    setMode('signUp')
    openModal(AuthFormContainer)
  }
  return { handleSignIn, handleSignUp }
}
