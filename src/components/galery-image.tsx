import { ExpandIconV2 } from '@components/icons/expand-icon'
import { ImageViewer } from '@components/image-viewer'
import { Overlay } from '@components/overlay'
import { useModal } from '@hooks/useModal.tsx'

interface Props {
  children: React.ReactNode
  src: string
  alt?: string
  maxWidth?: string
}

export const GaleryImage = ({
  children,
  src,
  alt = 'Gallery image',
  maxWidth = '90vw',
}: Props) => {
  const { openModal, closeModal } = useModal()

  const handleOpenViewer = () => {
    const viewerContent = (
      <ImageViewer
        src={src}
        alt={alt}
        onClose={closeModal}
        maxWidth={maxWidth}
      />
    )
    openModal(viewerContent)
  }

  return (
    <button
      onClick={handleOpenViewer}
      className="group relative block cursor-pointer"
      aria-label="Open image in advanced viewer"
      type="button"
    >
      <Overlay className="bg-Complementary/0 group-hover:bg-Complementary/70 ba absolute inset-0 z-30 h-full w-full transition-all duration-300" />
      {children}
      <ExpandIconV2 className="absolute top-1/2 left-1/2 z-40 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100" />
    </button>
  )
}
