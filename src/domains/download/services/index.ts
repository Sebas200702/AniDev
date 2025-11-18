import { DownloadRepository } from '@download/repositories'

const MAX_FILE_SIZE = 300 * 1024 * 1024 // 300MB
const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024 // 10MB

export const DownloadService = {
  /**
   * Download and process file
   */
  async downloadFile(
    url: string,
    maxFileSize: number = MAX_FILE_SIZE
  ): Promise<{
    buffer: ArrayBuffer
    contentType: string
    filename: string
    isLarge: boolean
  }> {
    DownloadRepository.validateUrl(url)

    const result = await DownloadRepository.fetchFile(url)

    if (result.buffer.byteLength > maxFileSize) {
      throw new Error(`File too large (max ${maxFileSize / 1024 / 1024}MB)`)
    }

    const isLarge = result.buffer.byteLength > LARGE_FILE_THRESHOLD

    return {
      buffer: result.buffer,
      contentType: result.contentType,
      filename: result.filename,
      isLarge,
    }
  },

  /**
   * Stream large file without loading into memory
   */
  async streamLargeFile(url: string): Promise<{
    body: ReadableStream<Uint8Array> | null
    contentType: string
    filename: string
    contentLength?: string
  }> {
    DownloadRepository.validateUrl(url)
    return await DownloadRepository.streamFile(url)
  },
}
