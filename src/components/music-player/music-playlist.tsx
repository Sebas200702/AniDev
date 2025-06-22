import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useRef, useState } from 'react'

export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const mouseStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const draggedItemRef = useRef<HTMLDivElement | null>(null)

  const currentSong = list[currentSongIndex]
  const upcomingSongs = [...list].filter((_, index) => index > currentSongIndex)

  // Touch Events (Mobile)
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (!(e.target as HTMLElement).closest('.drag-handle')) return

    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    draggedItemRef.current = e.currentTarget as HTMLDivElement
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!draggedItemRef.current) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStartPos.current.y

    if (!isDragging && Math.abs(deltaY) > 10) {
      setIsDragging(true)
      setDraggedIndex(index)
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`
      draggedItemRef.current.style.opacity = '0.5'
    }

    if (isDragging) {
      e.preventDefault()
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`

      const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
      const droppableElement = elements.find(
        (el) => el.hasAttribute('data-index') && el !== draggedItemRef.current
      ) as HTMLElement

      if (droppableElement) {
        const newIndex = parseInt(
          droppableElement.getAttribute('data-index') || '-1'
        )
        if (newIndex !== -1 && newIndex !== dragOverIndex) {
          setDragOverIndex(newIndex)
        }
      }
    }
  }

  const handleTouchEnd = () => {
    if (
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      resetDragState()
      return
    }

    performDrop()
  }

  // Mouse Events (PC)
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    // Solo iniciar si el click comenzó en el drag handle
    if (!(e.target as HTMLElement).closest('.drag-handle')) return

    mouseStartPos.current = { x: e.clientX, y: e.clientY }
    draggedItemRef.current = e.currentTarget as HTMLDivElement

    // Agregar event listeners globales para mouse move y up
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    e.preventDefault()
    e.stopPropagation()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedItemRef.current) return

    const deltaY = e.clientY - mouseStartPos.current.y

    if (!isDragging && Math.abs(deltaY) > 10) {
      setIsDragging(true)
      // Encontrar el índice del elemento que se está arrastrando
      const draggedElement = draggedItemRef.current
      const index = parseInt(draggedElement.getAttribute('data-index') || '-1')
      setDraggedIndex(index)
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`
      draggedItemRef.current.style.opacity = '0.5'
    }

    if (isDragging) {
      e.preventDefault()
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`

      const elements = document.elementsFromPoint(e.clientX, e.clientY)
      const droppableElement = elements.find(
        (el) => el.hasAttribute('data-index') && el !== draggedItemRef.current
      ) as HTMLElement

      if (droppableElement) {
        const newIndex = parseInt(
          droppableElement.getAttribute('data-index') || '-1'
        )
        if (newIndex !== -1 && newIndex !== dragOverIndex) {
          setDragOverIndex(newIndex)
        }
      }
    }
  }

  const handleMouseUp = () => {
    // Remover event listeners globales
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    if (
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      resetDragState()
      return
    }

    performDrop()
  }

  const performDrop = () => {
    const newList = [...list]
    // Ajustar índices para las canciones siguientes (saltamos la actual)
    const realDraggedIndex = currentSongIndex + 1 + draggedIndex!
    const realDropIndex = currentSongIndex + 1 + dragOverIndex!

    const draggedItem = newList.splice(realDraggedIndex, 1)[0]
    const adjustedDropIndex =
      realDraggedIndex < realDropIndex ? realDropIndex - 1 : realDropIndex
    newList.splice(adjustedDropIndex, 0, draggedItem)

    setList(newList)
    resetDragState()
  }

  const resetDragState = () => {
    if (draggedItemRef.current) {
      draggedItemRef.current.style.transform = ''
      draggedItemRef.current.style.opacity = ''
    }
    setIsDragging(false)
    setDraggedIndex(null)
    setDragOverIndex(null)
    draggedItemRef.current = null
  }

  return (
    <section className="overflow-y-auto overflow-x-hidden p-2 max-h-96 h-full xl:max-h-[700px] no-scrollbar">
      <header className="mb-6">
        <h2 className="text-xl">Currently Playing</h2>
      </header>

      {/* Canción Actual */}
      {currentSong && (
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-enfasisColor rounded-full" />
            <div className="pl-4">
              <AnimeMusicItem
                song={currentSong}
                anime_title={currentSong.anime_title}
                banner_image={currentSong.banner_image}
                image={currentSong.image}
                placeholder={currentSong.placeholder}
              />
            </div>
          </div>
        </div>
      )}

      {/* Separador y Subtítulo */}
      {upcomingSongs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-600/30"></div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Up Next
            </h3>
            <div className="flex-1 h-px bg-gray-600/30"></div>
          </div>
        </div>
      )}

      {/* Lista de Canciones Siguientes */}
      {upcomingSongs.length > 0 && (
        <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
          {upcomingSongs.map((song, index) => {
            const isDraggedItem = draggedIndex === index
            const isDropTarget =
              dragOverIndex === index &&
              draggedIndex !== null &&
              draggedIndex !== index

            return (
              <div
                key={song.song_id}
                data-index={index}
                className={`
                  relative transition-all duration-200 ease-in-out
                  ${isDraggedItem ? 'opacity-50 scale-98' : ''}
                  ${isDropTarget ? 'transform translate-y-1' : ''}
                `}
              >
                <div
                  className="relative flex items-center"
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={(e) => handleTouchMove(e, index)}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                >
                  {/* Drag handle visible en todas las pantallas */}
                  <div className="drag-handle absolute left-0 z-20 touch-none flex items-center justify-center w-8 h-full cursor-grab active:cursor-grabbing">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <circle cx="9" cy="6" r="2" />
                      <circle cx="9" cy="12" r="2" />
                      <circle cx="9" cy="18" r="2" />
                      <circle cx="15" cy="6" r="2" />
                      <circle cx="15" cy="12" r="2" />
                      <circle cx="15" cy="18" r="2" />
                    </svg>
                  </div>

                  {isDropTarget && (
                    <>
                      <div className="absolute -top-2 left-0 right-0 h-1 bg-enfasisColor rounded-full z-10 shadow-lg shadow-blue-500/50" />
                      <div className="absolute inset-0 bg-enfasisColor/10 rounded-lg border-2 border-enfasisColor/30 z-10 md:max-h-36 pointer-events-none aspect-[100/28] ml-8" />
                    </>
                  )}

                  <div
                    className={`
                    w-full pl-8
                    ${isDraggedItem ? 'pointer-events-none' : ''}
                  `}
                  >
                    <AnimeMusicItem
                      song={song}
                      anime_title={song.anime_title}
                      banner_image={song.banner_image}
                      image={song.image}
                      placeholder={song.placeholder}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </ul>
      )}
    </section>
  )
}
