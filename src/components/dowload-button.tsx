/**
 * DownloadButton component provides functionality to download an image from a given URL.
 *
 * @description This component renders a button that allows users to download an image by clicking on it.
 * It manages the loading state during the download process and provides visual feedback to the user.
 * The button is disabled while the download is in progress to prevent multiple requests.
 *
 * The component fetches the image from the provided URL, converts it into a blob, and creates a downloadable
 * link dynamically. It ensures proper cleanup of resources by revoking the object URL after the download is complete.
 *
 * The UI displays a loading state with a "Downloading..." label when the download is in progress, and reverts
 * to the "Download" label when the process is complete or idle. The button styling changes dynamically based
 * on the loading state.
 *
 * @param {Props} props - The component props
 * @param {string} props.imageUrl - The URL of the image to be downloaded
 * @param {string} props.title - The title of the image, used as the filename for the downloaded file
 * @returns {JSX.Element} The rendered download button with interactive functionality
 *
 * @example
 * <DownloadButton
 *   imageUrl="https://example.com/image.jpg"
 *   title="example-image"
 * />
 */
import { useState } from 'react'

interface Props {
  imageUrl: string
  title: string
}

export const DownloadButton = ({ imageUrl, title }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(imageUrl, { mode: 'cors' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar la imagen:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      className={`button-primary ${isLoading ? 'button-loading' : ''}`}
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? 'Downloading...' : 'Download'}
    </button>
  )
}
