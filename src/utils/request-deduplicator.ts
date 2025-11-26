import { createContextLogger } from '@libs/pino'

const logger = createContextLogger('RequestDeduplicator')
interface PendingRequest<T> {
  promise: Promise<T>
  timestamp: number
}

class RequestDeduplicator<T> {
  private pending = new Map<string, PendingRequest<T>>()
  private readonly cleanupInterval: NodeJS.Timeout
  private readonly maxAge = 30000 // 30 seconds

  constructor() {
    // Cleanup old pending requests every 10 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 10000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, request] of this.pending.entries()) {
      if (now - request.timestamp > this.maxAge) {
        this.pending.delete(key)
      }
    }
  }

  /**
   * Deduplicate concurrent requests for the same key
   *
   * @param key Unique identifier for the request
   * @param fn Function to execute if no pending request exists
   * @returns Promise with the result
   */
  async deduplicate(key: string, fn: () => Promise<T>): Promise<T> {
    // Check if there's already a pending request for this key
    const existing = this.pending.get(key)
    if (existing) {
      logger.info(`♻️  Deduplicating request for: ${key.substring(0, 50)}...`)
      return existing.promise
    }

    // Create new request
    const promise = fn()
      .then((result) => {
        // Clean up after successful completion
        this.pending.delete(key)
        return result
      })
      .catch((error) => {
        // Clean up after error
        this.pending.delete(key)
        throw error
      })

    this.pending.set(key, {
      promise,
      timestamp: Date.now(),
    })

    return promise
  }

  /**
   * Get statistics about pending requests
   */
  getStats() {
    return {
      pendingCount: this.pending.size,
      keys: Array.from(this.pending.keys()).map((k) => k.substring(0, 50)),
    }
  }

  /**
   * Clear all pending requests (useful for testing)
   */
  clear(): void {
    this.pending.clear()
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.pending.clear()
  }
}

// Global instance for image proxy requests
const imageProxyDeduplicator = new RequestDeduplicator<{
  buffer: Buffer
  mimeType: string
}>()

export { imageProxyDeduplicator, RequestDeduplicator }
