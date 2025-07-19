import { MoreOptionsIcon } from '@icons/more-options-icon'
import { useEffect, useRef, useState } from 'react'

interface MoreOptionsProps {
  children: React.ReactNode
  containerIsHovered?: boolean
  onMenuStateChange?: (isOpen: boolean) => void
  className?: string
}

export const MoreOptions = ({
  children,
  containerIsHovered,
  className,
  onMenuStateChange,
}: MoreOptionsProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newState = !isMenuOpen
    setIsMenuOpen(newState)
    onMenuStateChange?.(newState)
    menuRef.current?.classList.replace(
      newState ? 'hidden' : 'flex',
      newState ? 'flex' : 'hidden'
    )
  }

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
      <button
        className={`anchor absolute right-3 bottom-2 z-20 cursor-pointer p-2 ${
          containerIsHovered
            ? 'md:pointer-events-auto md:opacity-100'
            : 'md:pointer-events-none md:opacity-0'
        } transition-opacity duration-200 ease-in-out`}
        onClick={(e) => handleMenuClick(e)}
      >
        <MoreOptionsIcon className="h-4 w-4" />
      </button>

      <div
        ref={menuRef}
        className={`target absolute z-30 hidden flex-col rounded-lg border border-zinc-700/50 bg-zinc-900/95 p-1 shadow-2xl backdrop-blur-md transition-all duration-200 ease-out md:max-w-[220px] md:min-w-[180px]`}
        onClick={(e) => {
          e.stopPropagation()
          setIsMenuOpen(false)
        }}
      >
        {children}
      </div>
    </>
  )
}
