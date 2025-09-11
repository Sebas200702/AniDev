import { useDragAndDrop } from '@hooks/useDragAndDrop'
import { useModal } from '@hooks/useModal'
import { EditIcon } from 'domains/shared/components/icons/edit-icon'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { Picture } from 'domains/shared/components/media/picture'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'

import { useGlobalUserPreferences } from '@store/global-user'
import { useUpdateProfile } from '@store/update-profile'

import { useMemo } from 'react'
import type { DataImage } from 'types'
import { AnimeBannerColection } from './anime-banner-colection'
import { CharacterImagesColection } from './character-images-colection'
import { EditProfile } from './edit-profile'
import { ImageEditor } from './image-editor'

export const ChangeImages = ({ type, url }: DataImage) => {
  const { openModal } = useModal()
  const { userInfo } = useGlobalUserPreferences()
  const malIds = [
    33206, 37786, 21, 47917, 813, 16498, 52299, 38691, 40748, 40591, 30484,
    30831, 54492, 44074, 49596, 57334, 34572, 58390, 35849, 53446, 15583, 32182,
    2001,
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

  return (
    <ModalDefaultContainer>
      <section className="xl:w-[35vw] md:w-[60vw] h-[80vh] overflow-y-scroll no-scrollbar ">
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
                className="button-secondary  "
                title={`Crop ${type} image `}
                onClick={handleCropClick}
              >
                <EditIcon className="h-5 w-5 " />
              </button>
            </div>
          </div>
        </header>

        {isAvatar &&
          malIds.map((id) => <CharacterImagesColection key={id} id={id} />)}
        {type !== 'avatar' &&
          malIds.map((id) => <AnimeBannerColection key={id} id={id} />)}
      </section>
    </ModalDefaultContainer>
  )
}
