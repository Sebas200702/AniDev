import { useCallback, useState } from 'react'

interface Position {
  x: number
  y: number
}

interface UseImagePanReturn {
  position: Position
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: MouseEvent) => void
  handleMouseUp: () => void
  reset: () => void
  centerImage: (
    imageRef: React.RefObject<HTMLImageElement | null>,
    zoom: number
  ) => void
}

/**
 * Custom hook for managing image pan/drag functionality
 * @param zoom - Current zoom level
 * @returns Object with pan state and handlers
 */
export const useImagePan = (zoom: number): UseImagePanReturn => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [zoom, position]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart, zoom]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const reset = useCallback(() => {
    setPosition({ x: 0, y: 0 })
    setIsDragging(false)
  }, [])

  const centerImage = useCallback(
    (imageRef: React.RefObject<HTMLImageElement | null>, zoom: number) => {
      if (zoom <= 1) {
        setPosition({ x: 0, y: 0 })
        return
      }

      const imageElement = imageRef.current
      if (!imageElement) return

      const container = imageElement.parentElement
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const imageWidth = imageElement.naturalWidth || imageElement.width
      const imageHeight = imageElement.naturalHeight || imageElement.height

      const scaledWidth = imageWidth * zoom
      const scaledHeight = imageHeight * zoom

      setPosition((currentPosition) => {
        let newX = currentPosition.x
        let newY = currentPosition.y

        if (scaledWidth > containerWidth) {
          const maxX = (scaledWidth - containerWidth) / 2
          const minX = -maxX

          if (newX > maxX) newX = maxX
          if (newX < minX) newX = minX
        } else {
          newX = 0
        }

        if (scaledHeight > containerHeight) {
          const maxY = (scaledHeight - containerHeight) / 2
          const minY = -maxY

          if (newY > maxY) newY = maxY
          if (newY < minY) newY = minY
        } else {
          newY = 0
        }

        return newX !== currentPosition.x || newY !== currentPosition.y
          ? { x: newX, y: newY }
          : currentPosition
      })
    },
    []
  )

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    reset,
    centerImage,
  }
}
