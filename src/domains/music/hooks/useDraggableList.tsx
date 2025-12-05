import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { AnimeSong } from '@music/types'
import { ListSortIcon } from '@shared/components/icons/music/list-sort-icon'
import { useState } from 'react'
import { usePlaylist } from './usePlaylist'

interface DraggableListProps {
  children: React.ReactNode
  items: AnimeSong[]
}

interface DraggableItemProps {
  children: React.ReactNode
  id: number
}

export const useDraggableList = () => {
  const DraggableList = ({ children, items }: DraggableListProps) => {
    const [activeId, setActiveId] = useState<string | number | null>(null)
    const { updateList } = usePlaylist()
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
          delay: 100,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    )
    const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id)
    }

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.theme_id === activeId)
        const newIndex = items.findIndex((item) => item.theme_id === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex)
          console.log('New Items Order:', newItems)
          updateList(newItems)
        }
      }
      setActiveId(null)
    }

    return (
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.theme_id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      </DndContext>
    )
  }

  const DraggableItem = ({ id, children }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
    return (
      <div
        className="flex items-center justify-center gap-4"
        style={style}
        {...attributes}
      >
        <div
          ref={setNodeRef}
          {...listeners}
          className=" flex h-full  cursor-grab touch-none items-center justify-center  p-1  select-none  active:cursor-grabbing"
        >
          <ListSortIcon className="h-4 w-4 text-Primary-200" />
        </div>
        {children}
      </div>
    )
  }

  return { DraggableList, DraggableItem }
}
