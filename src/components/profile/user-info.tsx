import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'

import { InputUserImage } from '@components/profile/edit-profile/input-user-image'

import { useGlobalUserPreferences } from '@store/global-user'

import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { useRef } from 'react'

export const UserInfo = ({
  isSignUp,
}: {
  isSignUp?: boolean
  styles?: string
}) => {
  const { userInfo } = useGlobalUserPreferences()

  const imageRef = useRef<HTMLImageElement | null>(null)

  return (
    <section className={`${isSignUp ? 'relative w-full ' : ''}`}>
      <Picture
        styles={` ${isSignUp ? 'w-full h-30 rounded' : 'w-full h-100'} object-cover object-center  absolute top-0 left-0 overflow-hidden `}
        image={createImageUrlProxy(
          `${userInfo?.banner_image ?? 'https://media.kitsu.app/anime/cover_images/3936/original.jpg'}`,
          '100',
          '0',
          'webp'
        )}
      >
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={createImageUrlProxy(
            `${userInfo?.banner_image ?? 'https://media.kitsu.app/anime/cover_images/3936/original.jpg'}`,
            '1080',
            '75',
            'webp'
          )}
          alt=""
          loading="lazy"
        />
        <Overlay className="to-Primary-950 absolute inset-0 h-full w-full bg-gradient-to-b" />
        <Overlay className="md:to-Primary-950 absolute top-0 left-0 h-full w-1/4 bg-gradient-to-l" />
      </Picture>
      <article
        className={`z-10 flex w-full flex-row items-center ${isSignUp ? 'justify-center' : 'mt-24'} gap-4 text-white md:gap-8`}
      >
        <div
          className={`group relative flex h-full w-full aspect-square items-center justify-center rounded-full ${isSignUp ? 'max-h-24 max-w-24 mt-4' : 'max-h-26 max-w-26 md:max-h-[150px] md:max-w-[150px]'}`}
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
            image={createImageUrlProxy(
              userInfo?.avatar || `${baseUrl}/placeholder.webp`,
              '0',
              '0',
              'webp'
            )}
            styles="relative rounded-full overflow-hidden w-full h-full object-cover object-center"
          >
            <img
              ref={imageRef}
              src={createImageUrlProxy(
                userInfo?.avatar || `${baseUrl}/placeholder.webp`,
                '0',
                '75',
                'webp'
              )}
              alt={`${userInfo?.name} Avatar`}
              className="relative h-full w-full rounded-full transition-all duration-200 object-cover object-center"
            />
          </Picture>

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
