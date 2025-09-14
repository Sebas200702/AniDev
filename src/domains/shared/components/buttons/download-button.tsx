import { toast } from '@pheralb/toast'
import { useModal } from '@shared/hooks/useModal'
import { DownloadModalContent } from 'domains/download/components/download-modal-content'
import { DownloadIcon } from '@shared/components/icons/common/download-icon'
import { useState } from 'react'
import { ToastType } from '@shared/types'

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
  const [isLoading, setIsLoading] = useState(false)
  const { openModal, closeModal } = useModal()

  const generateFilename = (
    title: string,
    version?: string,
    type?: string,
    resolution?: string
  ): string => {
    let filename = title.replace(/[<>:"/\\|?*]/g, '_')
    if (version && type && resolution) {
      filename += `_v${version}_${type}_${resolution}p`
    }
    return filename
  }

  const performDownload = async (downloadUrl: string, filename: string) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}&download=true&filename=${encodeURIComponent(filename)}`
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { Accept: '*/*' },
      redirect: 'follow',
    })
    if (!response.ok) {
      let errorMessage = 'Failed to download file'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }
    const blob = await response.blob()
    if (!blob || blob.size === 0) {
      throw new Error('Empty file received')
    }
    const downloadUrl2 = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = downloadUrl2
    link.download = filename
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl2)
    }, 100)
  }

  const handleSimpleDownload = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const filename = generateFilename(title)
      await toast[ToastType.Loading]({
        text: 'Downloading',
        options: {
          promise: performDownload(url, filename),
          success: 'Download completed!',
          error: 'Download failed',
          autoDismiss: true,
        },
      })
    } catch (error) {
      console.error('Error downloading file:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAdvancedModal = () => {
    if (!themeId) return
    openModal(DownloadModalContent, {
      title,
      themeId,
      onClose: closeModal,
    })
  }

  if (themeId) {
    return (
      <button
        onClick={handleOpenAdvancedModal}
        className={`${styles} ${isLoading ? 'button-loading' : ''}`}
        aria-label="Open download options"
        disabled={isLoading}
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

  return (
    <button
      className={`${styles} ${isLoading ? 'button-loading' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        handleSimpleDownload()
      }}
      disabled={isLoading}
      title={`Download ${title}`}
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
