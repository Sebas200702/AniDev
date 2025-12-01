import { useAuthFormStore } from '@auth/stores/auth-store'
import { useEffect } from 'react'

export const useAuthInitialization = () => {
  const { setMode, setCurrentStep, setGoogleAuth } = useAuthFormStore()

  useEffect(() => {
    if (globalThis.window === undefined) return

    const queryString = globalThis.window.location.search
    const urlParams = new URLSearchParams(queryString)
    const step = urlParams.get('step')
    const isGoogle = urlParams.get('google') === 'true'
    const modeParam = urlParams.get('authMode')
    const mode =
      modeParam === 'signUp' || modeParam === 'signIn' ? modeParam : null

    if (mode) {
      setMode(mode)
    }

    setGoogleAuth(isGoogle)

    if (isGoogle) {
      setCurrentStep(2)
    } else {
      setCurrentStep(Number.parseInt(step ?? '1'))
    }
  }, [setMode, setCurrentStep, setGoogleAuth])
}
