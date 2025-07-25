import { Picture } from '@components/media/picture'
import { useDragAndDrop } from '@hooks/useDragAndDrop'
import { useModal } from '@hooks/useModal'
import { useGlobalUserPreferences } from '@store/global-user'
import { useUploadImageStore } from '@store/upload-image'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { useEffect, useRef } from 'react'
import { ImageEditor } from './image-editor'
import { InputUserImage } from './input-user-image'

export const UserInfo = ({
  isSignUp,
}: {
  isSignUp?: boolean
  styles?: string
}) => {
  const { userInfo } = useGlobalUserPreferences()
  const { setImage, setType } = useUploadImageStore()
  const imageRef = useRef<HTMLImageElement | null>(null)
  const isEnabled = !!userInfo || isSignUp
  const { openModal } = useModal()
  useEffect(() => {
    const original = HTMLCanvasElement.prototype.getContext as any
    HTMLCanvasElement.prototype.getContext = function (
      contextType: string,
      options?: any
    ) {
      if (contextType === '2d') {
        const opts = { ...(options ?? {}), willReadFrequently: true }
        return original.call(this, contextType, opts)
      }
      return original.apply(this, arguments as any)
    }
  }, [])

  const { isDragging, dragDropProps, dropTargetRef } = useDragAndDrop({
    enabled: isEnabled,
    onDrop: (file) => {
      setType(file.type)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      openModal(ImageEditor, {
        userName: userInfo?.name || '',
      })
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
    <article
      className={`z-10 flex w-full flex-row items-center ${isSignUp ? 'justify-center' : 'mt-24'} gap-4 text-white md:gap-8`}
    >
      <div
        {...dragDropProps}
        ref={(el) => {
          dropTargetRef.current = el
        }}
        className={`group relative flex h-full w-full items-center justify-center rounded-full ${isSignUp ? 'max-h-24 max-w-24' : 'max-h-26 max-w-26 md:max-h-40 md:max-w-40'}`}
      >
        <div
          className={`bg-enfasisColor absolute inset-0 flex w-full items-center justify-center rounded-full transition-opacity duration-200 ${
            isDragging ? 'opacity-100' : 'opacity-0'
          }`}
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
          styles="relative rounded-full"
        >
          <img
            ref={imageRef}
            src={createImageUrlProxy(
              userInfo?.avatar || `${baseUrl}/placeholder.webp`,
              '0',
              '70',
              'webp'
            )}
            alt={`${userInfo?.name} Avatar`}
            className="h-full w-full rounded-full transition-all duration-200 relative"
          />
        </Picture>

        {(isSignUp || userInfo?.name) && <InputUserImage />}
      </div>

      {!isSignUp && (
        <h1 className="truncate text-lg font-bold md:text-4xl">
          {userInfo?.name || 'Guest'}
        </h1>
      )}
    </article>
  )
}
