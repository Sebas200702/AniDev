import { checkSession } from '@middlewares/auth'
import { UploadController } from '@shared/controlers/upload-controller'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request }) => {
  try {
    const url = await UploadController.handleUpload(request)
    return ResponseBuilder.success({ data: url })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/uploadImage')
  }
})
