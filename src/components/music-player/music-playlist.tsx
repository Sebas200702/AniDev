import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useRef, useState } from 'react'

export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const draggedItemRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredList = [...list].filter((_, index) => index >= currentSongIndex)

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    // Verificar si el toque comenzó en el drag handle
    const target = e.target as HTMLElement
    if (!target.closest('.drag-handle')) return

    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    draggedItemRef.current = (e.currentTarget as HTMLElement).closest('[data-index]') as HTMLDivElement
    
    if (draggedItemRef.current) {
      draggedItemRef.current.style.zIndex = '50'
      setDraggedIndex(index)
    }

    e.preventDefault()
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!draggedItemRef.current || draggedIndex === null) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStartPos.current.y

    // Iniciar el arrastre solo después de un movimiento significativo
    if (!isDragging && Math.abs(deltaY) > 5) {
      setIsDragging(true)
      draggedItemRef.current.style.position = 'relative'
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`
      draggedItemRef.current.style.opacity = '0.9'
    }

    if (isDragging) {
      e.preventDefault()
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`

      // Encontrar el elemento sobre el que estamos
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
      const dropTarget = elements.find(el => {
        const itemEl = el.closest('[data-index]') as HTMLElement
        return itemEl && itemEl !== draggedItemRef.current
      })

      if (dropTarget) {
        const itemEl = dropTarget.closest('[data-index]') as HTMLElement
        if (itemEl) {
          const newIndex = parseInt(itemEl.getAttribute('data-index') || '-1')
          if (newIndex !== -1 && newIndex !== dragOverIndex) {
            setDragOverIndex(newIndex)
          }
        }
      }
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || draggedIndex === null || dragOverIndex === null) {
      resetDragState()
      return
    }

    // Realizar el reordenamiento
    const newList = [...list]
    const realDraggedIndex = currentSongIndex + draggedIndex
    const realDropIndex = currentSongIndex + dragOverIndex

    const [draggedItem] = newList.splice(realDraggedIndex, 1)
    const adjustedDropIndex =
      realDraggedIndex < realDropIndex ? realDropIndex - 1 : realDropIndex
    newList.splice(adjustedDropIndex, 0, draggedItem)

    setList(newList)
    resetDragState()
  }

  const resetDragState = () => {
    if (draggedItemRef.current) {
      draggedItemRef.current.style.position = ''
      draggedItemRef.current.style.transform = ''
      draggedItemRef.current.style.opacity = ''
      draggedItemRef.current.style.zIndex = ''
    }
    setIsDragging(false)
    setDraggedIndex(null)
    setDragOverIndex(null)
    draggedItemRef.current = null
  }

  return (
    <section className="overflow-y-auto overflow-x-hidden p-2">
      <header className="mb-6">
        <h2 className="text-xl">Currently Playing</h2>
      </header>
      <ul 
        ref={listRef}
        className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1"
      >
        {filteredList.map((song, index) => {
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
                ${isDraggedItem ? 'touch-none' : ''}
                ${isDropTarget ? 'transform translate-y-4' : ''}
              `}
            >
              <div
                className="relative flex items-center"
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={handleTouchEnd}
              >
                {/* Drag Handle con mejor área táctil */}
                <div className="drag-handle md:hidden absolute left-0 z-20 flex items-center justify-center w-12 h-full touch-none">
                  <div className="w-8 h-12 flex items-center justify-center bg-zinc-800/50 rounded-l-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-gray-400"
                    >
                      <circle cx="9" cy="6" r="2" />
                      <circle cx="9" cy="12" r="2" />
                      <circle cx="9" cy="18" r="2" />
                      <circle cx="15" cy="6" r="2" />
                      <circle cx="15" cy="12" r="2" />
                      <circle cx="15" cy="18" r="2" />
                    </svg>
                  </div>
                </div>

                {/* Indicador de drop target */}
                {isDropTarget && (
                  <>
                    <div className="absolute -top-2 left-0 right-0 h-1 bg-enfasisColor rounded-full z-10 shadow-lg shadow-blue-500/50" />
                    <div className="absolute inset-0 bg-enfasisColor/10 rounded-lg border-2 border-enfasisColor/30 z-10 pointer-events-none" />
                  </>
                )}

                {/* Contenedor principal */}
                <div className={`
                  w-full pl-10 md:pl-0
                  ${isDragging ? 'touch-none' : ''}
                `}>
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
    </section>
  )
}