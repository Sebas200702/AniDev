import type { ImagePayload, UserInfo } from 'types'

export const uploadImages = async (
  payload: ImagePayload & { withPrompt?: boolean }, // 👈 agregamos la bandera
  userInfo: UserInfo | null,
  url: string
) => {
  if (!payload.image) {
    return payload.isBanner
      ? { data: userInfo?.banner_image }
      : { data: userInfo?.avatar }
  }

  const sendFormData = async (blob: Blob) => {
    const form = new FormData()
    const file = new File([blob], 'image.webp', {
      type: blob.type || 'image/webp',
    })
    form.set('file', file)
    form.set('isBanner', String(!!payload.isBanner))

    if (payload.withPrompt) {
      form.set('prompt', payload.prompt || '') // 👈 si editing, mandamos el prompt
    }

    const res = await fetch(url, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) throw new Error('Error While upload Image')
    const { data } = await res.json()
    return { data }
  }

  const sendJson = async () => {
    const body: any = {
      image: payload.image,
      isBanner: payload.isBanner,
    }

    if (payload.withPrompt) {
      body.prompt = payload.prompt || ''
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error('Error While upload Image')
    const { data } = await response.json()
    return { data }
  }

  if (payload.image?.startsWith('blob:')) {
    const blob = await fetch(payload.image).then((r) => r.blob())
    return sendFormData(blob)
  }
  return await sendJson()
}
