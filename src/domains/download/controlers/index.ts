import { DownloadService } from '@download/services'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'

const getCorsHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': '*',
  'Access-Control-Max-Age': '86400',
})

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
   * Get CORS headers
   */
  getCorsHeaders,

  /**
   * Handle complete download request with caching
   */
  async handleDownloadRequest(url: URL): Promise<{
    buffer: Buffer
    contentType: string
    filename: string
    forceDownload: boolean
    corsHeaders: Record<string, string>
  }> {
    const { fileUrl, customFilename, forceDownload } = this.validateParams(url)
    const cacheKey = CacheUtils.generateKey('download', fileUrl)

    // Try to get from cache
    const cachedData = await CacheUtils.get<{
      data: string
      contentType: string
      filename: string
      forceDownload: boolean
    }>(cacheKey)

    if (cachedData) {
      return {
        buffer: Buffer.from(cachedData.data, 'base64'),
        contentType: cachedData.contentType,
        filename: customFilename || cachedData.filename,
        forceDownload: forceDownload || cachedData.forceDownload,
        corsHeaders: getCorsHeaders(),
      }
    }

    // Download file
    const result = await DownloadService.downloadFile(fileUrl)

    // Handle large files without caching
    if (result.isLarge) {
      throw new Error('LARGE_FILE') // Signal to use streaming
    }

    // Cache small files
    const buffer = Buffer.from(result.buffer)
    const cacheData = {
      data: buffer.toString('base64'),
      contentType: result.contentType,
      filename: result.filename,
      forceDownload,
    }

    await CacheUtils.set(cacheKey, cacheData, { ttl: CacheTTL.ONE_WEEK })

    return {
      buffer,
      contentType: result.contentType,
      filename: customFilename || result.filename,
      forceDownload,
      corsHeaders: getCorsHeaders(),
    }
  },

  /**
   * Handle streaming download for large files
   */
  async handleStreamDownload(url: URL): Promise<{
    body: ReadableStream<Uint8Array> | null
    contentType: string
    filename: string
    contentLength?: string
    forceDownload: boolean
    corsHeaders: Record<string, string>
  }> {
    const { fileUrl, customFilename, forceDownload } = this.validateParams(url)
    const result = await DownloadService.streamLargeFile(fileUrl)

    return {
      body: result.body,
      contentType: result.contentType,
      filename: customFilename || result.filename,
      contentLength: result.contentLength,
      forceDownload,
      corsHeaders: getCorsHeaders(),
    }
  },
}
