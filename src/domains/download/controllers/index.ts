import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
import { DownloadService } from '@download/services'
import { AppError } from '@shared/errors'

const getCorsHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Expose-Headers':
    'Content-Type, Content-Disposition, Content-Length',
  'Access-Control-Max-Age': '86400',
})

export const DownloadController = {
  validateParams(url: URL): {
    fileUrl: string
    customFilename?: string
    forceDownload?: boolean
  } {
    const fileUrl = url.searchParams.get('url')

    if (!fileUrl) {
      throw AppError.validation('Missing "url" parameter')
    }

    const customFilename = url.searchParams.get('filename') || undefined
    const downloadParam = url.searchParams.get('download')

    let forceDownload: boolean | undefined
    if (downloadParam === 'true') {
      forceDownload = true
    } else if (downloadParam === 'false') {
      forceDownload = false
    } else {
      forceDownload = undefined
    }

    return { fileUrl, customFilename, forceDownload }
  },

  getCorsHeaders,

  async handleDownloadRequest(url: URL): Promise<
    | {
        type: 'data'
        buffer: Buffer
        contentType: string
        filename: string
        forceDownload: boolean
        corsHeaders: Record<string, string>
      }
    | { type: 'stream'; requiresStreaming: true }
  > {
    const { fileUrl, customFilename, forceDownload } = this.validateParams(url)
    const cacheKey = CacheService.generateKey('download', fileUrl)

    const cachedData = await CacheService.get<{
      data: string
      contentType: string
      filename: string
      forceDownload: boolean
    }>(cacheKey)

    if (cachedData) {
      return {
        type: 'data',
        buffer: Buffer.from(cachedData.data, 'base64'),
        contentType: cachedData.contentType,
        filename: customFilename || cachedData.filename,
        forceDownload: forceDownload ?? cachedData.forceDownload,
        corsHeaders: getCorsHeaders(),
      }
    }

    const result = await DownloadService.downloadFile(fileUrl)

    if (result.isLarge) {
      return { type: 'stream', requiresStreaming: true }
    }

    const buffer = Buffer.from(result.buffer)
    const cacheData = {
      data: buffer.toString('base64'),
      contentType: result.contentType,
      filename: result.filename,
      forceDownload,
    }

    await CacheService.set<typeof cacheData>(
      cacheKey,
      cacheData,
      TtlValues.HOUR
    )

    return {
      type: 'data',
      buffer,
      contentType: result.contentType,
      filename: customFilename || result.filename,
      forceDownload: forceDownload ?? false,
      corsHeaders: getCorsHeaders(),
    }
  },

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
      forceDownload: forceDownload ?? false,
      corsHeaders: getCorsHeaders(),
    }
  },
}
