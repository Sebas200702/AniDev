import { ModalDefaultContainer } from '@shared/components/modal/modal-default-container'
import { useModal } from '@shared/hooks/useModal'
import { useEffect, useRef } from 'react'

interface UseCameraOptions {
  onPhotoTaken: (imageUrl: string, imageType: string) => void
  onCancel?: () => void
  quality?: number
  width?: number
  height?: number
}

export const useCamera = ({
  onPhotoTaken,
  onCancel,
  quality = 0.95,
  width = 1280,
  height = 720,
}: UseCameraOptions) => {
  const { openModal } = useModal()

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported in this browser.')
      return
    }

    try {
      const canvasElement = document.createElement('canvas')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: width },
          height: { ideal: height },
        },
      })

      const CameraPreview = () => {
        const videoRef = useRef<HTMLVideoElement>(null)

        useEffect(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
          }
          return () => {
            stream.getTracks().forEach((track) => track.stop())
          }
        }, [])

        const takePhoto = () => {
          if (!videoRef.current) return

          canvasElement.width = videoRef.current.videoWidth
          canvasElement.height = videoRef.current.videoHeight
          const context = canvasElement.getContext('2d')
          if (!context) return

          context.drawImage(videoRef.current, 0, 0)

          canvasElement.toBlob(
            (blob) => {
              if (!blob) return
              const imageUrl = URL.createObjectURL(blob)

              stream.getTracks().forEach((track) => track.stop())
              onPhotoTaken(imageUrl, blob.type)
            },
            'image/jpeg',
            quality
          )
        }

        const handleCancel = () => {
          stream.getTracks().forEach((track) => track.stop())
          onCancel?.()
        }

        return (
          <ModalDefaultContainer>
            <div className="flex flex-col gap-4 p-4">
              <video
                ref={videoRef}
                className=" rounded-lg h-full  object-center aspect-square"
                autoPlay
                playsInline
                muted
              />
              <div className="flex justify-center gap-4">
                <button className="button-primary" onClick={takePhoto}>
                  Take Photo
                </button>
                <button className="button-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </ModalDefaultContainer>
        )
      }

      openModal(CameraPreview)
    } catch (err) {
      alert('Unable to access camera: ' + (err as Error).message)
    }
  }

  return {
    startCamera,
  }
}
