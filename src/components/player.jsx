import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export const VideoPlayer = ({ url }) => {
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
        tracks: [
          {
            kind: 'subtitles',
            src: '/spa-4.vtt',
            srclang: 'es',
            label: 'Español',
            default: true,
          },
        ],
      })

      // Configurar el recurso de video
      const videoResource = url

      // Pasar el recurso a través del proxy
      const proxyUrl = `/api/videoProxy?url=${encodeURIComponent(videoResource)}`

      // Configurar la fuente del video
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
