import { useGlobalModal } from '@shared/stores/modal-store'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const ModalContainer = () => {
  const { isOpen, Component, componentProps, closeModal, clearModal } =
    useGlobalModal()
  const modalRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      setIsClosing(false)
    } else if (show && !isClosing) {
      setIsClosing(true)
    }
  }, [isOpen, show, isClosing])

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        setShow(false)
        setIsClosing(false)
        clearModal()
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isClosing, clearModal])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
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



  if (!show || !Component) return null

  return createPortal(
    <div
      ref={modalRef}
      className={`fixed top-0 left-0 z-[100] flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/50 p-4 backdrop-blur-sm
      ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${isClosing ? 'animate-modal-scale-out' : 'animate-modal-scale'} w-full h-full flex flex-col items-center justify-center`}
        onClick={(e) => {
          e.stopPropagation()
          if (e.target === e.currentTarget) {
            closeModal()
          }
        }}
      >
        <Component {...componentProps} />
      </div>
    </div>,
    document.body
  )
}
