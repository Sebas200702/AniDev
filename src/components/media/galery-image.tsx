import { ExpandIconV2 } from '@components/icons/expand-icon'
import { ImageViewer } from '@components/media/image-viewer'
import { Overlay } from '@components/layout/overlay'
import { useModal } from '@hooks/useModal.tsx'
import type { ImageType } from 'types'

interface Props {
  children: React.ReactNode
  imageList?: ImageType[]
  initialIndex?: number
  disabled?: boolean
  overlayClassName?: string
  iconClassName?: string
  ariaLabel?: string
}

export const GaleryImage = ({
  children,
  imageList = [],
  initialIndex = 0,
  disabled = false,
  overlayClassName = 'bg-Complementary/0 group-hover:bg-Complementary/70',
  iconClassName = 'h-8 w-8',
  ariaLabel = 'Open image in advanced viewer',
}: Props) => {
  const { openModal, closeModal } = useModal()

  const hasImages = imageList.length > 0
  const validInitialIndex = Math.max(
    0,
    Math.min(initialIndex, imageList.length - 1)
  )

  const handleOpenViewer = () => {
    if (!hasImages || disabled) return

    openModal(ImageViewer, {
      imageList,
      initialIndex: validInitialIndex,
      onClose: closeModal,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpenViewer()
    }
  }

  if (!hasImages) {
    return <div className="cursor-not-allowed opacity-50">{children}</div>
  }

  return (
    <button
      onClick={handleOpenViewer}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className="group relative block cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={ariaLabel}
      type="button"
      tabIndex={0}
    >
      <Overlay
        className={`${overlayClassName} absolute inset-0 z-30 h-full w-full transition-all duration-300`}
      />
      {children}
      <ExpandIconV2
        className={`${iconClassName} absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus:opacity-100`}
        aria-hidden="true"
      />
    </button>
  )
}
