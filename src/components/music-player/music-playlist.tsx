import { AnimeMusicItem } from '@components/music/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useRef, useState } from 'react'


export const MusicPlayList = () => {
  const { list, currentSongIndex, setList } = useMusicPlayerStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const filteredList = [...list].filter((_, index) => index >= currentSongIndex)

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
        filteredList[index].song_title.substring(0, 30) + '...',
        10,
        30
      )
      ctx.fillStyle = 'rgb(156, 163, 175)'
      ctx.font = '12px sans-serif'
      ctx.fillText(
        (filteredList[index].artist_name ?? '').substring(0, 35) + '...',
        10,
        50
      )

      e.dataTransfer.setDragImage(canvas, 150, 40)
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

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

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newList = [...list]

    const realDraggedIndex = currentSongIndex + draggedIndex
    const realDropIndex = currentSongIndex + dropIndex

    const draggedItem = newList.splice(realDraggedIndex, 1)[0]

    const adjustedDropIndex =
      realDraggedIndex < realDropIndex ? realDropIndex - 1 : realDropIndex
    newList.splice(adjustedDropIndex, 0, draggedItem)

    setList(newList)
    setDraggedIndex(null)
    setDragOverIndex(null)
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    dragStartPos.current = { x: e.clientX, y: e.clientY }
  }

  return (
    <section className=" overflow-y-auto overflow-x-hidden p-2">
      <header className="mb-6">
        <h2 className="text-xl">Currently Playing</h2>
      </header>
      <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
        {filteredList.map((song, index) => {
          const isDraggedItem = draggedIndex === index
          const isDropTarget =
            dragOverIndex === index &&
            draggedIndex !== null &&
            draggedIndex !== index

          return (
            <div
              key={song.song_id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onMouseDown={(e) => handleMouseDown(e, index)}
              className={`
              relative transition-all duration-200 ease-in-out
              ${isDraggedItem ? 'opacity-50 scale-98' : ''}
              ${isDropTarget ? 'transform translate-y-1' : ''}
            `}
              style={{
                cursor: isDraggedItem ? 'grabbing' : 'grab',
              }}
            >
              {isDropTarget && (
                <div className="absolute -top-2 left-0 right-0 h-1 bg-enfasisColor rounded-full z-10 shadow-lg shadow-blue-500/50" />
              )}

              {isDropTarget && (
                <div className="absolute inset-0 bg-enfasisColor/10 rounded-lg border-2 border-enfasisColor/30 z-10 pointer-events-none aspect-[100/28]" />
              )}

              <div className={`${isDraggedItem ? 'pointer-events-none' : ''}`}>
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
    </section>
  )
}
