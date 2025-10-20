import { AuthFormulary } from '@auth/components/auth-form/auth-form'
import { useAuthFormStore } from '@auth/stores/auth-store'
import { useEffect } from 'react'

export const AuthFormContainer = () => {
  const { mode, setMode, setCurrentStep } = useAuthFormStore()


  const bgImage = mode === 'signIn' ? '/sign-in.webp' : '/sign-up.webp'

  useEffect(() => {
    if (typeof window === 'undefined') return

    const pathName = window.location.pathname
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const step = urlParams.get('step')


    setCurrentStep(Number.parseInt(step ?? '1'))

    if (pathName.includes('signup')) setMode('signUp')
    if (pathName.includes('signin')) setMode('signIn')
  }, [])

  if (!mode) return

  return (
    <AuthFormulary
      bgImage={bgImage}
      isSignUp={mode === 'signUp'}
    />
  )
}
