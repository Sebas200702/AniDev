import  { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export const VideoPlayer = ({ url, sutitles }) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Inicializar el reproductor con video.js
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        responsive: true,
        fluid: true,
        tracks: sutitles,
      })

      const videoResource = url


      const proxyUrl = `/api/videoProxy?url=${encodeURIComponent(videoResource)}`

 
      playerRef.current.src({
        src: proxyUrl,
        type: 'application/vnd.apple.mpegurl',
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div className="video-container">
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  )
}
