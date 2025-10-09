import { DownloadIcon } from '@shared/components/icons/common/download-icon'
import { useDownloadManager } from '@shared/hooks/useDownloadManager'
import { useModal } from '@shared/hooks/useModal'
import { DownloadModalContent } from 'domains/download/components/download-modal-content'

interface Props {
  url: string
  title: string
  styles: string
  showLabel?: boolean
  themeId?: number
}

export const DownloadButton = ({
  url,
  title,
  styles,
  showLabel = true,
  themeId,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const { isLoading, download } = useDownloadManager()

  const handleSimpleDownload = () => {
    download(url, title)
  }

  const handleOpenAdvancedModal = () => {
    if (!themeId) return
    openModal(DownloadModalContent, { title, themeId, onClose: closeModal })
  }

  return (
    <button
      onClick={themeId ? handleOpenAdvancedModal : handleSimpleDownload}
      className={`${styles} ${isLoading ? 'button-loading' : ''}`}
      disabled={isLoading}
      aria-label={themeId ? 'Open download options' : `Download ${title}`}
    >
      <DownloadIcon className="h-4 w-4 md:h-5 md:w-5" />
      {showLabel && (
        <span className="font-medium">
          {isLoading ? 'Downloading...' : 'Download'}
        </span>
      )}
    </button>
  )
}
