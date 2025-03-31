import { useUploadImageStore } from '@store/upload-image'
import { useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import '@styles/cropper.css'
import { CloseIcon } from '@components/icons/close-icon'
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
  const { image } = useUploadImageStore()
  const [cropData, setCropData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { setUserInfo, userInfo } = useGlobalUserPreferences()

  const cropperRef = useRef<ReactCropperElement>(null)

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
    $imageEditor?.classList.replace('flex', 'hidden')
  }

  return (
    <section className="image-editor flex-col items-center justify-center absolute z-20 top-0 left-0 right-0 bottom-0 bg-Complementary/50 w-full h-full hidden">
      <h2 className="text-lx font-semibold">Edit your profile image</h2>
      <div
        className="img-preview overflow-hidden rounded-full translate-y-1/2 z-30"
        style={{ width: '100%', height: '150px' }}
      ></div>

      <div className="bg-Complementary pt-24 p-8 rounded-xl flex flex-col gap-10 items-center border-2 border-enfasisColor/40 relative">
        <button
          className="absolute top-5 right-5 cursor-pointer"
          onClick={handleClose}
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="rounded-md overflow-hidden">
          <Cropper
            preview=".img-preview"
            ref={cropperRef}
            src={image ?? '/placeholder.webp'}
            className="w-64 h-64 md:w-96 md:h-96"
            initialAspectRatio={1}
            aspectRatio={1}
            guides={false}
          />
        </div>

        <footer className="flex gap-8 flex-row w-full">
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
