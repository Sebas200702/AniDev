import { useCallback, useState } from 'react'

interface UseImageRotationReturn {
  rotation: number
  rotateLeft: () => void
  rotateRight: () => void
  reset: () => void
}

/**
 * Custom hook for managing image rotation
 * @returns Object with rotation state and handlers
 */
export const useImageRotation = (): UseImageRotationReturn => {
  const [rotation, setRotation] = useState(0)

  const rotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90)
  }, [])

  const rotateRight = useCallback(() => {
    setRotation((prev) => prev + 90)
  }, [])

  const reset = useCallback(() => {
    setRotation(0)
  }, [])

  return {
    rotation,
    rotateLeft,
    rotateRight,
    reset,
  }
}
