import { useModal } from '@hooks/useModal'
import { useGlobalUserPreferences } from '@store/global-user'
import { useUploadImageStore } from '@store/upload-image'
import { ImageEditor } from './image-editor'

/**
 * InputUserImage component provides a file input interface for uploading profile images.
 *
 * @description This component renders a styled file input button that allows users to select
 * and upload profile images. The button is designed to appear as a camera icon with hover effects
 * and transitions for better user interaction feedback.
 *
 * The component integrates with the upload image store to manage the selected image and its type.
 * When a file is selected, it:
 * - Reads the file using FileReader
 * - Updates the store with the image data and type
 * - Shows the image editor modal via the store
 *
 * The UI features:
 * - A camera icon that scales and changes color on hover
 * - Responsive design with different sizes for mobile and desktop
 * - Smooth transitions and animations
 * - Hidden file input for better styling control
 * - Proper accessibility attributes
 *
 * @returns {JSX.Element} The rendered file input button with camera icon
 *
 * @example
 * <InputUserImage />
 */
export const InputUserImage = () => {
  const { setImage, setType } = useUploadImageStore()
  const { openModal } = useModal()
  const { userInfo } = useGlobalUserPreferences()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return
    setType(file.type)
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)

      openModal(ImageEditor, {
        userName: userInfo?.name || '',
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="image-upload-container">
      <label
        htmlFor="file-upload"
        className="bg-Complementary border-Primary-300/20 absolute z-20 flex -translate-x-3/4 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-1 p-2 transition-all duration-200 ease-in-out md:group-hover:opacity-95"
        title="Upload image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="group-hover:text-enfasisColor h-3.5 w-3.5 text-white transition-all duration-200 ease-in-out group-hover:scale-110 md:h-5 md:w-5"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M12 20H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2 1 1 0 0 1 1-1h6a1 1 0 0 1 1 1 2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5M16 19h6M19 16v6" />
          <path d="M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
        </svg>
        <span className="hidden text-sm">Upload image</span>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}
