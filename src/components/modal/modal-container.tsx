import { useGlobalModal } from '@store/modal-store'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * ModalContainer is the global modal renderer using React Portal.
 *
 * @description This component subscribes to the global modal store and renders dynamic
 * modal components using React Portal. It handles:
 * - Portal-based rendering for proper DOM isolation
 * - Backdrop clicks to close modal (but not content clicks)
 * - Escape key to close modal
 * - Dynamic component rendering with props
 * - Proper focus management
 * - Modal positioning and styling
 *
 * This component should be rendered once in the main layout and will handle
 * all modal rendering throughout the application using React Portal.
 *
 */

export const ModalContainer = () => {
  const { isOpen, Component, componentProps, closeModal } = useGlobalModal()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      // Solo cerrar si el click fue directamente en el backdrop
      if (e.target === modalRef.current) {
        closeModal()
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, closeModal])

  if (!isOpen || !Component) return null

  const modalElement = (
    <div
      ref={modalRef}
      className="fixed top-0 left-0 z-[100] flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <Component {...componentProps} />
    </div>
  )

  return createPortal(modalElement, document.body)
}
