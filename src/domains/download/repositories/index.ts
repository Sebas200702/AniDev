const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\.0\.0\.1$/,
  /^0\.0\.0\.0$/,
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
]

const MIME_TYPES: Record<string, string> = {
  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  json: 'application/json',

  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',

  // Audio/Video
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  webm: 'video/webm',

  // Archives
  zip: 'application/zip',
  rar: 'application/vnd.rar',
}

export const DownloadRepository = {
  /**
   * Validate URL for download
   */
  validateUrl(urlString: string): void {
    if (!urlString) {
      throw new Error('Missing "url" parameter')
    }

    try {
      const url = new URL(urlString)

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid URL protocol')
      }

      const hostname = url.hostname.toLowerCase()
      if (BLOCKED_PATTERNS.some((pattern) => pattern.test(hostname))) {
        throw new Error('Invalid URL')
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Invalid URL')) {
        throw error
      }
      throw new Error('Invalid URL')
    }
  },

  /**
   * Get MIME type from file extension
   */
  getMimeType(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase() || ''
    return MIME_TYPES[ext] || 'application/octet-stream'
  },

  /**
   * Extract filename from URL and Content-Disposition header
   */
  extractFilename(url: string, contentDisposition?: string | null): string {
    if (contentDisposition) {
      const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i
      const match = regex.exec(contentDisposition)
      if (match) {
        return match[1].replaceAll(/['"]/, '')
      }
    }
    return url.split('/').pop()?.split('?')[0] || 'download'
  },

  /**
   * Fetch file from URL
   */
  async fetchFile(url: string): Promise<{
    buffer: ArrayBuffer
    contentType: string
    filename: string
    contentLength?: string
  }> {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`)
    }

    const contentType =
      response.headers.get('content-type') || this.getMimeType(url)
    const contentLength = response.headers.get('content-length')
    const contentDisposition = response.headers.get('content-disposition')
    const filename = this.extractFilename(url, contentDisposition)

    const buffer = await response.arrayBuffer()

    return {
      buffer,
      contentType,
      filename,
      contentLength: contentLength || undefined,
    }
  },

  /**
   * Stream file from URL (for large files)
   */
  async streamFile(url: string): Promise<{
    body: ReadableStream<Uint8Array> | null
    contentType: string
    filename: string
    contentLength?: string
  }> {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`)
    }

    const contentType =
      response.headers.get('content-type') || this.getMimeType(url)
    const contentLength = response.headers.get('content-length')
    const contentDisposition = response.headers.get('content-disposition')
    const filename = this.extractFilename(url, contentDisposition)

    return {
      body: response.body,
      contentType,
      filename,
      contentLength: contentLength || undefined,
    }
  },
}
