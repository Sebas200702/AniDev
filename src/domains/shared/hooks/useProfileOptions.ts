import { useEffect, useRef, useState } from 'react'

export const useProfileOptions = () => {
  const [isOpen, setIsOpen] = useState(false)
  const optionRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleOptions = () => {
    setIsOpen(!isOpen)
  }
  const setOpen = (open: boolean) => {
    setIsOpen(open)
  }

  return { isOpen, toggleOptions, setOpen, optionRef  , buttonRef }
}
