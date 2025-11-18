import type { MediaPlayerInstance } from '@vidstack/react'
import { useEffect, useState } from 'react'

export const usePictureInPicture = (
  playerRef: React.RefObject<MediaPlayerInstance | null>
) => {
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [isPiPSupported, setIsPiPSupported] = useState(false)

  useEffect(() => {
    // Check if PiP is supported
    setIsPiPSupported(
      'pictureInPictureEnabled' in document && document.pictureInPictureEnabled
    )

    // Listen for PiP events
    const handleEnterPiP = () => setIsPiPActive(true)
    const handleLeavePiP = () => setIsPiPActive(false)

    document.addEventListener('enterpictureinpicture', handleEnterPiP)
    document.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      document.removeEventListener('enterpictureinpicture', handleEnterPiP)
      document.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [])

  const togglePiP = async () => {
    if (!isPiPSupported || !playerRef.current) {
      console.warn('Picture-in-Picture is not supported')
      return
    }

    try {
      const videoElement = playerRef.current.el?.querySelector('video')

      if (!videoElement) {
        console.warn('Video element not found')
        return
      }

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await videoElement.requestPictureInPicture()
      }
    } catch (error) {
      console.error('Error toggling Picture-in-Picture:', error)
    }
  }

  return {
    isPiPActive,
    isPiPSupported,
    togglePiP,
  }
}
