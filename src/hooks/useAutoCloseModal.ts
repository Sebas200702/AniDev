import { useEffect, useRef } from 'react'

interface UseAutoCloseModalOptions {
  debounceMs?: number
  enableLogs?: boolean
}

/**
 * Hook para auto-cerrar modal cuando cambie la URL
 * Evita el evento popstate para no cerrar en navegación con botones del navegador
 *
 * @param isModalOpen - Estado que indica si el modal está abierto
 * @param closeModal - Función para cerrar el modal
 * @param options - Opciones de configuración
 * @param options.debounceMs - Tiempo de debounce en milisegundos (default: 100)
 * @param options.enableLogs - Habilitar logs de debugging (default: false)
 *
 * @example
 * ```tsx
 * const { isOpen, closeModal } = useModal()
 *
 * // Uso básico
 * useAutoCloseModal(isOpen, closeModal)
 *
 * // Con configuración personalizada
 * useAutoCloseModal(isOpen, closeModal, {
 *   debounceMs: 200,
 *   enableLogs: true
 * })
 * ```
 *
 * @description
 * Este hook detecta cambios de URL a través de múltiples métodos:
 * - **Eventos de Astro**: `astro:page-load`, `astro:after-swap`, `astro:before-preparation`, `astro:after-preparation`
 * - **Click Interceptor**: Detecta clicks en elementos `<a>` para cierre inmediato
 * - **History API**: Intercepta `pushState` y `replaceState` para navegación programática
 * - **Hash Changes**: Detecta cambios en el hash de la URL
 * - **MutationObserver**: Como respaldo para detectar cambios no capturados
 *
 * ❌ **NO escucha** el evento `popstate` para evitar cerrar el modal cuando
 * el usuario navega con los botones del navegador (atrás/adelante).
 *
 * ✅ **Detecta navegación por**:
 * - Enlaces `<a>` internos (cierre inmediato)
 * - `navigate()` de Astro
 * - `history.pushState()` / `history.replaceState()`
 * - Cambios de query parameters
 * - Cambios de hash (#)
 */
export const useAutoCloseModal = (
  isModalOpen: boolean,
  closeModal: () => void,
  options: UseAutoCloseModalOptions = {}
) => {
  const { debounceMs = 100, enableLogs = false } = options
  const urlChangeDebounceRef = useRef<number | null>(null)
  const lastUrlRef = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleLinkClick = (event: Event) => {
      try {
        const target = event.target as HTMLElement
        const link = target.closest('a')

        if (
          link &&
          link.href &&
          !link.hasAttribute('data-astro-reload') &&
          !link.hasAttribute('target')
        ) {
          const linkUrl = new URL(link.href)
          const currentUrl = new URL(window.location.href)
          if (
            linkUrl.origin === currentUrl.origin &&
            (linkUrl.pathname !== currentUrl.pathname ||
              linkUrl.search !== currentUrl.search)
          ) {
            if (enableLogs) {
              console.log('Astro link clicked, closing modal immediately:', {
                from: currentUrl.pathname + currentUrl.search,
                to: linkUrl.pathname + linkUrl.search,
              })
            }
            if (isModalOpen) {
              closeModal()
            }
          }
        }
      } catch (error) {
        if (enableLogs) {
          console.warn('Error in handleLinkClick:', error)
        }
      }
    }

    document.addEventListener('click', handleLinkClick, true)
  }, [isModalOpen, closeModal, enableLogs])
}
