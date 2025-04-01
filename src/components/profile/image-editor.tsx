import { useUploadImageStore } from '@store/upload-image'
import { useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import '@styles/cropper.css'
import { CloseIcon } from '@components/icons/close-icon'
import { useDragAndDrop } from '@hooks/useDragAndDrop'
import { toast } from '@pheralb/toast'
import { useGlobalUserPreferences } from '@store/global-user'

import { ToastType } from 'types'

interface Props {
  userName: string
}

interface Payload {
  image: string
  filename: string
}

export const ImageEditor = ({ userName }: Props) => {
  const { image, setImage } = useUploadImageStore()
  const [cropData, setCropData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { setUserInfo, userInfo } = useGlobalUserPreferences()

  const cropperRef = useRef<ReactCropperElement>(null)

  const { isDragging, dragDropProps, dropTargetRef } = useDragAndDrop({
    onDropDataUrl: (dataUrl) => setImage(dataUrl),
  })

  useEffect(() => {
    if (isLoading) {
      toast[ToastType.Loading]({
        text: 'Uploading Image',
        options: {
          promise: getCropData(),
          success: successMessage ?? 'Done',
          error: errorMessage ?? 'Error',

          autoDismiss: true,
          onSuccess: () => {
            console.log('Success')
          },
          onError: () => {
            console.log('Error')
          },
        },
      })
    }
  }, [isLoading])

  const getCropData = async () => {
    if (cropperRef.current?.cropper) {
      setIsLoading(true)
      const croppedData = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL()
      setCropData(croppedData)
      await submitImage(croppedData)
    }
  }

  const uploadImage = async (payload: Payload) => {
    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    })

    const responseContent = await response.json()

    if (!response.ok) {
      let errMsg: string

      if (typeof responseContent === 'object' && responseContent.message) {
        errMsg = responseContent.message
      } else if (typeof responseContent === 'string') {
        errMsg = responseContent
      } else {
        errMsg = 'Error en la solicitud'
      }
      throw new Error(errMsg)
    }

    const { data: newImage } = responseContent
    const newUserInfo = {
      name: userInfo?.name ?? '',
      avatar: newImage as string,
    }

    setUserInfo(newUserInfo)
    await saveImage(newImage)
  }

  const saveImage = async (newImage: string) => {
    const saveImageRes = await fetch('api/saveImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newImage),
      credentials: 'include',
    })
    const responseContent = await saveImageRes.json()

    if (!saveImageRes.ok) {
      let errMsg: string

      if (typeof responseContent === 'object' && responseContent.message) {
        errMsg = responseContent.message
      } else if (typeof responseContent === 'string') {
        errMsg = responseContent
      } else {
        errMsg = 'Error en la solicitud'
      }
      throw new Error(errMsg)
    }
  }

  const submitImage = async (croppedImage: string) => {
    if (!croppedImage) return

    const payload = {
      image: croppedImage,
      filename: `${userName}_Avatar`,
    }
    try {
      await uploadImage(payload)

      setSuccessMessage('Imagen actualizada correctamente')
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error en la solicitud'
      setErrorMessage(errorMsg)
    } finally {
      handleClose()
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    const $imageEditor = document.querySelector('.image-editor')
    $imageEditor?.classList.replace('opacity-100', 'opacity-0')
    $imageEditor?.classList.add('pointer-events-none')
  }

  return (
    <section className="image-editor bg-Complementary/50 absolute top-0 right-0 bottom-0 left-0 z-20 pointer-events-none flex opacity-0 h-full w-full flex-col items-center justify-center">
      <h2 className="text-lx font-semibold">Edit your profile image</h2>
      <div className="img-preview w-full h-full max-w-40 max-h-40 rounded-full overflow-hidden translate-y-1/2 z-20"></div>

      <div className="bg-Complementary border-enfasisColor/40 relative flex flex-col items-center gap-10 rounded-xl border-2 p-8 pt-24">
        <button
          className="absolute top-5 right-5 cursor-pointer"
          onClick={handleClose}
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div
          {...dragDropProps}
          ref={dropTargetRef}
          className="relative overflow-hidden rounded-md"
        >
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-enfasisColor opacity-80 z-10">
              <span className="text-white text-lg font-medium text-center px-4">
                Drop your image here
              </span>
            </div>
          )}

          <Cropper
            preview=".img-preview"
            ref={cropperRef}
            src={image ?? '/placeholder.webp'}
            className={`h-64 w-64 md:h-96 md:w-96 transition-opacity duration-200 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={false}
          />
        </div>

        <footer className="flex w-full flex-row gap-8">
          <button
            className="button-primary text-m w-full"
            onClick={getCropData}
          >
            Done
          </button>
        </footer>
      </div>
    </section>
  )
}
