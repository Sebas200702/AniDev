import { createImageUrlProxy } from './create-image-url-proxy'

/**
 * Returns a URL that serves the image through our proxy, handling both remote URLs and blob: URLs.
 * For blob: URLs, it uploads the blob to /api/proxy via POST and returns a local object URL
 * to the optimized image response.
 */
export const buildProxiedImageSrc = async (
  src: string,
  width?: string,
  quality?: string,
  format?: string
): Promise<string> => {
  if (!src) return ''

  if (src.startsWith('blob:')) {
    const originalBlob = await fetch(src).then((r) => r.blob())
    const params = new URLSearchParams()
    if (width) params.set('w', width)
    if (quality) params.set('q', quality)
    if (format) params.set('format', format)

    const response = await fetch(`/api/proxy?${params.toString()}`, {
      method: 'POST',
      body: originalBlob,
    })
    if (!response.ok) throw new Error('Failed to proxy blob image')
    const optimizedBlob = await response.blob()
    return URL.createObjectURL(optimizedBlob)
  }

  return createImageUrlProxy(src, width, quality, format)
}
