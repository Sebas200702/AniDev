import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useRef, useState, useMemo } from 'react'

export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const draggedItemRef = useRef<HTMLLIElement | null>(null)

  const currentSong = list[currentSongIndex]
  const upcomingSongs = list.slice(currentSongIndex + 1)

  // Memoizar detección de móvil
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent)
  }, [])

  // Al tocar el handle
  const handleTouchStartOnHandle = (
    e: React.TouchEvent,
    index: number
  ) => {
    e.stopPropagation()
    const { clientX: x, clientY: y } = e.touches[0]
    touchStartPos.current = { x, y }
    const li = e.currentTarget.closest('li[data-index]') as HTMLLIElement
    draggedItemRef.current = li
  }

  const handleTouchMoveOnHandle = (
    e: React.TouchEvent,
    index: number
  ) => {
    // parar scroll desde el primer momento
    e.stopPropagation()
    e.preventDefault()

    if (!draggedItemRef.current) return

    const { clientY } = e.touches[0]
    const deltaY = clientY - touchStartPos.current.y

    if (!isDragging && Math.abs(deltaY) > 10) {
      setIsDragging(true)
      setDraggedIndex(index)
      // deshabilitar touch-action para que no scrollée
      draggedItemRef.current.classList.add('touch-none')
      draggedItemRef.current.style.opacity = '0.5'
    }

    if (isDragging) {
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`

      // identificar elemento bajo el dedo
      const elems = document.elementsFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      )
      const over = elems.find(
        (el) => el instanceof HTMLElement
          && el.hasAttribute('data-index')
          && el !== draggedItemRef.current
      ) as HTMLElement | undefined

      if (over) {
        const newIndex = Number(over.getAttribute('data-index'))
        if (newIndex !== dragOverIndex) {
          setDragOverIndex(newIndex)
        }
      } else {
        setDragOverIndex(null)
      }
    }
  }

  const handleTouchEndOnHandle = () => {
    if (
      !isDragging ||
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      cleanup()
      return
    }

    // recalcular índices en la lista completa
    const realFrom = currentSongIndex + 1 + draggedIndex
    const realTo = currentSongIndex + 1 + dragOverIndex
    const newList = [...list]
    const [moved] = newList.splice(realFrom, 1)
    // ajustar si baja
    const insertAt = realFrom < realTo ? realTo - 1 : realTo
    newList.splice(insertAt, 0, moved)

    setList(newList)
    cleanup()
  }

  const cleanup = () => {
    if (draggedItemRef.current) {
      draggedItemRef.current.style.transform = ''
      draggedItemRef.current.style.opacity = ''
      draggedItemRef.current.classList.remove('touch-none')
    }
    setIsDragging(false)
    setDraggedIndex(null)
    setDragOverIndex(null)
    draggedItemRef.current = null
  }

  const DragHandle = ({ index }: { index: number }) => (
    <div
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 cursor-grab active:cursor-grabbing md:hidden touch-none"
      onTouchStart={(e) => handleTouchStartOnHandle(e, index)}
      onTouchMove={(e) => handleTouchMoveOnHandle(e, index)}
      onTouchEnd={handleTouchEndOnHandle}
    >
      {/* icono… */}
    </div>
  )

  return (
    <section className="overflow-y-auto overflow-x-hidden p-2 max-h-96 no-scrollbar">
      {/* … “Currently Playing” … */}
      <ul className="grid grid-cols-1 gap-4 list-none">
        {upcomingSongs.map((song, idx) => {
          const isDragged = draggedIndex === idx
          const isDropTarget = dragOverIndex === idx && draggedIndex !== null

          return (
            <li
              key={song.song_id}
              data-index={idx}
              className={`
                relative transition-all duration-200
                ${isDragged ? 'opacity-50 scale-95' : ''}
                ${isDropTarget ? 'translate-y-1' : ''}
              `}
            >
              {isMobile && <DragHandle index={idx} />}
              <div className={isMobile ? 'ml-8' : ''}>
                <AnimeMusicItem
                  song={song}
                  anime_title={song.anime_title}
                  banner_image={song.banner_image}
                  image={song.image}
                  placeholder={song.placeholder}
                  showDragHandle={true}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
