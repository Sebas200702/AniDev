import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { ReactNode } from 'react'

interface DraggablePlayerProps {
  children: ReactNode
  className?: string
}

interface DragHandleProps {
  children: ReactNode
  className?: string
}

const DraggableContent = ({ children, className }: DraggablePlayerProps) => {
  const { isMinimized, position } = useMusicPlayerStore()
  const { setNodeRef, transform } = useDraggable({
    id: 'music-player-draggable',
    disabled: !isMinimized,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children}
    </div>
  )
}

export const DraggablePlayer = ({
  children,
  className,
}: DraggablePlayerProps) => {
  const { position, setPosition, setIsDragging, isMinimized } =
    useMusicPlayerStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = () => {
    if (isMinimized) setIsDragging(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false)
    const { delta } = event

    const newX = position.x - delta.x
    const newY = position.y - delta.y

    setPosition({ x: newX, y: newY })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DraggableContent className={className}>{children}</DraggableContent>
    </DndContext>
  )
}

export const DragHandle = ({ children, className }: DragHandleProps) => {
  const { isMinimized } = useMusicPlayerStore()
  const { attributes, listeners } = useDraggable({
    id: 'music-player-draggable',
    disabled: !isMinimized,
  })

  return (
    <div
      {...listeners}
      {...attributes}
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
