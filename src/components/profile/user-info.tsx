import { useDragAndDrop } from '@hooks/useDragAndDrop'
import { useGlobalUserPreferences } from '@store/global-user'
import { useUploadImageStore } from '@store/upload-image'
import { useRef } from 'react'
import { ImageEditor } from './image-editor'
import { InputUserImage } from './input-user-image'

export const UserInfo = () => {
  const { userInfo } = useGlobalUserPreferences()
  const { setImage } = useUploadImageStore()
  const imageRef = useRef<HTMLImageElement | null>(null)
  const { isDragging, dragDropProps, dropTargetRef } = useDragAndDrop({
    onDropDataUrl: (dataUrl) => {
      setImage(dataUrl)

      const $imageEditor = document.querySelector('.image-editor')
      $imageEditor?.classList.replace('opacity-0', 'opacity-100')
      $imageEditor?.classList.remove('pointer-events-none')

      if (imageRef.current) {
        imageRef.current.classList.remove('opacity-10')
        imageRef.current.classList.add('opacity-100')
      }
    },
  })

  if (imageRef.current) {
    if (isDragging) {
      imageRef.current.classList.remove('opacity-100')
      imageRef.current.classList.add('opacity-10')
    } else {
      imageRef.current.classList.remove('opacity-10')
      imageRef.current.classList.add('opacity-100')
    }
  }

  return (
    <article className="z-10 mt-24 flex w-full flex-row items-center gap-6 text-white md:gap-8">
      <div
        {...dragDropProps}
        ref={(el) => {
          dropTargetRef.current = el
        }}
        className="group relative flex max-h-26 max-w-26 w-full h-full items-center justify-center rounded-full md:h-40 md:w-40"
      >
        <div
          className={`bg-enfasisColor absolute inset-0 flex  items-center justify-center rounded-full transition-opacity duration-200 w-f ${isDragging ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: -1 }}
        >
          <span className="px-2 text-center text-sm font-medium text-white">
            Drop your image here
          </span>
        </div>

        <img
          ref={imageRef}
          src={userInfo?.avatar ?? '/placeholder.webp'}
          alt={`${userInfo?.name} Avatar`}
          className="h-ful w-full rounded-full transition-all duration-200"
        />
        {userInfo?.name && <InputUserImage />}
      </div>

      <ImageEditor userName={userInfo?.name ?? ''} />
      <span className="truncate text-lg font-bold md:text-4xl">
        {userInfo?.name ?? 'Guest'}
      </span>
    </article>
  )
}
