import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'

import { InputUserImage } from '@components/profile/edit-profile/input-user-image'

import { useGlobalUserPreferences } from '@store/global-user'


export const UserInfo = ({
  isSignUp,
}: {
  isSignUp?: boolean
}) => {
  const { userInfo } = useGlobalUserPreferences()


  return (
    <section className={`${isSignUp ? 'relative w-full md:mb-16 mb-6' : ''}`}>
      <Picture
        styles={` ${isSignUp ? 'w-full h-30 rounded' : 'w-full h-100'} object-cover object-center  absolute top-0 left-0 overflow-hidden `}
        image={
          userInfo?.banner_image ||
          'https://media.kitsu.app/anime/cover_images/3936/original.jpg'
        }
        placeholder={
          userInfo?.banner_image ||
          'https://media.kitsu.app/anime/cover_images/3936/original.jpg'
        }
        isBanner
        alt={`Banner of ${userInfo?.name}`}
      />

      <Overlay className="to-Primary-950 absolute inset-0 h-full w-full bg-gradient-to-b" />
      <Overlay className="md:to-Primary-950 absolute top-0 left-0 h-full w-1/4 bg-gradient-to-l" />
      <article
        className={`z-10 flex w-full flex-row items-center ${isSignUp ? 'justify-center' : 'mt-24'} gap-4 text-white md:gap-8`}
      >
        <div
          className={`group absolute top-1/2 flex h-full w-full aspect-square items-center justify-center rounded-full ${isSignUp ? 'md:max-h-24 md:max-w-24 max-w-20 max-h-20 ' : 'max-h-26 max-w-26 md:max-h-[150px] md:max-w-[150px]'}`}
        >
          <div
            className={`bg-enfasisColor absolute inset-0 flex w-full h-full items-center justify-center rounded-full transition-opacity duration-200 `}
            style={{ zIndex: -1 }}
          >
            <span className="px-2 text-center text-sm font-medium text-white">
              Drop your image here
            </span>
          </div>
          <Picture
            image={userInfo?.avatar || ''}
            placeholder={userInfo?.avatar || ''}
            styles="relative rounded-full overflow-hidden w-full h-full object-cover object-center"
            alt={`${userInfo?.name} Avatar`}
          />

          {(isSignUp || userInfo?.name) && <InputUserImage />}
        </div>

        {!isSignUp && (
          <h1 className="truncate text-lg font-bold md:text-4xl z-10">
            {userInfo?.name || 'Guest'}
          </h1>
        )}
      </article>
    </section>
  )
}
