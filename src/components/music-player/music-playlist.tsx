import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useRef, useState } from 'react'

export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const draggedItemRef = useRef<HTMLDivElement | null>(null)

  const currentSong = list[currentSongIndex]
  const upcomingSongs = [...list].filter((_, index) => index > currentSongIndex)

  // Función para manejar el inicio del touch
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    draggedItemRef.current = e.currentTarget as HTMLDivElement
  }

  // Función para manejar el movimiento del touch
  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!draggedItemRef.current) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStartPos.current.y

    // Solo iniciar el drag si el movimiento vertical es significativo
    if (!isDragging && Math.abs(deltaY) > 10) {
      setIsDragging(true)
      setDraggedIndex(index)
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`
      draggedItemRef.current.style.opacity = '0.5'
    }

    if (isDragging) {
      e.preventDefault() // Prevenir scroll mientras se arrastra
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`

      // Encontrar el elemento sobre el que estamos
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
      } else {
        setDragOverIndex(null)
      }
    }
  }

  // Función para manejar el fin del touch
  const handleTouchEnd = () => {
    if (
      !isDragging ||
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      resetDragState()
      return
    }

    const newList = [...list]
    // Ajustar índices para las canciones siguientes (saltamos la actual)
    const realDraggedIndex = currentSongIndex + 1 + draggedIndex
    const realDropIndex = currentSongIndex + 1 + dragOverIndex

    const draggedItem = newList.splice(realDraggedIndex, 1)[0]
    const adjustedDropIndex =
      realDraggedIndex < realDropIndex ? realDropIndex - 1 : realDropIndex
    newList.splice(adjustedDropIndex, 0, draggedItem)

    setList(newList)
    resetDragState()
  }

  // Función para resetear el estado del drag
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

  // Función para manejar el inicio del drag en desktop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = 300
      canvas.height = 80

      ctx.fillStyle = 'rgba(39, 39, 42, 0.95)'
      ctx.fillRect(0, 0, 300, 80)

      ctx.strokeStyle = 'rgb(59, 130, 246)'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, 298, 78)

      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(
        upcomingSongs[index].song_title.substring(0, 30) + '...',
        10,
        30
      )
      ctx.fillStyle = 'rgb(156, 163, 175)'
      ctx.font = '12px sans-serif'
      ctx.fillText(
        (upcomingSongs[index].artist_name ?? '').substring(0, 35) + '...',
        10,
        50
      )

      e.dataTransfer.setDragImage(canvas, 150, 40)
    }
  }

  // Función para manejar el dragover en desktop
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  // Función para manejar el dragleave en desktop
  const handleDragLeave = (e: React.DragEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setDragOverIndex(null)
    }
  }

  // Función para manejar el drop en desktop
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()

    if (
      !isDragging ||
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      resetDragState()
      return
    }

    const newList = [...list]
    // Ajustar índices para las canciones siguientes (saltamos la actual)
    const realDraggedIndex = currentSongIndex + 1 + draggedIndex
    const realDropIndex = currentSongIndex + 1 + dragOverIndex

    const draggedItem = newList.splice(realDraggedIndex, 1)[0]
    const adjustedDropIndex =
      realDraggedIndex < realDropIndex ? realDropIndex - 1 : realDropIndex
    newList.splice(adjustedDropIndex, 0, draggedItem)

    setList(newList)
    resetDragState()
  }

  // Función para manejar el fin del drag en desktop
  const handleDragEnd = () => {
    resetDragState()
  }

  return (
    <section className="overflow-y-auto overflow-x-hidden p-2 max-h-96 h-full xl:max-h-[700px] no-scrollbar">
      <header className="mb-6">
        <h2 className="text-xl">Currently Playing</h2>
      </header>

      {currentSong && (
        <div className="mb-8">
          <div className="relative">
            <AnimeMusicItem
              song={currentSong}
              anime_title={currentSong.anime_title}
              banner_image={currentSong.banner_image}
              image={currentSong.image}
              placeholder={currentSong.placeholder}
              showDragHandle={false}
            />
          </div>
        </div>
      )}


      {upcomingSongs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-600/30"></div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Up next
            </h3>
            <div className="flex-1 h-px bg-gray-600/30"></div>
          </div>
        </div>
      )}

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
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={handleTouchEnd}
                className={`
                  relative transition-all duration-200 ease-in-out
                  ${isDraggedItem ? 'opacity-50 scale-98' : ''}
                  ${isDropTarget ? 'transform translate-y-1' : ''}
                  touch-none
                `}
                style={{
                  cursor: isDraggedItem ? 'grabbing' : 'grab',
                }}
              >
                {isDropTarget && (
                  <>

                    {draggedIndex !== null && draggedIndex > index && (
                      <div className="absolute -top-2 left-0 right-0 h-1 bg-enfasisColor rounded-full z-10 shadow-lg shadow-blue-500/50" />
                    )}

            
                    {draggedIndex !== null && draggedIndex < index && (
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-enfasisColor rounded-full z-10 shadow-lg shadow-blue-500/50" />
                    )}


                    <div className="absolute inset-0 bg-enfasisColor/10 rounded-lg border-2 border-enfasisColor/30 z-10 md:max-h-36 pointer-events-none" />
                  </>
                )}

                <div
                  className={`${isDraggedItem ? 'pointer-events-none' : ''}`}
                >
                  <AnimeMusicItem
                    song={song}
                    anime_title={song.anime_title}
                    banner_image={song.banner_image}
                    image={song.image}
                    placeholder={song.placeholder}
                    showDragHandle={true}
                  />
                </div>
              </div>
            )
          })}
        </ul>
      )}
    </section>
  )
}
