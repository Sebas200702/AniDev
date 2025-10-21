import { AuthFormulary } from '@auth/components/auth-form/auth-form'
import { useAuthFormState } from '@auth/hooks/use-auth-form-state'
import { useAuthInitialization } from '@auth/hooks/use-auth-initialization'
import { useAuthUrlSync } from '@auth/hooks/use-auth-url-sync'

export const AuthFormContainer = () => {
  const { mode, isSignUp } = useAuthFormState()

  // Inicializar el estado basado en la URL
  useAuthInitialization()

  // Sincronizar la URL con el paso actual
  useAuthUrlSync()

  const bgImage = mode === 'signIn' ? '/sign-in.webp' : '/sign-up.webp'

  if (!mode) return

  return <AuthFormulary bgImage={bgImage} isSignUp={isSignUp} />
}
