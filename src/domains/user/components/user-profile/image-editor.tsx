import { useUpdateProfile } from '@user/stores/update-profile'
import { useRef } from 'react'
import { Cropper } from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import { SuperImageCropper } from 'super-image-cropper'
import '@user/styles/cropper.css'
import type { DataImage } from '@anime/types'
import { toast } from '@pheralb/toast'
import { useDragAndDrop } from '@shared/hooks/useDragAndDrop'
import { useModal } from '@shared/hooks/useModal'
import { ToastType } from '@shared/types'
import { baseUrl } from '@shared/utils/base-url'
import { createImageUrlProxy } from '@shared/utils/create-image-url-proxy'
import { useProfileImage } from '@user/hooks/useProfileImage'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'
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
      <div className="flex w-full max-w-[600px] min-w-[500px] flex-col items-center justify-center gap-6">
        <header className="w-full">
          <h2 className="w-full text-center text-xl font-semibold">
            Edit your image
          </h2>
        </header>
        <div
          className={`img-preview relative z-20 overflow-hidden border-2 border-gray-200 ${
            isAvatar
              ? 'h-40 w-40 rounded-full'
              : 'aspect-[1080/300] w-full rounded-lg'
          }`}
        />

        <div
          {...dragDropProps}
          ref={dropTargetRef}
          className="relative min-h-[350px] w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50"
        >
          {isDragging && (
            <div className="bg-enfasisColor/80 absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <span className="mb-2 block text-lg font-medium text-white">
                  Drop your image here
                </span>
                <span className="text-sm text-white/80">Release to upload</span>
              </div>
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
            className="h-full w-full"
            responsive={true}
            checkOrientation={false}
            background={false}
            autoCropArea={0.8}
          />
        </div>

        <footer className="flex w-full gap-3 pt-2">
          <button
            className="button-primary flex-1 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:scale-[1.02] hover:transform focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={getCropData}
            disabled={!cropSrc}
          >
            {cropSrc ? 'Apply Changes' : 'Upload Image'}
          </button>

          <button
            className="button-secondary flex-1 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:scale-[1.02] hover:transform focus:ring-2 focus:ring-offset-2 focus:outline-none"
            onClick={handleClickCancel}
          >
            Cancel
          </button>
        </footer>
      </div>
    </ModalDefaultContainer>
  )
}
