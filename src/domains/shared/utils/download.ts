// utils/download-utils.ts
export const generateFilename = (
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

export const performDownload = async (
  downloadUrl: string,
  filename: string
) => {
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
  link.href = downloadUrl2
  link.download = filename
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl2)
  }, 100)
}
