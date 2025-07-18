import { DownloadIcon } from '@icons/download-icon'
import { toast } from '@pheralb/toast'
import { useState } from 'react'
import { ToastType } from 'types'

interface AudioMetadata {
  type: 'audio'
  artist?: string
  coverUrl?: string
  duration?: string
}

interface VideoMetadata {
  type: 'video'
  thumbnailUrl?: string
  duration?: string
  resolution?: string
  fps?: number
}

interface DocumentMetadata {
  type: 'document'
  author?: string
  pages?: number
  size?: string
}

interface ImageMetadata {
  type: 'image'
  dimensions?: string
  size?: string
  format?: string
}

type FileMetadata =
  | AudioMetadata
  | VideoMetadata
  | DocumentMetadata
  | ImageMetadata

interface Props {
  url: string
  title: string
  styles: string
  metadata?: FileMetadata
  showMetadata?: boolean
}

/**
 * DownloadButton component provides functionality to download a file from a given URL using a proxy endpoint.
 * Now supports file metadata including artist, album cover, and other audio/video information.
 *
 * @description This component renders a button that allows users to download a file by clicking on it.
 * It manages the loading state during the download process and provides visual feedback to the user.
 * The button is disabled while the download is in progress to prevent multiple requests.
 *
 * New features:
 * - Support for file metadata (artist, album, cover art, etc.)
 * - Enhanced filename generation based on metadata
 * - Optional metadata display in tooltip or UI
 *
 * @param {Props} props - The component props
 * @param {string} props.url - The URL of the file to be downloaded
 * @param {string} props.title - The title of the file, used as the filename for the downloaded file
 * @param {string} props.styles - CSS classes to apply to the button
 * @param {FileMetadata} [props.metadata] - Optional metadata for the file (artist, album, cover, etc.)
 * @param {boolean} [props.showMetadata] - Whether to display metadata in the UI
 * @returns {JSX.Element} The rendered download button with interactive functionality
 *
 * @example
 * // For a song
 * <DownloadButton
 *   url="https://example.com/song.mp3"
 *   title="Beautiful Song"
 *   styles="btn btn-primary"
 *   metadata={{
 *     type: 'audio',
 *     artist: 'John Doe',
 *     album: 'Greatest Hits',
 *     coverUrl: 'https://example.com/cover.jpg',
 *     year: 2023,
 *     genre: 'Pop',
 *     duration: '3:45'
 *   }}
 *   showMetadata={true}
 * />
 *
 * // For a video
 * <DownloadButton
 *   url="https://example.com/video.mp4"
 *   title="Amazing Video"
 *   styles="btn btn-secondary"
 *   metadata={{
 *     type: 'video',
 *     director: 'Jane Smith',
 *     thumbnailUrl: 'https://example.com/thumb.jpg',
 *     duration: '12:30',
 *     resolution: '1080p'
 *   }}
 * />
 */

export const DownloadButton = ({
  url,
  title,
  styles,
  metadata,
  showMetadata = false,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const generateFilename = (
    originalTitle: string,
    metadata?: FileMetadata
  ): string => {
    const fileExtension = url.split('.').pop()?.toLowerCase() || ''

    if (metadata?.type === 'audio' && metadata.artist) {
      const cleanTitle = originalTitle.replace(/[<>:"/\\|?*]/g, '_')
      const cleanArtist = metadata.artist.replace(/[<>:"/\\|?*]/g, '_')
      return fileExtension
        ? `${cleanArtist} - ${cleanTitle}.${fileExtension}`
        : `${cleanArtist} - ${cleanTitle}`
    }

    return fileExtension ? `${originalTitle}.${fileExtension}` : originalTitle
  }

  const generateTooltip = (): string => {
    if (!metadata) return `Download ${title}`

    let tooltip = `Download ${title}`

    switch (metadata.type) {
      case 'audio':
        if (metadata.artist) tooltip += `\nArtista: ${metadata.artist}`
        if (metadata.duration) tooltip += `\nDuración: ${metadata.duration}`
        break

      case 'video':
        if (metadata.duration) tooltip += `\nDuración: ${metadata.duration}`
        if (metadata.resolution)
          tooltip += `\nResolución: ${metadata.resolution}`
        break

      case 'document':
        if (metadata.author) tooltip += `\nAutor: ${metadata.author}`
        if (metadata.pages) tooltip += `\nPáginas: ${metadata.pages}`
        break

      case 'image':
        if (metadata.dimensions)
          tooltip += `\nDimensiones: ${metadata.dimensions}`
        if (metadata.format) tooltip += `\nFormato: ${metadata.format}`
        break
    }

    return tooltip
  }

  const performDownload = async () => {
    const filename = generateFilename(title, metadata)

    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&download=true&filename=${encodeURIComponent(filename)}`

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
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

    const downloadUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = downloadUrl
    link.download = filename

    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')

    document.body.appendChild(link)

    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
    }, 100)
  }

  const handleDownload = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      await toast[ToastType.Loading]({
        text: 'Downloading',
        options: {
          promise: performDownload(),
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

  return (
    <div className={showMetadata ? 'download-button-container' : ''}>
      {showMetadata && metadata && (
        <div
          className="metadata-preview"
          style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}
        >
          {metadata.type === 'audio' && (
            <div className="audio-metadata">
              {metadata.coverUrl && (
                <img
                  src={metadata.coverUrl}
                  alt="Cover"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <div>
                {metadata.artist && (
                  <div>
                    <strong>{metadata.artist}</strong>
                  </div>
                )}
                <div>{title}</div>
              </div>
            </div>
          )}

          {metadata.type === 'video' && (
            <div className="video-metadata">
              {metadata.thumbnailUrl && (
                <img
                  src={metadata.thumbnailUrl}
                  alt="Thumbnail"
                  style={{
                    width: '60px',
                    height: '40px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <div>
                <div>
                  <strong>{title}</strong>
                </div>

                {metadata.duration && (
                  <div style={{ opacity: 0.7 }}>{metadata.duration}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`${styles} ${isLoading ? 'button-loading' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          handleDownload()
        }}
        disabled={isLoading}
        title={generateTooltip()}
      >
        <DownloadIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        <span className="font-medium">
          {isLoading ? 'Downloading...' : 'Download'}
        </span>
      </button>
    </div>
  )
}
