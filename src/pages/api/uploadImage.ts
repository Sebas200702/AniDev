import { pinata } from '@libs/pinata'
import { checkSession } from '@middlewares/auth'

import type { APIRoute } from 'astro'
import sharp from 'sharp'

export const POST: APIRoute = checkSession(async ({ request }) => {
  const { image, filename } = await request.json()

  if (!image) {
    return new Response(JSON.stringify({ message: 'Missing image data' }), {
      status: 400,
    })
  }

  const base64Pattern = /^data:([A-Za-z-+/]+);base64,(.+)$/
  let base64String = image
  const matches = image.match(base64Pattern)
  if (matches) {
    base64String = matches[2]
  }

  const buffer = Buffer.from(base64String, 'base64')

  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 150 })
    .webp({ quality: 75 })
    .toBuffer()

  if (!optimizedBuffer) {
    return new Response(
      JSON.stringify({ error: 'Error processing image (empty buffer)' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const newFile = new File([optimizedBuffer], filename || 'image.webp', {
    type: 'image/webp',
  })

  const { files } = await pinata.files.public.list()

  const existingFile = files.find((file) => file.name === filename)

  if (existingFile) {
    await pinata.files.public.delete([existingFile.id])
  }

  const { cid } = await pinata.upload.public.file(newFile)
  const url = await pinata.gateways.public.convert(cid)

  return new Response(JSON.stringify({ data: url }), { status: 200 })
})
