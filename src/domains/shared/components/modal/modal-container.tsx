import { useGlobalModal } from '@shared/stores/modal-store'
import { useEffect, useRef, useState } from 'react'

export const ModalContainer = () => {
  const { isOpen, Component, componentProps, closeModal, clearModal } =
    useGlobalModal()
  const modalRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'))
  }, [])

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

  if (!show || !Component || !modalRoot) return null

  return (
    <div
      ref={modalRef}
      className={`fixed top-0 left-0 z-[100] flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/50 p-4 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${isClosing ? 'animate-modal-scale-out' : 'animate-modal-scale'} flex h-full w-full flex-col items-center justify-center`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModal()
          }
        }}
      >
        <Component {...componentProps} />
      </div>
    </div>
  )
}
