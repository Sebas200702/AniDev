import { EditIcon } from '@shared/components/icons/common/edit-icon'
import { UploadIcon } from '@shared/components/icons/common/upload-icon'
import { Picture } from '@shared/components/media/picture'
import { useDragAndDrop } from '@shared/hooks/useDragAndDrop'
import { useModal } from '@shared/hooks/useModal'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'

import { useUpdateProfile } from '@user/stores/update-profile'
import { useGlobalUserPreferences } from '@user/stores/user-store'

import type { DataImage } from '@anime/types'
import { CameraIcon } from '@shared/components/icons/common/camera-icon'
import { useCamera } from '@shared/hooks/useCamera'
import { useMemo } from 'react'
import { AnimeBannerColection } from './anime-banner-colection'
import { CharacterImagesColection } from './character-images-colection'
import { EditProfile } from './edit-profile'
import { ImageEditor } from './image-editor'

export const ChangeImages = ({ type, url }: DataImage) => {
  const { openModal } = useModal()
  const { userInfo } = useGlobalUserPreferences()
  const malIds = [
    33206, 37786, 21, 47917, 34382, 813, 16498, 52299, 38691, 40748, 40591,
    30484, 30831, 54492, 44074, 49596, 57334, 34572, 58390, 35849, 53446, 15583,
    32182, 2001,
  ]
  const {
    setAvatar,
    setBannerImage,
    setAvatarType,
    setBannerType,
    avatar,
    bannerImage,
  } = useUpdateProfile()
  const isAvatar = type === 'avatar'

  const imgSrc = useMemo(() => {
    return isAvatar
      ? (avatar ?? userInfo?.avatar)
      : (bannerImage ?? userInfo?.banner_image ?? url)
  }, [isAvatar, avatar, userInfo?.avatar, bannerImage, userInfo?.banner_image])
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
  const handleCropClick = () => {
    openModal(ImageEditor, { type })
  }
  const handleDoneClick = () => {
    openModal(EditProfile)
  }
  const handleCancelClick = () => {
    if (isAvatar) {
      setAvatar(userInfo?.avatar ?? '')
    } else {
      setBannerImage(userInfo?.banner_image ?? '')
    }
    openModal(EditProfile)
  }
  const handleUploadClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.onchange = () => {
      if (!fileInput.files || fileInput.files.length === 0) return
      const file = fileInput.files[0]
      const blobUrl = URL.createObjectURL(file)
      if (isAvatar) {
        setAvatar(blobUrl)
        setAvatarType(file.type)
      } else {
        setBannerImage(blobUrl)
        setBannerType(file.type)
      }
      openModal(ImageEditor, { type })
    }
    fileInput.click()
  }
  const { startCamera } = useCamera({
    width: isAvatar ? 720 : 1920,
    height: isAvatar ? 720 : 720,
    quality: 0.95,
    onPhotoTaken: (imageUrl, imageType) => {
      if (isAvatar) {
        setAvatar(imageUrl)
        setAvatarType(imageType)
      } else {
        setBannerImage(imageUrl)
        setBannerType(imageType)
      }
      openModal(ImageEditor, { type })
    },
    onCancel: () => {
      openModal(ChangeImages, { type, url })
    },
  })

  const handleCameraClick = () => {
    startCamera()
  }

  return (
    <ModalDefaultContainer>
      <section className="xl:w-[35vw] md:w-[60vw] h-[80vh] w-full overflow-y-hidden ">
        <header
          className={` flex ${isAvatar ? 'md:flex-row md:p-4 flex-col' : 'flex-col'} sticky py-4 z-30 md:top-0  left-0 right-0 gap-8 items-center   `}
        >
          <Overlay className="bg-Complementary h-full w-full" />
          <div
            {...dragDropProps}
            ref={dropTargetRef}
            className={`${isAvatar ? 'md:max-h-32 md:max-w-32 max-w-24 max-h-24  w-full h-full relative rounded-full aspect-square' : 'absolute top-0 w-full rounded  aspect-[1080/300]'}  object-cover object-center overflow-hidden   `}
          >
            {isDragging && (
              <div className="bg-enfasisColor absolute inset-0 z-10 flex items-center justify-center opacity-80">
                <span className="px-4 text-center text-lg font-medium text-white">
                  Drop your image here
                </span>
              </div>
            )}

            <Picture
              image={imgSrc || ''}
              placeholder={imgSrc || ''}
              alt={type}
              isBanner={!isAvatar}
              styles={`${isAvatar ? 'aspect-square' : 'w-full  aspect-[1080/300]'} relative w-full h-full object-center object-cover  `}
            />
          </div>
          <div
            className={`z-10 flex flex-col md:gap-6 gap-3 w-full ${isAvatar ? '' : 'mt-44'}`}
          >
            <h2 className="capitalize text-lx md:text-left text-center">
              Select Your {type}
            </h2>
            <p className="text-m text-Primary-300 md:text-left text-center">
              {type === 'avatar'
                ? 'Select your profile image, you can change it when ever you want'
                : 'Select your profile banner , you can change it when ever you want'}
            </p>
            <div className="flex flex-row gap-2 text-s w-full">
              <button
                className="button-primary w-full  disabled:opacity-30 disabled:pointer-events-none"
                title={`Save your ${type}`}
                onClick={handleDoneClick}
              >
                Done
              </button>
              <button
                className="button-secondary w-full max-w-24"
                title={`Cancel updating ${type} image`}
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              <button
                className="button-secondary"
                title={`Crop ${type} image `}
                onClick={handleCropClick}
              >
                <EditIcon className="h-5 w-5" />
              </button>
              <button
                className="button-secondary"
                title={`Upload ${type} image `}
                onClick={handleUploadClick}
              >
                <UploadIcon className="h-5 w-5" />
              </button>
              <button
                className="button-secondary"
                title={`Take ${type} image with camera `}
                onClick={handleCameraClick}
              >
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        <ul className="mt-4 md:mx-8 flex flex-col gap-6 no-scrollbar overflow-y-auto h-full">
          {isAvatar &&
            malIds.map((id) => <CharacterImagesColection key={id} id={id} />)}
          {type !== 'avatar' &&
            malIds.map((id) => <AnimeBannerColection key={id} id={id} />)}
        </ul>
      </section>
    </ModalDefaultContainer>
  )
}
