import { toast } from '@pheralb/toast'
import { ToastType } from '@shared/types'
import { generateFilename, performDownload } from '@shared/utils/download'
// hooks/useDownloadManager.ts
import { useState } from 'react'

export const useDownloadManager = () => {
  const [isLoading, setIsLoading] = useState(false)

  const download = async (
    url: string,
    title: string,
    version?: string,
    type?: string,
    resolution?: string,
    onSuccess?: () => void
  ) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const filename = generateFilename(title, version, type, resolution)

     toast[ToastType.Loading]({
        text: 'Downloading',
        options: {
          promise: performDownload(url, filename),
          success: 'Download completed!',
          error: 'Download failed',
          autoDismiss: true,
        },
      })

      if (onSuccess) {
        try {
          onSuccess()
        } catch (callbackError) {
          console.error('onSuccess callback error:', callbackError)
        }
      }
    } catch (error) {
      console.error('Download error:', error)
      // Error toast already handled by the promise option above
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, download }
}
