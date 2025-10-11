// hooks/useDraggable.ts
import { type RefObject, useCallback } from 'react'

interface UseDraggableProps {
  containerRef: RefObject<HTMLDivElement | null>
  onDragStart: (offset: { x: number; y: number }) => void
  enabled?: boolean
}

export const useDraggable = ({
  containerRef,
  onDragStart,
  enabled = true,
}: UseDraggableProps) => {
  const initiateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled) return

      const rect = containerRef?.current?.getBoundingClientRect()
      if (rect) {
        onDragStart({
          x: clientX - rect.left,
          y: clientY - rect.top,
        })
      }
    },
    [containerRef, onDragStart, enabled]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement

      // Ignorar si el click es en elementos interactivos
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('.controls-area') ||
        target.closest('.more-options')
      ) {
        return
      }

      initiateDrag(e.clientX, e.clientY)
    },
    [initiateDrag]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement

      // Ignorar si el touch es en elementos interactivos
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('.controls-area') ||
        target.closest('.more-options')
      ) {
        return
      }

      const touch = e.touches[0]
      initiateDrag(touch.clientX, touch.clientY)
    },
    [initiateDrag]
  )

  return {
    handleMouseDown,
    handleTouchStart,
  }
}
