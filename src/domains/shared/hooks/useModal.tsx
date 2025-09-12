import { useGlobalModal } from '@shared/stores/modal-store'
import type { ComponentType } from 'react'

/**
 * Custom hook that provides a convenient API for using the global dynamic modal system.
 *
 * @description This hook wraps the global modal store and provides utilities for
 * opening dynamic React components as modals. It's designed to work with components
 * that have their own state and lifecycle, providing better performance and
 * functionality than static JSX content.
 *
 * @returns An object with modal utilities:
 * - isOpen: Whether the modal is currently open
 * - openModal: Function to open modal with a dynamic component
 * - closeModal: Function to close the modal
 *
 * @example
 * const { openModal, closeModal } = useModal();
 *
 * // Open a dynamic component modal
 * openModal(MyDynamicComponent, { prop1: 'value1', prop2: 'value2' });
 *
 * // Close modal programmatically
 * closeModal();
 */
export const useModal = () => {
  const { isOpen, openModal, closeModal, setOnClose } = useGlobalModal()

  /**
   * Opens a modal with a dynamic React component
   * @param Component - The React component to render in the modal
   * @param props - Props to pass to the component
   */
  const openComponentModal = <T extends Record<string, any>>(
    Component: ComponentType<T>,
    props?: T
  ) => {
    openModal(Component, props)
  }

  /**
   * Sets a callback function to be executed when the modal is closed
   * @param callback - Function to execute when modal closes (optional)
   */
  const onClose = (callback?: (() => void) | null) => {
    setOnClose(callback)
  }

  return {
    isOpen,
    openModal: openComponentModal,
    closeModal,
    onClose,
  }
}
