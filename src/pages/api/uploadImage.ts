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

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  const userInfo = await getSessionUserInfo({
    request,
    accessToken: cookies.get('sb-access-token')?.value,
    refreshToken: cookies.get('sb-refresh-token')?.value,
  })
  const user = userInfo?.name
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const { image, filename, type } = await request.json()

  if (!image) {
    return new Response(JSON.stringify({ message: 'Missing image data' }), {
      status: 400,
    })
  }

  const base64Pattern = /^data:([A-Za-z-+/]+);base64,(.+)$/
  let base64String = image
  let mimeType = type

  const matches = image.match(base64Pattern)
  if (matches) {
    mimeType = matches[1]
    base64String = matches[2]
  }

  const buffer = Buffer.from(base64String, 'base64')

  let optimizedBuffer: Buffer
  let outputFilename = filename ?? 'image.webp'
  let outputMime = 'image/webp'

  if (mimeType === 'image/gif') {
    optimizedBuffer = buffer
    outputFilename = filename ?? 'image.gif'
    outputMime = 'image/gif'
  } else {
    optimizedBuffer = await sharp(buffer)
      .resize({ width: 150 })
      .webp({ quality: 75 })
      .toBuffer()
  }

  if (!optimizedBuffer) {
    return new Response(JSON.stringify({ error: 'Error processing image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const newFile = new File([optimizedBuffer], outputFilename, {
    type: outputMime,
  })

  const { files } = await pinata.files.public.list()
  const existingFile = files.find((file) => file.name === newFile.name)

  if (existingFile) {
    await pinata.files.public.delete([existingFile.id])
  }

  const { cid } = await pinata.upload.public.file(newFile)
  const url = await pinata.gateways.public.convert(cid)

  return new Response(JSON.stringify({ data: url }), {
    status: 200,
  })
})
