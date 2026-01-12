import { useEffect } from 'react'

interface UseImageKeyboardOptions {
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

/**
 * Custom hook for managing keyboard navigation in image viewer
 * @param options - Callback functions for keyboard actions
 */
export const useImageKeyboard = ({
  onClose,
  onNext,
  onPrevious,
}: UseImageKeyboardOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrevious()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrevious])
}
