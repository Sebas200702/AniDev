import { useGlobalModal } from '@store/modal-store'
import type { ReactNode } from 'react'

interface ModalTriggerProps {
  children: ReactNode
  modalContent: ReactNode
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

/**
 * ModalTrigger is a reusable component for opening content in the global modal.
 *
 * @description This component provides an easy way to make any element trigger
 * a modal with custom content. It uses the global modal store to manage state.
 *
 * @param children - The trigger element (button, image, etc.)
 * @param modalContent - The content to display in the modal
 * @param className - Additional CSS classes for the trigger
 * @param disabled - Whether the trigger is disabled
 * @param aria-label - Accessibility label for the trigger
 *
 * @example
 * <ModalTrigger
 *   modalContent={<img src="large-image.jpg" alt="Large view" />}
 *   aria-label="Open image in full screen"
 * >
 *   <img src="thumbnail.jpg" alt="Thumbnail" />
 * </ModalTrigger>
 */
export const ModalTrigger = ({
  children,
  modalContent,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}: ModalTriggerProps) => {
  const { openModal } = useGlobalModal()

  const handleClick = () => {
    if (!disabled) {
      openModal(modalContent)
    }
  }

  return (
    <button
      className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  )
}
