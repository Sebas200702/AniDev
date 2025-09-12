import { useUpdateProfile } from '@user/stores/update-profile'
import { useRef } from 'react'
import { Cropper } from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import { SuperImageCropper } from 'super-image-cropper'
import '@user/styles/cropper.css'
import { toast } from '@pheralb/toast'
import { useDragAndDrop } from '@shared/hooks/useDragAndDrop'
import { useModal } from '@shared/hooks/useModal'
import { useProfileImage } from '@user/hooks/useProfileImage'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'
import { ToastType } from 'types'
import type { DataImage } from 'types'
import { ChangeImages } from './change-images'

/**
 * Payload interface for image upload.
 *
 * @interface Payload
 * @property {string} image - The base64 encoded image data.
 * @property {string} filename - The name for the uploaded file.
 * @property {string | null} [type] - The MIME type of the image.
 */

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
export const ImageEditor = ({ type = 'avatar' }: DataImage) => {
  const { setAvatar, setAvatarType, setBannerImage, setBannerType } =
    useUpdateProfile()
  const { openModal } = useModal()

  const imageCropper = useRef(new SuperImageCropper()).current
  const cropperRef = useRef<ReactCropperElement>(null)
  const isAvatar = type === 'avatar'
  const { imgSrc: cropSrc } = useProfileImage({
    type: isAvatar ? 'avatar' : 'banner',
    baseUrl: `${baseUrl}/placeholder.webp`,
    width: isAvatar ? '0' : '1080',
    quality: '75',
    format: 'webp',
  })

  const { isDragging, dragDropProps, dropTargetRef } = useDragAndDrop({
    onDrop: (file) => {
      if (!file) return
      const blobUrl = URL.createObjectURL(file)
      if (isAvatar) {
        setAvatar(blobUrl)
        setAvatarType(file.type)
      } else {
        setBannerType(file.type)
        setBannerImage(blobUrl)
      }
    },
  })

  const getCropData = async () => {
    if (!cropperRef.current?.cropper) {
      toast[ToastType.Error]({ text: 'No image to crop' })
      return
    }

    const cropped = await imageCropper.crop({
      cropperInstance: cropperRef.current.cropper,
      src: cropSrc || '',
      outputType: 'blobURL',
    })

    submitImage(cropped as string)
  }

  const submitImage = (croppedImage: string) => {
    if (!croppedImage) return

    if (isAvatar) {
      setAvatar(croppedImage)
    } else {
      setBannerImage(croppedImage)
    }
    openModal(ChangeImages, { type })
  }
  const handleClickCancel = () => {
    openModal(ChangeImages, { type })
  }

  return (
    <ModalDefaultContainer>
      <div className="flex flex-col items-center justify-center md:w-[40vw] w-[80vw] gap-10">
        <header className="w-full flex justify-between">
          <h2 className="text-lx text-center w-full">Edit yor image</h2>
        </header>

        <div
          className={`img-preview !z-20   overflow-hidden ${isAvatar ? 'rounded-full !h-40 !w-40' : '!w-full !md:aspect-[1080/300] !aspect-[1080/300]'}`}
        ></div>

        <div
          {...dragDropProps}
          ref={dropTargetRef}
          className="relative overflow-hidden rounded-md w-full"
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
            src={
              cropSrc ||
              createImageUrlProxy(
                `${baseUrl}/placeholder.webp`,
                '0',
                '70',
                'webp'
              )
            }
            initialAspectRatio={isAvatar ? 1 : 1080 / 300}
            aspectRatio={isAvatar ? 1 : 1080 / 300}
            guides={false}
            responsive={true}
            checkOrientation={false}
          />
        </div>

        <footer className="flex w-full flex-row gap-3">
          <button
            className="button-primary text-m w-full disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={getCropData}
            disabled={!cropSrc}
          >
            Done
          </button>
          <button
            className="button-secondary text-m w-full"
            onClick={handleClickCancel}
          >
            Cancel
          </button>
        </footer>
      </div>
    </ModalDefaultContainer>
  )
}
