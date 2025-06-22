import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useRef, useState } from 'react'

export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const draggedItemRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredList = [...list].filter((_, index) => index >= currentSongIndex)
  const currentSong = filteredList[0]
  const upcomingList = filteredList.slice(1)

  const initiateDrag = (clientX: number, clientY: number, index: number, element: HTMLElement) => {
    startPos.current = { x: clientX, y: clientY }
    draggedItemRef.current = element.closest('[data-index]') as HTMLDivElement
    if (draggedItemRef.current) {
      draggedItemRef.current.style.zIndex = '50'
      setDraggedIndex(index)
    }
  }

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    initiateDrag(e.clientX, e.clientY, index, e.currentTarget as HTMLElement)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedItemRef.current || draggedIndex === null) return
    const deltaY = e.clientY - startPos.current.y
    if (!isDragging && Math.abs(deltaY) > 5) {
      setIsDragging(true)
      draggedItemRef.current.style.position = 'relative'
      draggedItemRef.current.style.opacity = '0.9'
    }
    if (isDragging) {
      draggedItemRef.current.style.transform = `translateY(${deltaY}px)`
      const elements = document.elementsFromPoint(e.clientX, e.clientY)
      const dropTarget = elements.find(el => {
        const itemEl = el.closest('[data-index]') as HTMLElement
        return itemEl && itemEl !== draggedItemRef.current
      })
      if (dropTarget) {
        const itemEl = dropTarget.closest('[data-index]') as HTMLElement
        const newIndex = parseInt(itemEl.getAttribute('data-index') || '-1')
        if (newIndex >= 1 && newIndex !== dragOverIndex) setDragOverIndex(newIndex)
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedItemRef.current) e.currentTarget.releasePointerCapture(e.pointerId)
    if (!isDragging || draggedIndex === null || dragOverIndex === null) {
      resetDragState()
      return
    }
    const newList = [...list]
    const realDragged = currentSongIndex + draggedIndex
    const realDrop = currentSongIndex + dragOverIndex
    const [item] = newList.splice(realDragged, 1)
    const dropIdx = realDragged < realDrop ? realDrop - 1 : realDrop
    newList.splice(dropIdx, 0, item)
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
      <header className="mb-4">
        <h2 className="text-xl">Currently Playing</h2>
      </header>
      {currentSong && (
        <div className="mb-6">
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
          <h3 className="text-lg mb-2">Up next</h3>
          <ul ref={listRef} className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
            {upcomingList.map((song, i) => {
              const index = i + 1
              const isDragged = draggedIndex === index
              const isDrop = dragOverIndex === index && draggedIndex !== null && draggedIndex !== index
              return (
                <div key={song.song_id} data-index={index}
                  className={`relative transition-all duration-200 ease-in-out ${isDragged ? 'touch-none' : ''} ${isDrop ? 'transform translate-y-4' : ''}`}
                  onPointerDown={e => handlePointerDown(e, index)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >
                  {isDrop && (
                    <>
                      <div className="absolute -top-2 left-0 right-0 h-1 bg-enfasisColor rounded-full z-10 shadow-lg shadow-blue-500/50" />
                      <div className="absolute inset-0 bg-enfasisColor/10 rounded-lg border-2 border-enfasisColor/30 z-10 pointer-events-none" />
                    </>
                  )}
                  <div className={`w-full ${isDragging ? 'touch-none' : ''}`}>
                    <AnimeMusicItem
                      song={song}
                      anime_title={song.anime_title}
                      banner_image={song.banner_image}
                      image={song.image}
                      placeholder={song.placeholder}
                    />
                  </div>
                </div>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
