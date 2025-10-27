import { useAuthFormStore } from '@auth/stores/auth-store'
import { useEffect } from 'react'

/**
 * Hook para sincronizar la URL con el paso actual del formulario de autenticación
 *
 * @description Este hook mantiene la URL actualizada con el paso actual del formulario,
 * permitiendo navegación del navegador, URLs compartibles y estado consistente.
 * Usa replaceState para no crear entradas innecesarias en el historial.
 */
export const useAuthUrlSync = () => {
  const { mode, currentStep } = useAuthFormStore()

  useEffect(() => {
    if (globalThis.window === undefined || !mode) return

    const url = new URL(globalThis.window.location.href)
    const urlStep = url.searchParams.get('step')
    if (urlStep !== currentStep.toString()) {
      url.searchParams.set('step', currentStep.toString())
      globalThis.window.history.replaceState({}, '', url.toString())
    }
  }, [mode, currentStep])
}
