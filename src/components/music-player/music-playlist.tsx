import { AnimeMusicItem } from '@components/music/anime-music-item'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useEffect, useState } from 'react'
import type { AnimeSongWithImage } from 'types'

const SortableMusicItem = ({
  song,
  index,
  isMobile,
}: {
  song: AnimeSongWithImage
  index: number
  isMobile: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.song_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  }

  const handleProps = { ...attributes, ...listeners }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ease-out ${isDragging ? 'z-50' : ''} rounded-xl border border-transparent`}
    >
      <div
        {...handleProps}
        className="bg-enfasisColor/50 hover:bg-enfasisColor/60 absolute top-1/2 right-0 z-10 flex h-full -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-sm shadow-lg backdrop-blur-sm transition-all duration-200 select-none active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="pointer-events-none h-4 w-4 text-white"
        >
          <circle cx="8" cy="6" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="16" cy="6" r="1.5" />
          <circle cx="16" cy="12" r="1.5" />
          <circle cx="16" cy="18" r="1.5" />
        </svg>
      </div>

      <div className="pr-6 transition-all duration-200">
        <AnimeMusicItem
          song={song}
          anime_title={song.anime_title}
          banner_image={song.banner_image}
          image={song.image}
          placeholder={song.placeholder}
        />
      </div>
    </li>
  )
}

export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [activeId, setActiveId] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isMobile ? 8 : 10,
        delay: isMobile ? 200 : 100,
        tolerance: isMobile ? 8 : 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredList = list.slice(currentSongIndex)
  const currentSong = filteredList[0]
  const upcomingList = filteredList.slice(1)

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const oldIndex = upcomingList.findIndex(
      (song) => song.song_id === active.id
    )
    const newIndex = upcomingList.findIndex((song) => song.song_id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newUpcomingList = arrayMove(upcomingList, oldIndex, newIndex)
    const newCompleteList = [
      ...list.slice(0, currentSongIndex),
      currentSong,
      ...newUpcomingList,
    ]

    setList(newCompleteList)
  }

  return (
    <section className="no-scrollbar max-h-96 overflow-y-auto px-4 md:max-h-[700px] md:pr-20 md:pl-15">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Currently Playing
        </h2>
      </header>

      {currentSong && (
        <div className="mb-8">
          <AnimeMusicItem
            song={currentSong}
            anime_title={currentSong.anime_title}
            banner_image={currentSong.banner_image}
            image={currentSong.image}
            placeholder={currentSong.placeholder}
          />
        </div>
      )}

      {upcomingList.length > 0 && (
        <>
          <header className="mb-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-600/30"></div>
              <h3 className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Up Next
              </h3>
              <div className="h-px flex-1 bg-gray-600/30"></div>
            </div>
          </header>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={upcomingList.map((song) => song.song_id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex flex-col gap-3">
                {upcomingList.map((song, index) => (
                  <SortableMusicItem
                    key={song.song_id}
                    song={song}
                    index={index}
                    isMobile={isMobile}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      )}
    </section>
  )
}
