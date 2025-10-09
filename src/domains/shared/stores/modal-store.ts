import type { ComponentType } from 'react'
import { create } from 'zustand'

/**
 * GlobalModal store manages dynamic modal components across the application.
 *
 * @description This store provides a centralized modal management system using Zustand
 * for dynamic React components. It allows any component to open modals with dynamic
 * components that have their own state and lifecycle, ensuring only one modal can be
 * open at a time.
 *
 * The store manages:
 * - Modal visibility state
 * - Modal component and its props
 * - Functions to open and close modals
 *
 * @interface GlobalModal - The interface defining the store's state and actions
 */

interface GlobalModal {
  isOpen: boolean
  Component: ComponentType<any> | null
  componentProps: Record<string, any>
  onCloseCallback?: (() => void) | null
  setIsOpen: (isOpen: boolean) => void
  openModal: (
    Component: ComponentType<any>,
    props?: Record<string, any>
  ) => void
  closeModal: () => void
  clearModal: () => void
  setOnClose: (callback?: (() => void) | null) => void
}

export const useGlobalModal = create<GlobalModal>((set, get) => ({
  isOpen: false,
  Component: null,
  componentProps: {},
  onCloseCallback: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  openModal: (Component, props = {}) =>
    set({ isOpen: true, Component, componentProps: props }),
  closeModal: () => {
    const { onCloseCallback } = get()

    if (onCloseCallback && typeof onCloseCallback === 'function') {
      onCloseCallback()
    }

    set({
      isOpen: false,
      onCloseCallback: null,
    })
  },

  clearModal: () => {
    set({
      Component: null,
      componentProps: {},
    })
  },
  setOnClose: (callback) => set({ onCloseCallback: callback }),
}))
