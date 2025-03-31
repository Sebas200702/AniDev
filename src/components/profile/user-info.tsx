import { Picture } from '@components/picture'
import { useGlobalUserPreferences } from '@store/global-user'
import { useUploadImageStore } from '@store/upload-image'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { ImageEditor } from './image-editor'
import { InputUserImage } from './input-user-image'

export const UserInfo = () => {
  const { userInfo } = useGlobalUserPreferences()
  const { setImage } = useUploadImageStore()
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (!droppedFile) return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(droppedFile)
    const $imageEditor = document.querySelector('.image-editor')

    $imageEditor?.classList.replace('hidden', 'flex')
  }
  return (
    <article className="z-10 mt-24 flex w-full flex-row items-center gap-6 text-white md:gap-8 ">
      <div
        className="relative flex h-26 w-26 items-center justify-center rounded-full md:h-40 md:w-40 group "
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
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
