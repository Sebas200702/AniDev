import { DownloadRepository } from '@download/repositories'
import { AppError, isAppError } from '@shared/errors'

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
    try {
      DownloadRepository.validateUrl(url)

      const result = await DownloadRepository.fetchFile(url)

      if (result.buffer.byteLength > maxFileSize) {
        throw AppError.tooLarge('File too large', {
          maxMb: maxFileSize / 1024 / 1024,
          sizeBytes: result.buffer.byteLength,
        })
      }

      const isLarge = result.buffer.byteLength > LARGE_FILE_THRESHOLD

      return {
        buffer: result.buffer,
        contentType: result.contentType,
        filename: result.filename,
        isLarge,
      }
    } catch (error) {
      if (isAppError(error)) {
        throw error
      }

      throw AppError.externalApi('Failed to download file', {
        url,
        originalError: error,
      })
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
    try {
      DownloadRepository.validateUrl(url)
      return await DownloadRepository.streamFile(url)
    } catch (error) {
      if (isAppError(error)) {
        throw error
      }

      throw AppError.externalApi('Failed to stream large file', {
        url,
        originalError: error,
      })
    }
  },
}
