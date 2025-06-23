import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect } from 'react'
import type { AnimeSongWithImage } from 'types'

const SortableMusicItem = ({ song, index, isMobile }: { song: AnimeSongWithImage, index: number, isMobile: boolean }) => {
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
    opacity: isDragging ? .9 : 1,
  }


  const dragProps = isMobile ? {} : { ...attributes, ...listeners }
  const handleProps = isMobile ? { ...attributes, ...listeners } : {}

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...dragProps}
      className={`
        relative transition-all duration-200 ease-out
        ${isDragging ? 'z-50 ' : ''}
        rounded-xl md:p-2
        ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''}
        border border-transparent
      `}
    >

      {isMobile && (
        <div
          {...handleProps}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10
                   w-6 h-6 flex items-center justify-center
                   bg-zinc-800/90 rounded-md cursor-grab active:cursor-grabbing
                   hover:bg-zinc-700/90 transition-all duration-200 backdrop-blur-sm
                   border border-zinc-600/30 hover:border-zinc-500/50
                   shadow-lg touch-none select-none"
          style={{ touchAction: 'none' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-zinc-400 pointer-events-none"
          >
            <circle cx="8" cy="6" r="1.5" />
            <circle cx="8" cy="12" r="1.5" />
            <circle cx="8" cy="18" r="1.5" />
            <circle cx="16" cy="6" r="1.5" />
            <circle cx="16" cy="12" r="1.5" />
            <circle cx="16" cy="18" r="1.5" />
          </svg>
        </div>
      )}

      <div className={`transition-all duration-200 ${isMobile ? "pr-6" : ""}`}>
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
        distance: isMobile ? 5 : 8,
        delay: isMobile ? 150 : 0,
        tolerance: isMobile ? 5 : 0,
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

    const oldIndex = upcomingList.findIndex(song => song.song_id === active.id)
    const newIndex = upcomingList.findIndex(song => song.song_id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newUpcomingList = arrayMove(upcomingList, oldIndex, newIndex)
    const newCompleteList = [
      ...list.slice(0, currentSongIndex),
      currentSong,
      ...newUpcomingList
    ]

    setList(newCompleteList)
  }

  return (
    <section className="overflow-y-auto overflow-x-hidden p-4 md:max-h-[700px] max-h-96 no-scrollbar">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-100">Currently Playing</h2>
      </header>

      {currentSong && (
        <div className="mb-8 ">
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
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-600/30"></div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
               Up Next
              </h3>
              <div className="flex-1 h-px bg-gray-600/30"></div>
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
              items={upcomingList.map(song => song.song_id)}
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
