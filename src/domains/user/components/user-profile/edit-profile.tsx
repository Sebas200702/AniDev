import { Input } from '@auth/components/auth-form/input'
import { toast } from '@pheralb/toast'
import { EditIcon } from '@shared/components/icons/common/edit-icon'
import { UserIcon } from '@shared/components/icons/user/user-icon'
import { Picture } from '@shared/components/media/picture'
import { useModal } from '@shared/hooks/useModal'
import { ChangeImages } from '@user/components/user-profile/change-images'
import { useUpdateProfile } from '@user/stores/update-profile'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { baseUrl } from '@utils/base-url'
import { uploadImages } from '@utils/upload-images'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'
import { useEffect, useState } from 'react'
import { InputType, ToastType } from 'types'
import type { DataImage, UserInfo } from 'types'

export const EditProfile = () => {
  const { userInfo, setUserInfo } = useGlobalUserPreferences()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const {
    setUsername,
    userName,
    bannerImage,
    avatar,
    avatarType,
    bannerType,
    setAvatar,
    setBannerImage,
  } = useUpdateProfile()
  const { closeModal, openModal } = useModal()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  useEffect(() => {
    const disabled =
      !userInfo ||
      (userInfo.avatar === avatar &&
        userInfo.name === userName &&
        userInfo.banner_image === bannerImage)

    setIsDisabled(disabled)
  }, [userInfo, avatar, bannerImage, userName])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = await updateProfile()
    if (!user) return
    setUserInfo(user)
  }
  const updateProfile = async () => {
    setIsLoading(true)
    const bannerPayload = {
      image: bannerImage,
      type: bannerType,
      filename: `${userInfo?.id}_banner`,
      isBanner: true,
    }
    const avatarPayload = {
      image: avatar,
      type: avatarType,
      filename: `${userInfo?.id}_avatar`,
      isBanner: false,
    }
    try {
      const { data: banner } = await uploadImages(
        bannerPayload,
        userInfo,
        '/api/uploadImage'
      )
      const { data: avatar } = await uploadImages(
        avatarPayload,
        userInfo,
        '/api/uploadImage'
      )

      const profile: UserInfo = {
        id: userInfo?.id ?? null,
        avatar,
        banner_image: banner,
        name: userName,
      }

      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        body: JSON.stringify(profile),
      })
      if (!response.ok) {
        throw new Error('Error While upload Image')
      }

      setSuccessMessage('Profile updated successfully')

      return profile
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error while uploading image'
      )
      setSuccessMessage(null)
    } finally {
      setIsLoading(false)
      closeModal()
    }
  }

  const handleClickEdit = ({ type, url }: DataImage) => {
    closeModal()
    openModal(ChangeImages, { type, url })
  }
  const handleCancelClick = () => {
    setUsername(userInfo?.name ?? '')
    setAvatar(userInfo?.avatar ?? '')
    setBannerImage(userInfo?.banner_image ?? '')
    closeModal()
  }

  useEffect(() => {
    if (isLoading) {
      toast[ToastType.Loading]({
        text: 'Updating Profile',
        options: {
          promise: updateProfile(),
          success: successMessage ?? 'Done',
          error: errorMessage ?? 'Error',
          autoDismiss: true,
        },
      })
    }
  }, [isLoading, successMessage, errorMessage])

  return (
    <ModalDefaultContainer>
      <h2 className="text-lx absolute text-center top-0 -translate-y-full w-full text-Primary-50 p-4">
        Edit Your Profile
      </h2>
      <section className="xl:w-[25vw] md:w-[60vw] w-full max-h-[45vh]  flex justify-center">
        <button
          className="absolute top-0 w-full object-cover object-center md:aspect-[1080/300] aspect-[1080/500] rounded-t-lg overflow-hidden group"
          onClick={() =>
            handleClickEdit({
              url:
                userInfo?.banner_image ||
                'https://media.kitsu.app/anime/cover_images/3936/original.jpg',
              type: 'banner',
            })
          }
        >
          <Picture
            styles="w-full h-full object-cover object-center  md:aspect-[1080/300] aspect-[1080/500] relative cursor-pointer "
            image={
              bannerImage ||
              userInfo?.banner_image ||
              'https://media.kitsu.app/anime/cover_images/3936/original.jpg'
            }
            placeholder={
              bannerImage ||
              userInfo?.banner_image ||
              'https://media.kitsu.app/anime/cover_images/3936/original.jpg'
            }
            alt={`Banner of ${userInfo?.name}`}
            isBanner
          />
          <span className="absolute top-1/2 left-1/2  group-hover:opacity-100 opacity-0 -translate-x-1/2 rounded-full -translate-y-1/2 z-50 text-s select-none">
            {'Change banner image'}
          </span>

          <Overlay
            className={`to-Complementary w-full bg-gradient-to-b h-1/2 group-hover:h-full   group-hover:via-Complementary/60 z-10`}
          />

          <div
            className="bg-Complementary border-Primary-300/20 absolute z-20 flex right-1 bottom-1   cursor-pointer items-center justify-center rounded-full border-1 md:p-2 p-1 transition-all duration-200 ease-in-out md:group-hover:opacity-95 "
            title="'Change banner image'"
          >
            <EditIcon className="group-hover:text-enfasisColor h-3.5 w-3.5 text-white transition-all duration-200 ease-in-out group-hover:scale-110 md:h-5 md:w-5" />
          </div>
        </button>
        <div
          className=" md:h-32 md:w-32 w-20 h-20 absolute top-28 z-20 group"
          onClick={() =>
            handleClickEdit({
              url: userInfo?.avatar || `${baseUrl}/placeholder.webp`,
              type: 'avatar',
            })
          }
        >
          <Picture
            styles="relative h-full w-full rounded-full transition-all duration-200 object-cover object-center "
            image={avatar || userInfo?.avatar || ''}
            placeholder={avatar || userInfo?.avatar || ''}
            alt={`Avatar of ${userInfo?.name}`}
          />

          <span className="absolute top-1/2 left-1/2  group-hover:opacity-100 opacity-0 -translate-x-1/2 rounded-full -translate-y-1/2 z-50 text-s select-none">
            {'Change'}
          </span>

          <Overlay
            className={`to-Complementary/80 w-full bg-gradient-to-b h-1/2 group-hover:h-full   group-hover:via-Complementary/60 z-10`}
          />

          <div
            className="bg-Complementary border-Primary-300/20 absolute z-20 flex right-0 bottom-1   cursor-pointer items-center justify-center rounded-full border-1 md:p-2 p-1 transition-all duration-200 ease-in-out md:group-hover:opacity-95  "
            title="Change Image"
          >
            <EditIcon className="group-hover:text-enfasisColor h-3.5 w-3.5 text-white transition-all duration-200 ease-in-out group-hover:scale-110 md:h-5 md:w-5" />
          </div>
        </div>

        <form
          className="md:mt-64 mt-50 w-full flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <Input
            name="Username"
            placeholder="UserName"
            type={InputType.TEXT}
            value={userName ?? ''}
            onChange={handleInput}
          >
            <UserIcon className="h-5 w-5" />
          </Input>

          <footer className="w-full flex items-center  gap-4">
            <button
              disabled={isDisabled}
              className="button-primary w-full disabled:opacity-30 disabled:pointer-events-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="button-secondary w-full"
            >
              Cancel
            </button>
          </footer>
        </form>
      </section>
    </ModalDefaultContainer>
  )
}
