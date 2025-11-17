import fs from 'node:fs/promises'
import path from 'node:path'
import { pinata } from '@libs/pinata'

export const SUPPORTED_FORMATS: ReadonlySet<string> = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/avif',
  'image/gif',
])

export const ImageRepository = {
  /**
   * Upload image buffer to IPFS
   */
  async uploadToIPFS(buffer: Buffer, filename: string, mimeType: string) {
    try {
      const newFile = new File([new Uint8Array(buffer)], filename, {
        type: mimeType,
      })

      // Try to delete existing file with same name
      try {
        const { files } = await pinata.files.public.list()
        const matches = files.filter((file) => file.name === filename)
        if (matches.length > 0) {
          const fileIds = matches.map((file) => file.id)
          await pinata.files.public.delete(fileIds)
          await new Promise((r) => setTimeout(r, 400))
        }
      } catch (deleteError) {
        console.warn('[ImageRepository] Error cleaning old files:', deleteError)
      }

      const { cid } = await pinata.upload.public.file(newFile)
      const url = await pinata.gateways.public.convert(cid)
      return url
    } catch (error) {
      throw new Error(
        `Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Delete existing file from IPFS
   */
  async deleteFromIPFS(filename: string) {
    try {
      const { files } = await pinata.files.public.list()
      const matches = files.filter((file) => file.name === filename)

      if (matches.length > 0) {
        const fileIds = matches.map((file) => file.id)
        await pinata.files.public.delete(fileIds)
      }
    } catch (error) {
      console.warn('[ImageRepository.deleteFromIPFS] Error:', error)
      // Don't throw - file might not exist
    }
  },

  /**
   * Get placeholder image buffer
   */
  async getPlaceholder(): Promise<Buffer> {
    const placeholderPath = path.resolve(
      process.cwd(),
      'public',
      'placeholder.webp'
    )
    return fs.readFile(placeholderPath)
  },

  /**
   * Fetch image from URL
   */
  async fetchImage(
    imageUrl: string,
    requestUrl: string,
    fallbackType?: string
  ) {
    const absoluteUrl = new URL(imageUrl, requestUrl).toString()
    const response = await fetch(absoluteUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'AniDev-ImageUpload/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const mimeType =
      response.headers.get('content-type') || fallbackType || 'image/webp'

    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType,
    }
  },

  /**
   * Parse base64 image data
   */
  parseBase64(imageData: string, type?: string) {
    const base64Pattern = /^data:([A-Za-z-+/]+);base64,(.+)$/
    const matches = base64Pattern.exec(imageData)

    if (matches) {
      const [, mimeType, base64Data] = matches
      return {
        buffer: Buffer.from(base64Data, 'base64'),
        mimeType,
      }
    }

    // Raw base64 without data URL prefix
    return {
      buffer: Buffer.from(imageData, 'base64'),
      mimeType: type || 'image/webp',
    }
  },

  /**
   * Validate image format
   */
  isValidFormat(mimeType: string): boolean {
    return SUPPORTED_FORMATS.has(mimeType)
  },
}
