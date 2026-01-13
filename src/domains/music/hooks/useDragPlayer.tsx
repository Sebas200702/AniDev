import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

interface DraggablePlayerProps {
  children: ReactNode
  className?: string
}

interface DragHandleProps {
  children: ReactNode
  className?: string
}

interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  initialX: number
  initialY: number
}

const DragContext = ({ children }: { children: ReactNode }) => {
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  })

  return <>{children}</>
}

const DraggableContent = ({ children, className }: DraggablePlayerProps) => {
  const { isMinimized, position } = useMusicPlayerStore()
  const [transform, setTransform] = useState({ x: 0, y: 0 })

  const style = {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
  }

  // Exponer método para actualizar transform desde DragHandle
  useEffect(() => {
    const handleTransformUpdate = (event: CustomEvent) => {
      setTransform(event.detail)
    }

    window.addEventListener('drag-transform-update' as any, handleTransformUpdate)
    return () => {
      window.removeEventListener('drag-transform-update' as any, handleTransformUpdate)
    }
  }, [])

  return (
    <div style={style} className={className}>
      {children}
    </div>
  )
}

export const DraggablePlayer = ({
  children,
  className,
}: DraggablePlayerProps) => {
  return (
    <DragContext>
      <DraggableContent className={className}>{children}</DraggableContent>
    </DragContext>
  )
}

export const DragHandle = ({ children, className }: DragHandleProps) => {
  const { isMinimized, position, setPosition, setIsDragging } =
    useMusicPlayerStore()
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  })

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isMinimized) return

    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false,
    }

    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStateRef.current.isDragging || !isMinimized) return

    const deltaX = e.clientX - dragStateRef.current.startX
    const deltaY = e.clientY - dragStateRef.current.startY

    // Activación con distancia mínima de 8px (como en el original)
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > 8) {
      dragStateRef.current.hasMoved = true
    }

    if (dragStateRef.current.hasMoved) {
      // Actualizar transform en tiempo real
      window.dispatchEvent(
        new CustomEvent('drag-transform-update', {
          detail: { x: deltaX, y: deltaY },
        })
      )
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStateRef.current.isDragging || !isMinimized) return

    const deltaX = e.clientX - dragStateRef.current.startX
    const deltaY = e.clientY - dragStateRef.current.startY

    if (dragStateRef.current.hasMoved) {
      const newX = position.x - deltaX
      const newY = position.y - deltaY

      setPosition({ x: newX, y: newY })
    }

    // Reset transform
    window.dispatchEvent(
      new CustomEvent('drag-transform-update', {
        detail: { x: 0, y: 0 },
      })
    )

    dragStateRef.current.isDragging = false
    dragStateRef.current.hasMoved = false
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`${className} ${isMinimized ? 'cursor-move touch-none' : ''}`}
    >
      {children}
    </div>
  )
}

export const useDragPlayer = () => {
  return {
    DraggablePlayer,
    DragHandle,
  }
}
