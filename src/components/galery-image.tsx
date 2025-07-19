import { CloseIcon } from '@components/icons/close-icon'
import { ExpandIconV2 } from '@components/icons/expand-icon'
import { Overlay } from '@components/overlay'
import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  src: string
}

export const GaleryImage = ({ children, src }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (e.target instanceof HTMLElement && e.target === modalRef.current) {
        handleClose()
      }
    })

    return () => {
      document.removeEventListener('click', (e) => {
        if (e.target instanceof HTMLElement && e.target === modalRef.current) {
          handleClose()
        }
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    })

    return () => {
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      })
    }
  }, [])
  return (
    <>
      {isOpen && (
        <div
          ref={modalRef}
          className="fixed top-0 left-0 z-[100] flex h-[100vh] w-[100vw] items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <figure className="relative max-w-[450px]">
            {children}
            <button
              className="hover:bg-Primary-950/50 bg-Primary-950/30 absolute top-1 right-1 cursor-pointer rounded-full p-2 transition-all duration-300"
              onClick={handleClose}
              aria-label="Close image in full screen"
              title="Close image in full screen"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </figure>
        </div>
      )}

      <button
        className="group relative cursor-pointer"
        onClick={handleOpen}
        aria-label="Open image in full screen"
      >
        <Overlay className="bg-Complementary/0 group-hover:bg-Complementary/70 ba absolute inset-0 z-30 h-full w-full transition-all duration-300" />
        {children}
        <ExpandIconV2 className="absolute top-1/2 left-1/2 z-40 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </button>
    </>
  )
}
