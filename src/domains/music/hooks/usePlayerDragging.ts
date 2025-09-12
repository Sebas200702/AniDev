import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { useCallback, useEffect } from 'react'

export const usePlayerDragging = (
  playerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { isDraggingPlayer, setIsDraggingPlayer, setPosition, dragOffset } =
    useMusicPlayerStore()

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingPlayer) return

      const playerWidth = playerRef.current?.offsetWidth || 320
      const playerHeight = playerRef.current?.offsetHeight || 400
      const margin = window.innerWidth < 640 ? 5 : 1

      const newX = window.innerWidth - (e.clientX - dragOffset.x + playerWidth)
      const newY =
        window.innerHeight - (e.clientY - dragOffset.y + playerHeight)

      const limitedX = Math.max(
        margin,
        Math.min(newX, window.innerWidth - playerWidth - margin)
      )
      const limitedY = Math.max(margin, Math.min(newY, window.innerHeight - 50))

      setPosition({ x: limitedX, y: limitedY })
    },
    [isDraggingPlayer, dragOffset, setPosition, playerRef]
  )

  const handleMouseUp = useCallback(() => {
    setIsDraggingPlayer(false)
  }, [setIsDraggingPlayer])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingPlayer) return

      const touch = e.touches[0]
      const playerWidth = playerRef.current?.offsetWidth || 320
      const playerHeight = playerRef.current?.offsetHeight || 400
      const margin = window.innerWidth < 640 ? 5 : 10

      const newX =
        window.innerWidth - (touch.clientX - dragOffset.x + playerWidth)
      const newY =
        window.innerHeight - (touch.clientY - dragOffset.y + playerHeight)

      const limitedX = Math.max(
        margin,
        Math.min(newX, window.innerWidth - playerWidth - margin)
      )
      const limitedY = Math.max(margin, Math.min(newY, window.innerHeight - 50))

      setPosition({ x: limitedX, y: limitedY })
    },
    [isDraggingPlayer, dragOffset, setPosition, playerRef]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDraggingPlayer(false)
  }, [setIsDraggingPlayer])

  useEffect(() => {
    if (isDraggingPlayer) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [
    isDraggingPlayer,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ])
}
