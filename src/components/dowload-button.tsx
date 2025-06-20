import { DownloadIcon } from '@icons/download-icon'
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
import { useState } from 'react'

// Definir tipos de metadatos específicos
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

// Union type para todos los metadatos
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

export const DownloadButton = ({
  url,
  title,
  styles,
  metadata,
  showMetadata = false,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  // Función para generar nombre de archivo basado en metadatos
  const generateFilename = (
    originalTitle: string,
    metadata?: FileMetadata
  ): string => {
    const fileExtension = url.split('.').pop()?.toLowerCase() || ''

    if (metadata?.type === 'audio' && metadata.artist) {
      // Para música: "Artista - Título"
      const cleanTitle = originalTitle.replace(/[<>:"/\\|?*]/g, '_')
      const cleanArtist = metadata.artist.replace(/[<>:"/\\|?*]/g, '_')
      return fileExtension
        ? `${cleanArtist} - ${cleanTitle}.${fileExtension}`
        : `${cleanArtist} - ${cleanTitle}`
    }

    // Fallback al comportamiento original
    return fileExtension ? `${originalTitle}.${fileExtension}` : originalTitle
  }

  // Función para generar tooltip con metadatos
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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)

    try {
      const filename = generateFilename(title, metadata)

      // Use the download proxy endpoint
      const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&download=true&filename=${encodeURIComponent(filename)}`

      // Fetch the file through the proxy with proper headers
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

      // Convert response to blob
      const blob = await response.blob()

      // Ensure we have a valid blob
      if (!blob || blob.size === 0) {
        throw new Error('Empty file received')
      }

      // Create download using blob URL (this prevents navigation)
      const downloadUrl = URL.createObjectURL(blob)

      // Create a temporary anchor element
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = downloadUrl
      link.download = filename

      // Prevent default behavior and ensure download
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')

      // Add to DOM temporarily
      document.body.appendChild(link)

      // Trigger download programmatically
      link.click()

      // Clean up immediately
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)
      }, 100)
    } catch (error) {
      console.error('Error downloading file:', error)

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Download failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={showMetadata ? 'download-button-container' : ''}>
      {/* Mostrar metadatos si está habilitado */}
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
        onClick={handleDownload}
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
