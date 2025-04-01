import { useUploadImageStore } from '@store/upload-image'
export const InputUserImage = () => {
  const { setImage } = useUploadImageStore()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    const $imageEditor = document.querySelector('.image-editor')

    $imageEditor?.classList.replace('opacity-0', 'opacity-100')
    $imageEditor?.classList.remove('pointer-events-none')
  }

  return (
    <form id="image-form">
      <label
        htmlFor="file-upload"
        className="bg-Complementary border-Primary-300/20 absolute z-20 flex -translate-x-3/4 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-1 p-2 transition-all duration-200 ease-in-out md:right-3 md:bottom-4  md:translate-y-0 md:opacity-0 md:group-hover:opacity-95"
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
    </form>
  )
}
