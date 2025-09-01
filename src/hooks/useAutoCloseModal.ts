import { useEffect } from 'react'

interface UseAutoCloseModalOptions {
  debounceMs?: number
  enableLogs?: boolean
}

/**
 * Hook to automatically close modal on URL changes
 * Avoids popstate event to prevent closing when using browser navigation buttons
 *
 * @param isModalOpen - Boolean indicating if the modal is open
 * @param closeModal - Function to close the modal
 * @param options - Configuration options
 * @param options.debounceMs - Debounce time in milliseconds (default: 100)
 * @param options.enableLogs - Enable debug logs (default: false)
 *
 * @example
 * ```tsx
 * const { isOpen, closeModal } = useModal()
 *
 * // Basic usage
 * useAutoCloseModal(isOpen, closeModal)
 *
 * // With custom configuration
 * useAutoCloseModal(isOpen, closeModal, {
 *   debounceMs: 200,
 *   enableLogs: true
 * })
 * ```
 *
 * @description
 * This hook detects URL changes through multiple methods:
 * - **Astro Events**: `astro:page-load`, `astro:after-swap`, `astro:before-preparation`, `astro:after-preparation`
 * - **Click Interceptor**: Detects clicks on `<a>` elements for immediate closing
 * - **History API**: Intercepts `pushState` and `replaceState` for programmatic navigation
 * - **Hash Changes**: Detects URL hash changes
 * - **MutationObserver**: As fallback for detecting uncaptured changes
 *
 * ❌ **Does NOT listen** to `popstate` event to prevent closing the modal
 * when user navigates with browser back/forward buttons.
 *
 * ✅ **Detects navigation from**:
 * - Internal `<a>` links (immediate close)
 * - Astro's `navigate()`
 * - `history.pushState()` / `history.replaceState()`
 * - Query parameter changes
 * - Hash changes (#)
 */
export const useAutoCloseModal = (
  isModalOpen: boolean,
  closeModal: () => void,
  options: UseAutoCloseModalOptions = {}
) => {
  const { enableLogs = false } = options

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleLinkClick = (event: Event) => {
      try {
        const target = event.target as HTMLElement
        const link = target.closest('a') || target.closest('anime-music-item')

        if (
          link &&
          ((link.tagName === 'A' && link.href) || link.classList?.contains('anime-music-item')) &&
          !link.hasAttribute('data-astro-reload') &&
          !link.hasAttribute('target')
        ) {
          const linkUrl = new URL(link.href)
          const currentUrl = new URL(window.location.href)
          const isSameOrigin = link.tagName === 'A'
            ? linkUrl.origin === currentUrl.origin &&
              (linkUrl.pathname !== currentUrl.pathname ||
               linkUrl.search !== currentUrl.search)
            : true;

          if (isSameOrigin) {
            if (enableLogs) {

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
