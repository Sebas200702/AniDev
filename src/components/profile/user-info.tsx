import { Picture } from '@components/picture'
import { useGlobalUserPreferences } from '@store/global-user'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { ImageEditor } from './image-editor'
import { InputUserImage } from './input-user-image'

export const UserInfo = () => {
  const { userInfo } = useGlobalUserPreferences()
  return (
    <article className="z-10 mt-24 flex w-full flex-row items-center gap-6 text-white md:gap-8 ">
      <div className="relative flex h-26 w-26 items-center justify-center rounded-full md:h-40 md:w-40 group ">
        <Picture
          image={createImageUrlProxy(userInfo?.avatar ?? '')}
          styles="h-26 w-26 rounded-full md:h-36 md:w-36 relative"
        >
          <img
            src={userInfo?.avatar ?? '/profile-picture-5.webp'}
            alt={`${userInfo?.name} Avatar`}
            className="h-26 w-26 rounded-full md:h-36 md:w-36 relative"
            loading="lazy"
          />
        </Picture>
        {userInfo?.name && <InputUserImage />}
      </div>

      <ImageEditor userName={userInfo?.name ?? ''} />

      <span className="text-lg font-bold md:text-4xl truncate">
        {userInfo?.name ?? 'Guest'}
      </span>
    </article>
  )
}
