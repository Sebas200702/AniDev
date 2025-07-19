import { CloseIcon } from '@components/icons/close-icon'
import { useGlobalModal } from '@store/modal-store'
import { useEffect, useRef } from 'react'

/**
 * ModalContainer is the global modal renderer that should be placed in the main layout.
 *
 * @description This component subscribes to the global modal store and renders modals
 * when they are opened. It handles:
 * - Backdrop clicks to close modal
 * - Escape key to close modal
 * - Proper focus management
 * - Modal positioning and styling
 *
 * This component should be rendered once in the main layout and will handle
 * all modal rendering throughout the application.
 */
export const ModalContainer = () => {
  const { isOpen, content, closeModal } = useGlobalModal()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target === modalRef.current) {
        closeModal()
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeModal])

  if (!isOpen || !content) return null

  return (
    <div
      ref={modalRef}
      className="fixed top-0 left-0 z-[100] flex h-[100vh] w-[100vw] items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      {content}
    </div>
  )
}
