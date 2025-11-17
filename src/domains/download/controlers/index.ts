import { DownloadService } from '../services'

export const DownloadController = {
  /**
   * Validate and parse download parameters
   */
  validateParams(url: URL): {
    fileUrl: string
    customFilename?: string
    forceDownload: boolean
  } {
    const fileUrl = url.searchParams.get('url')

    if (!fileUrl) {
      throw new Error('Missing "url" parameter')
    }

    const customFilename = url.searchParams.get('filename') || undefined
    const forceDownload = url.searchParams.get('download') === 'true'

    return { fileUrl, customFilename, forceDownload }
  },

  /**
   * Handle download request
   */
  async handleDownload(
    fileUrl: string,
    customFilename?: string
  ): Promise<{
    buffer: ArrayBuffer
    contentType: string
    filename: string
    isLarge: boolean
  }> {
    const result = await DownloadService.downloadFile(fileUrl)

    return {
      buffer: result.buffer,
      contentType: result.contentType,
      filename: customFilename || result.filename,
      isLarge: result.isLarge,
    }
  },

  /**
   * Handle streaming download for large files
   */
  async handleStreamDownload(
    fileUrl: string,
    customFilename?: string
  ): Promise<{
    body: ReadableStream<Uint8Array> | null
    contentType: string
    filename: string
    contentLength?: string
  }> {
    const result = await DownloadService.streamLargeFile(fileUrl)

    return {
      body: result.body,
      contentType: result.contentType,
      filename: customFilename || result.filename,
      contentLength: result.contentLength,
    }
  },
}
