import { EditIcon } from '@components/icons/edit-icon'
import { EditProfile } from '@components/profile/edit-profile/edit-profile'
import { useModal } from '@hooks/useModal'

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
  const { openModal } = useModal()

  const handleClick = () => {
    openModal(EditProfile)
  }

  return (
    <div className="image-upload-container">
      <button
        className="bg-Complementary border-Primary-300/20 absolute z-20 flex -translate-x-3/4 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-1 p-2 transition-all duration-200 ease-in-out md:group-hover:opacity-95"
        title="Upload image"
        onClick={handleClick}
      >
        <EditIcon className="group-hover:text-enfasisColor h-3.5 w-3.5 text-white transition-all duration-200 ease-in-out group-hover:scale-110 md:h-5 md:w-5" />
      </button>
    </div>
  )
}
