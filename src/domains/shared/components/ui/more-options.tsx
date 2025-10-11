import { MoreOptionsIcon } from '@shared/components/icons/common/more-options-icon'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { useEffect, useRef, useState } from 'react'

interface MoreOptionsProps {
  children: React.ReactNode
  onMenuStateChange?: (isOpen: boolean) => void
  className?: string
}

export const MoreOptions = ({
  children,
  className,
  onMenuStateChange,
}: MoreOptionsProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
        onMenuStateChange?.(false)
        menuRef.current.classList.replace('flex', 'hidden')
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [onMenuStateChange])

  return (
    <>
      <div
        className={`bg-Complementary/60 more-options z-50 flex cursor-pointer flex-row items-center justify-center overflow-hidden rounded-md backdrop-blur-sm transition-all duration-300 ease-in-out md:rounded-xl ${isHovering ? 'w-20 md:w-24' : 'w-6.5 md:w-8'} h-6.5 md:h-8 ${className} `}
        onClick={(e) => {
          e.stopPropagation()
          setIsMenuOpen(!isMenuOpen)
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Overlay className="bg-enfasisColor/10 h-full w-full" />
        <div className={`p-1 ${isHovering ? 'hidden' : 'flex'}`}>
          <MoreOptionsIcon className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          className={`flex flex-row items-center px-1 md:px-2 ${isHovering ? 'opacity-100' : 'pointer-events-none h-0 opacity-0'} w-full justify-between`}
        >
          {children}
        </div>
      </div>
    </>
  )
}
