import { useGlobalModal } from '@store/modal-store'

/**
 * Custom hook that provides a convenient API for using the global modal system.
 *
 * @description This hook wraps the global modal store and provides additional
 * utilities for common modal operations. It's designed to make modal usage
 * more convenient and consistent throughout the application.
 *
 * @returns An object with modal utilities:
 * - isOpen: Whether the modal is currently open
 * - openModal: Function to open modal with content
 * - closeModal: Function to close the modal
 * - openImageModal: Convenience function for opening basic image modals
 * - openConfirmModal: Convenience function for confirmation dialogs
 *
 * @example
 * const { openModal, openImageModal, closeModal } = useModal();
 *
 * // Open a custom modal
 * openModal(<div>Custom content</div>);
 *
 * // Open a basic image modal
 * openImageModal('/path/to/image.jpg', 'Alt text');
 *
 * // Close modal programmatically
 * closeModal();
 */
export const useModal = () => {
  const { isOpen, openModal, closeModal } = useGlobalModal()

  /**
   * Opens a modal with an image (basic version)
   * @param src - Image source URL
   * @param alt - Alt text for the image
   * @param maxWidth - Maximum width for the image (default: '90vw')
   */
  const openImageModal = (src: string, alt: string, maxWidth = '90vw') => {
    const imageContent = (
      <figure className="relative" style={{ maxWidth }}>
        <img
          src={src}
          alt={alt}
          className="h-auto w-full rounded-lg"
          loading="lazy"
        />
      </figure>
    )
    openModal(imageContent)
  }

  /**
   * Opens a confirmation dialog modal
   * @param title - Dialog title
   * @param message - Dialog message
   * @param onConfirm - Callback when confirmed
   * @param onCancel - Callback when cancelled (optional)
   * @param confirmText - Text for confirm button (default: 'Confirm')
   * @param cancelText - Text for cancel button (default: 'Cancel')
   */
  const openConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    const confirmContent = (
      <div className="bg-Primary-900 mx-auto max-w-md rounded-lg p-6">
        <h3 className="text-Primary-50 mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-Primary-200 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              onCancel?.()
              closeModal()
            }}
            className="bg-Primary-700 text-Primary-50 hover:bg-Primary-600 rounded px-4 py-2 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              closeModal()
            }}
            className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    )
    openModal(confirmContent)
  }

  return {
    isOpen,
    openModal,
    closeModal,
    openImageModal,
    openConfirmModal,
  }
}
