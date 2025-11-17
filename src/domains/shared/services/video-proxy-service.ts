export const VideoProxyService = {
  /**
   * Fetch and process video resource
   */
  async fetchResource(resourceUrl: string, origin: string) {
    try {
      const response = await fetch(resourceUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch resource: ${response.status}`)
      }

      // Handle HLS playlist
      if (resourceUrl.endsWith('.m3u8')) {
        const originalText = await response.text()
        const modifiedText = this.processM3U8(originalText, resourceUrl, origin)

        return {
          type: 'playlist' as const,
          content: modifiedText,
          contentType: 'application/vnd.apple.mpegurl',
        }
      }

      // Handle video stream
      const contentType =
        response.headers.get('Content-Type') ?? 'application/octet-stream'
      const stream = response.body

      if (!stream) {
        throw new Error('No stream available')
      }

      return {
        type: 'stream' as const,
        stream,
        contentType,
      }
    } catch (error) {
      console.error('[VideoProxyService.fetchResource] Error:', error)
      throw error
    }
  },

  /**
   * Process M3U8 playlist to rewrite segment URLs
   */
  processM3U8(content: string, resourceUrl: string, origin: string): string {
    return content.replaceAll(/(^(?!https?:\/\/)[^\s#]+\.ts)/gm, (match) => {
      const baseUrl = resourceUrl.replace(/[^/]+$/, '')
      return `${origin}/api/videoProxy?url=${encodeURIComponent(baseUrl + match)}`
    })
  },
}
