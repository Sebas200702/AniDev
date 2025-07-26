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

    lastUrlRef.current = window.location.href
    const handleUrlChangeWithDebounce = () => {
      if (urlChangeDebounceRef.current) {
        clearTimeout(urlChangeDebounceRef.current)
      }

      urlChangeDebounceRef.current = window.setTimeout(() => {
        const currentUrl = window.location.href
        if (currentUrl !== lastUrlRef.current) {
          lastUrlRef.current = currentUrl
          if (isModalOpen) {
            if (enableLogs) {
              console.log('URL changed, auto-closing modal:', {
                from: lastUrlRef.current,
                to: currentUrl
              })
            }
            closeModal()
          }
        }
      }, debounceMs)
    }


    document.addEventListener('astro:page-load', handleUrlChangeWithDebounce)
    document.addEventListener('astro:after-swap', handleUrlChangeWithDebounce)
    document.addEventListener('astro:before-preparation', handleUrlChangeWithDebounce)
    document.addEventListener('astro:after-preparation', handleUrlChangeWithDebounce)
    window.addEventListener('hashchange', handleUrlChangeWithDebounce)

    const handleLinkClick = (event: Event) => {
      try {
        const target = event.target as HTMLElement
        const link = target.closest('a')

        if (link && link.href && !link.hasAttribute('data-astro-reload') && !link.hasAttribute('target')) {
          const linkUrl = new URL(link.href)
          const currentUrl = new URL(window.location.href)
          if (linkUrl.origin === currentUrl.origin &&
              (linkUrl.pathname !== currentUrl.pathname || linkUrl.search !== currentUrl.search)) {
            if (enableLogs) {
              console.log('Astro link clicked, closing modal immediately:', {
                from: currentUrl.pathname + currentUrl.search,
                to: linkUrl.pathname + linkUrl.search
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

    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    history.pushState = function(data: any, unused: string, url?: string | URL | null) {
      originalPushState(data, unused, url)
      handleUrlChangeWithDebounce()
    }

    history.replaceState = function(data: any, unused: string, url?: string | URL | null) {
      originalReplaceState(data, unused, url)
      handleUrlChangeWithDebounce()
    }

    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href
      if (currentUrl !== lastUrlRef.current) {
        handleUrlChangeWithDebounce()
      }
    })

    observer.observe(document, { subtree: true, childList: true })

    return () => {
      if (urlChangeDebounceRef.current) {
        clearTimeout(urlChangeDebounceRef.current)
      }
      document.removeEventListener('astro:page-load', handleUrlChangeWithDebounce)
      document.removeEventListener('astro:after-swap', handleUrlChangeWithDebounce)
      document.removeEventListener('astro:before-preparation', handleUrlChangeWithDebounce)
      document.removeEventListener('astro:after-preparation', handleUrlChangeWithDebounce)
      window.removeEventListener('hashchange', handleUrlChangeWithDebounce)
      document.removeEventListener('click', handleLinkClick, true)

      history.pushState = originalPushState
      history.replaceState = originalReplaceState

      observer.disconnect()
    }
  }, [isModalOpen, closeModal, debounceMs, enableLogs])
}
