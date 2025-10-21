import { useAuthFormStore } from '@auth/stores/auth-store'
import { useEffect } from 'react'

/**
 * Hook para inicializar el estado del formulario de autenticación basado en la URL
 *
 * @description Este hook detecta el modo (signin/signup), si viene de Google,
 * y establece el paso inicial apropiado basado en los parámetros de la URL.
 */
export const useAuthInitialization = () => {
  const { setMode, setCurrentStep, setGoogleAuth } = useAuthFormStore()

  useEffect(() => {
    if (globalThis.window === undefined) return

    const pathName = globalThis.window.location.pathname
    const queryString = globalThis.window.location.search
    const urlParams = new URLSearchParams(queryString)
    const step = urlParams.get('step')
    const isGoogle = urlParams.get('google') === 'true'

    // Establecer el modo basado en la ruta
    if (pathName.includes('signup')) setMode('signUp')
    if (pathName.includes('signin')) setMode('signIn')

    // Detectar si viene de Google
    setGoogleAuth(isGoogle)

    // Si viene de Google y es signup, ir directamente al paso 2
    if (isGoogle && pathName.includes('signup')) {
      setCurrentStep(2)
    } else {
      setCurrentStep(Number.parseInt(step ?? '1'))
    }
  }, [setMode, setCurrentStep, setGoogleAuth])
}

