import { useUploadImageStore } from '@store/upload-image'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import { SuperImageCropper } from 'super-image-cropper'
import '@styles/cropper.css'
import { CloseIcon } from '@components/icons/close-icon'
import { ModalDefaultContainer } from '@components/modal/modal-default-container'
import { useDragAndDrop } from '@hooks/useDragAndDrop'
import { useModal } from '@hooks/useModal'
import { toast } from '@pheralb/toast'
import { useGlobalUserPreferences } from '@store/global-user'

import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { ToastType } from 'types'

/**
 * Props interface for the ImageEditor component.
 *
 * @interface Props
 * @property {string} userName - The username of the current user for avatar naming.
 */
interface Props {
  userName: string
}

/**
 * Payload interface for image upload.
 *
 * @interface Payload
 * @property {string} image - The base64 encoded image data.
 * @property {string} filename - The name for the uploaded file.
 * @property {string | null} [type] - The MIME type of the image.
 */
interface Payload {
  image: string
  filename: string
  type?: string | null
}

/**
 * ImageEditor component provides a modal interface for editing and uploading profile images.
 *
 * @description This component renders a modal editor for cropping and uploading profile images.
 * It supports drag and drop functionality, image cropping with aspect ratio preservation,
 * and handles both static images and GIFs differently. The component includes a preview
 * of the cropped image and provides visual feedback during the upload process.
 *
 * The editor features:
 * - Drag and drop image upload
 * - Real-time image cropping with preview
 * - Support for both static images and GIFs
 * - Loading states and error handling
 * - Toast notifications for operation feedback
 * - Responsive design for different screen sizes
 *
 * The component integrates with the application's image upload and user preferences stores
 * to manage the upload process and update the user's profile information. It includes
 * proper error handling and validation for the upload process.
 *
 * @param {Props} props - The component props
 * @param {string} props.userName - The username used for generating the avatar filename
 * @returns {JSX.Element} The rendered image editor modal with cropping interface
 *
 * @example
 * <ImageEditor userName="john_doe" />
 */
export const ImageEditor = ({ userName }: Props) => {
  const { image, setImage, type, setType } = useUploadImageStore()
  const { closeModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { setUserInfo, userInfo } = useGlobalUserPreferences()
  const isGif = type?.toLowerCase()?.endsWith('gif')

  const imageCropper = useRef(new SuperImageCropper()).current
  const cropperRef = useRef<ReactCropperElement>(null)

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
      closeModal()
      // Cerrar el modal del sistema nuevo
    }
  }

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
  }, [isLoading, successMessage, errorMessage])

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

  // Removido: if (!isEditorVisible) return null
  // Ahora el modal se controla desde el sistema de modal global

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lx font-semibold">Edit your profile image</h2>
      <div className="img-preview !z-20 !h-40 !w-40 overflow-hidden rounded-full"></div>
      <ModalDefaultContainer>
        <button
          className="absolute top-5 right-5 cursor-pointer transition-opacity hover:opacity-70"
          onClick={() => {
            closeModal()
          }}
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
            src={createImageUrlProxy(
              image || `${baseUrl}/placeholder.webp`,
              '0',
              '70',
              'webp'
            )}
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
      </ModalDefaultContainer>
    </div>
  )
}
