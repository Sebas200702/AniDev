import type { ReactNode } from 'react'
import { create } from 'zustand'

/**
 * GlobalModal store manages modal state across the application.
 *
 * @description This store provides a centralized modal management system using Zustand.
 * It allows any component to open modals with custom content and handles the modal state
 * globally, ensuring only one modal can be open at a time.
 *
 * The store manages:
 * - Modal visibility state
 * - Modal content (React components/elements)
 * - Functions to open and close modals
 *
 * @interface GlobalModal - The interface defining the store's state and actions
 * @property {boolean} isOpen - Whether the modal is currently visible
 * @property {ReactNode | null} content - The content to render inside the modal
 * @property {function} openModal - Function to open modal with content
 * @property {function} closeModal - Function to close the modal
 *
 * @example
 * const { openModal, closeModal } = useGlobalModal();
 * openModal(<div>My modal content</div>);
 */
interface GlobalModal {
  isOpen: boolean
  content: ReactNode | null
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

export const useGlobalModal = create<GlobalModal>((set) => ({
  isOpen: false,
  content: null,
  openModal: (content: ReactNode) => set({ isOpen: true, content }),
  closeModal: () => set({ isOpen: false, content: null }),
}))
