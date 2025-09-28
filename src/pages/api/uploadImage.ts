import { pinata } from '@libs/pinata'
import { checkSession } from '@middlewares/auth'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'
import sharp from 'sharp'

/**
 * uploadImage endpoint handles image uploads and storage using IPFS.
 *
 * @summary
 * An API endpoint that processes, optimizes, and stores images using Pinata IPFS.
 *
 * @description
 * This endpoint handles image uploads with authentication, processing the images
 * before storage. It accepts base64-encoded images, optimizes them using Sharp,
 * and stores them on IPFS through Pinata. The endpoint includes automatic
 * cleanup of existing files with the same name and returns the IPFS URL.
 *
 * The endpoint implements image optimization with specific parameters:
 * - Resizes images to 150px width
 * - Converts to WebP format with 75% quality
 * - Handles both raw base64 and data URL formats
 *
 * @features
 * - Authentication: Requires valid user session
 * - Image optimization: Resize and format conversion
 * - IPFS storage: Uses Pinata for decentralized storage
 * - Duplicate handling: Automatic cleanup of existing files
 * - Error handling: Comprehensive error handling
 * - Base64 support: Handles both raw and data URL formats
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {Request} context.request - The HTTP request containing image data
 * @param {Object} context.request.json() - Request body containing image and filename
 * @param {string} context.request.json().image - Base64 encoded image data
 * @param {string} [context.request.json().filename] - Optional filename for the image
 * @returns {Promise<Response>} A Response object containing the IPFS URL or error message
 *
 * @example
 * // Request
 * POST /api/uploadImage
 * Content-Type: application/json
 *
 * {
 *   "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
 *   "filename": "profile-picture.webp"
 * }
 *
 * // Success Response (200)
 * {
 *   "data": "https://ipfs.io/ipfs/Qm..."
 * }
 *
 * // Error Response (400)
 * {
 *   "message": "Missing image data"
 * }
 */

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/avif',
]

const fetchImageViaUrl = async (
  image: string,
  requestUrl: string,
  fallbackType?: string
) => {
  const absoluteUrl = new URL(image, requestUrl).toString()
  const response = await fetch(absoluteUrl, {
    signal: AbortSignal.timeout(10000),
    headers: {
      'User-Agent': 'AniDev-ImageUpload/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image data: ${response.status} ${response.statusText}`
    )
  }

  const arrayBuffer = await response.arrayBuffer()
  const mimeType =
    response.headers.get('content-type') || fallbackType || 'image/webp'

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
  }
}

const parseBase64Image = (image: string, type?: string) => {
  const base64Pattern = /^data:([A-Za-z-+/]+);base64,(.+)$/
  const matches = base64Pattern.exec(image)

  if (!matches && !/^([A-Za-z0-9+/]*={0,2})$/.test(image)) {
    throw new Error(
      'Invalid image data format. Expected base64 string or data URL.'
    )
  }

  const mimeType = matches ? matches[1] : type || 'image/webp'
  const base64String = matches ? matches[2] : image
  const buffer = Buffer.from(base64String, 'base64')
  return { buffer, mimeType }
}

const parseImageData = async (
  image: string,
  type: string | undefined,
  requestUrl: string
) => {
  if (image.startsWith('http') || image.startsWith('/')) {
    try {
      return await fetchImageViaUrl(image, requestUrl, type)
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        throw new Error(
          `Network error: Unable to fetch image from ${image}. Check if the URL is accessible.`
        )
      }
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error(
          `Request timeout: Unable to fetch image from ${image} within 10 seconds.`
        )
      }
      throw error
    }
  }
  return parseBase64Image(image, type)
}

const processImage = async (
  buffer: Buffer,
  mimeType: string,
  filename?: string,
  isBanner = false
) => {
  console.log('Processing image:', {
    bufferSize: buffer.length,
    mimeType,
    filename,
    isBanner,
  })

  const isSupported = SUPPORTED_FORMATS.some((format) =>
    mimeType?.includes(format.replace('image/', ''))
  )
  const isGif = mimeType === 'image/gif'

  if (isGif || !isSupported) {
    console.log('Using original buffer (GIF or unsupported format)')
    return {
      buffer,
      filename: filename ?? (isGif ? 'image.gif' : 'image.webp'),
      mimeType: isGif ? 'image/gif' : 'image/webp',
    }
  }

  try {
    const optimizedBuffer = isBanner
      ? await sharp(buffer)
          .resize({ width: 1920 })
          .webp({ quality: 100 })
          .toBuffer()
      : await sharp(buffer)
          .resize({ width: 240 })
          .webp({ quality: 100 })
          .toBuffer()

    return {
      buffer: optimizedBuffer,
      filename: filename ?? 'image.webp',
      mimeType: 'image/webp',
    }
  } catch (error) {
    console.warn('Sharp processing failed, using original buffer:', error)
    return {
      buffer,
      filename: filename ?? 'image.webp',
      mimeType: 'image/webp',
    }
  }
}

const uploadToPinata = async (
  buffer: Buffer,
  filename: string,
  mimeType: string
) => {
  console.log('Uploading to Pinata:', {
    filename,
    mimeType,
    size: buffer.length,
  })

  const newFile = new File([new Uint8Array(buffer)], filename, { type: mimeType })

  try {
    const listAndDeleteByName = async () => {
      try {
        const { files } = await pinata.files.public.list()
        const matches = files.filter((file) => file.name === filename)
        if (matches.length > 0) {
          console.log(
            `Found ${matches.length} existing files with name ${filename}, deleting...`
          )
          const fileIds = matches.map((file) => file.id)
          await pinata.files.public.delete(fileIds)
        }
        return matches
      } catch {
        return []
      }
    }

    await listAndDeleteByName()
    await new Promise((r) => setTimeout(r, 400))

    const tryUpload = async () => {
      const { cid } = await pinata.upload.public.file(newFile)
      const url = await pinata.gateways.public.convert(cid)
      console.log('Upload successful, URL:', url)
      return url
    }

    try {
      return await tryUpload()
    } catch (err: any) {
      const message = String(err?.details?.error || err?.message || '')
      const isDuplicate = message.includes('duplicate key value')

      console.log('Upload error:', { message, isDuplicate })

      if (!isDuplicate) throw err

      console.log('Handling duplicate error, retrying...')
      await listAndDeleteByName()
      await new Promise((r) => setTimeout(r, 800))

      try {
        return await tryUpload()
      } catch (err2: any) {
        try {
          const { files } = await pinata.files.public.list()
          const existing = files.find((f) => f.name === filename)
          if (existing) {
            const url = await pinata.gateways.public.convert(existing.cid)

            return url
          }
        } catch (listError) {
          console.error('Error finding existing file:', listError)
        }
        throw err2
      }
    }
  } catch (error: any) {
    console.error('Pinata upload error:', error)
    throw new Error(`Upload failed: ${error?.message || 'Unknown error'}`)
  }
}

const mapProcessingError = (error: unknown) => {
  let errorMessage = 'Invalid image data'
  let statusCode = 400
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Unable to fetch image from provided URL'
      statusCode = 422
    } else if (
      error.message.includes('Network error') ||
      error.message.includes('Upload failed')
    ) {
      errorMessage = error.message
      statusCode = 502
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout while fetching image'
      statusCode = 504
    }
  }
  return { errorMessage, statusCode }
}

const handleMultipart = async (request: Request, userId: string) => {
  const form = await request.formData()
  const file = form.get('file') as File | null
  const isBanner = (form.get('isBanner') as string) === 'true'

  if (!file) {
    return new Response(JSON.stringify({ message: 'Missing file' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const processed = await processImage(buffer, file.type, file.name, isBanner)
  const finalName = isBanner ? `${userId}-banner.webp` : `${userId}-avatar.webp`
  const url = await uploadToPinata(
    processed.buffer,
    finalName,
    processed.mimeType
  )

  return new Response(JSON.stringify({ data: url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

const handleJson = async (request: Request, userId: string) => {
  const body = await request.json()
  const { image, filename, type, isBanner } = body

  if (!image) {
    return new Response(JSON.stringify({ message: 'Missing image data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (image.startsWith('blob:')) {
    return new Response(
      JSON.stringify({
        error:
          'Blob URL received. Please send the file via multipart/form-data (field "file").',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { buffer, mimeType } = await parseImageData(image, type, request.url)
  const processed = await processImage(buffer, mimeType, filename, isBanner)
  const finalName = isBanner ? `${userId}-banner.webp` : `${userId}-avatar.webp`
  const url = await uploadToPinata(
    processed.buffer,
    finalName,
    processed.mimeType
  )

  return new Response(JSON.stringify({ data: url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const userInfo = await getSessionUserInfo({
      request,
      accessToken: cookies.get('sb-access-token')?.value,
      refreshToken: cookies.get('sb-refresh-token')?.value,
    })

    if (!userInfo?.id) {
      console.log('Unauthorized access attempt')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      try {
        return await handleMultipart(request, userInfo.id)
      } catch (error) {
        const { errorMessage, statusCode } = mapProcessingError(error)
        return new Response(JSON.stringify({ error: errorMessage }), {
          status: statusCode,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    try {
      return await handleJson(request, userInfo.id)
    } catch (error) {
      const { errorMessage, statusCode } = mapProcessingError(error)
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Unexpected error in upload handler:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
