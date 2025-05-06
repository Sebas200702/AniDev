import { useUploadImageStore } from '@store/upload-image'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import { SuperImageCropper } from 'super-image-cropper'
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
  type?: string | null
}

export const ImageEditor = ({ userName }: Props) => {
  const { image, setImage, type, setType } = useUploadImageStore()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { setUserInfo, userInfo } = useGlobalUserPreferences()
  const isGif = type?.toLowerCase()?.endsWith('gif')

  const imageCropper = useRef(new SuperImageCropper()).current
  const cropperRef = useRef<ReactCropperElement>(null)
  const editorRef = useRef<HTMLElement>(null)

  const { isDragging, dragDropProps, dropTargetRef } = useDragAndDrop({
    onDrop: (file) => {
      if (!file) return

      setType(file.type)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
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
        },
      })
    }
  }, [isLoading])

  const getCropData = async () => {
    if (!cropperRef.current?.cropper || !image) {
      toast[ToastType.Error]({ text: 'No image to crop' })
      return
    }

    setIsLoading(true)

    try {
      const cropped = isGif
        ? await imageCropper.crop({
            cropperInstance: cropperRef.current.cropper,
            src: image,
            outputType: 'base64',
          })
        : cropperRef.current.cropper.getCroppedCanvas().toDataURL()

      await submitImage(cropped as string)
      setSuccessMessage('Image uploaded successfully')
      setErrorMessage(null)
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : 'Error while uploading image'
      )
      setSuccessMessage(null)
      throw new Error(
        e instanceof Error ? e.message : 'Error while uploading image'
      )
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  const uploadImage = async (payload: Payload) => {
    try {
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
          errMsg = 'Error while uploading image'
        }
        throw new Error(errMsg)
      }

      const { data: newImage } = responseContent
      const newUserInfo = {
        name: userInfo?.name ?? '',
        avatar: newImage as string,
        type,
      }

      setUserInfo(newUserInfo)
      await saveImage(newImage)
      return newImage
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const saveImage = async (newImage: string) => {
    try {
      const saveImageRes = await fetch('/api/saveImage', {
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
          errMsg = 'Error while saving image'
        }
        throw new Error(errMsg)
      }

      return responseContent
    } catch (error) {
      console.error('Error saving image:', error)
      throw error
    }
  }

  const submitImage = async (croppedImage: string) => {
    if (!croppedImage) return
    const payload: Payload = {
      image: croppedImage,
      filename: `${normalizeString(userName)}_Avatar`,
      type,
    }

    try {
      return await uploadImage(payload)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error while uploading image'
      )
    }
  }

  const handleClose = () => {
    if (editorRef.current) {
      editorRef.current.classList.replace('opacity-100', 'opacity-0')
      editorRef.current.classList.add('pointer-events-none')
    }
  }

  const handleOpen = () => {
    if (editorRef.current) {
      editorRef.current.classList.replace('opacity-0', 'opacity-100')
      editorRef.current.classList.remove('pointer-events-none')
    }
  }

  return (
    <section
      ref={editorRef}
      className="image-editor bg-Complementary/50 pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-20 flex h-full w-full flex-col items-center justify-center opacity-0 transition-opacity duration-300"
    >
      <h2 className="text-lx font-semibold">Edit your profile image</h2>
      <div className="img-preview z-20 h-full max-h-40 w-full max-w-40 translate-y-1/2 overflow-hidden rounded-full"></div>

      <div className="bg-Complementary border-enfasisColor/40 relative flex flex-col items-center gap-10 rounded-xl border-2 p-8 pt-24">
        <button
          className="absolute top-5 right-5 cursor-pointer transition-opacity hover:opacity-70"
          onClick={handleClose}
          aria-label="Close editor"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div
          {...dragDropProps}
          ref={dropTargetRef}
          className="relative overflow-hidden rounded-md"
        >
          {isDragging && (
            <div className="bg-enfasisColor absolute inset-0 z-10 flex items-center justify-center opacity-80">
              <span className="px-4 text-center text-lg font-medium text-white">
                Drop your image here
              </span>
            </div>
          )}

          <Cropper
            preview=".img-preview"
            ref={cropperRef}
            src={image ?? '/placeholder.webp'}
            className={`h-64 w-64 transition-opacity duration-200 md:h-96 md:w-96 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={false}
            responsive={true}
            checkOrientation={false}
          />
        </div>

        <footer className="flex w-full flex-row gap-8">
          <button
            className="button-primary text-m w-full disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={getCropData}
            disabled={isLoading || !image}
          >
            {isLoading ? 'Processing...' : 'Done'}
          </button>
        </footer>
      </div>
    </section>
  )
}
