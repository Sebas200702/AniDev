import { useModal } from '@hooks/useModal'
import { useMusicPlayerStore } from '@store/music-player-store'
import { CloseIcon } from 'domains/shared/components/icons/close-icon'
import { WarningIcon } from 'domains/shared/components/icons/warning-icon'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'

interface ClosePlayerModalProps {
  onClose: () => void
}

/**
 * Dynamic component for the close player confirmation modal
 */
const ClosePlayerModal = ({ onClose }: ClosePlayerModalProps) => {
  const {
    setIsMinimized,
    setCurrentSong,
    setList,
    setIsPlaying,
    setSavedTime,
    setVariants,
    setIsHidden,
  } = useMusicPlayerStore()

  const handleClose = () => {
    setIsMinimized(true)
    setCurrentSong(null)
    setList([])
    setIsPlaying(false)
    setSavedTime(0)
    setVariants([])
    onClose()
  }

  const handleCancel = () => {
    setIsHidden(false)
    onClose()
  }

  return (
    <ModalDefaultContainer>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-red-500/20 p-3">
          <WarningIcon className="h-12 w-12 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-Primary-50 mb-2 text-2xl font-bold">
            Close Music Player
          </h2>
          <p className="text-Primary-200 text-md leading-relaxed">
            Are you sure you want to close the music player?
            <br />
            Your current playlist and playback progress will be lost.
          </p>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <button
          className="button-secondary flex-1 font-medium transition-all duration-300"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          className="button-primary flex-1 font-medium transition-all duration-300"
          onClick={handleClose}
        >
          Close Player
        </button>
      </div>
    </ModalDefaultContainer>
  )
}

interface Props {
  className?: string
}

export const ClosePlayerButton = ({ className }: Props) => {
  const { openModal, closeModal } = useModal()

  const handleOpenModal = () => {
    openModal(ClosePlayerModal, {
      onClose: closeModal,
    })
  }

  return (
    <button onClick={handleOpenModal} aria-label="Close music player">
      <CloseIcon
        className={`${className} text-Primary-200 h-4 w-4 transition-colors duration-300 hover:text-red-400`}
      />
    </button>
  )
}
