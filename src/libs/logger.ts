/**
 * Universal Logger
 *
 * Works in both server (Node.js) and client (browser) environments.
 * - Server: Uses Pino for structured logging
 * - Client: Uses console with context prefix
 */

interface Logger {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
}

const isServer = globalThis.window === undefined

/**
 * Create a logger with context prefix
 */
export function createLogger(context: string): Logger {
  const prefix = `[${context}]`

  if (isServer) {
    // Server-side: Use Pino (lazy import to avoid bundling in client)
    let pinoLogger: any = null

    const getPinoLogger = async () => {
      if (!pinoLogger) {
        const { createContextLogger } = await import('@libs/pino')
        pinoLogger = createContextLogger(context)
      }
      return pinoLogger
    }

    return {
      debug: (...args: unknown[]) => {
        getPinoLogger().then((logger) => {
          const [msg, ...rest] = args
          logger.debug(String(msg), ...rest)
        })
      },
      info: (...args: unknown[]) => {
        getPinoLogger().then((logger) => {
          const [msg, ...rest] = args
          logger.info(String(msg), ...rest)
        })
      },
      warn: (...args: unknown[]) => {
        getPinoLogger().then((logger) => {
          const [msg, ...rest] = args
          logger.warn(String(msg), ...rest)
        })
      },
      error: (...args: unknown[]) => {
        getPinoLogger().then((logger) => {
          const [msg, ...rest] = args
          logger.error(String(msg), ...rest)
        })
      },
    }
  }

  // Client-side: Use console with prefix
  return {
    debug: (message: string, ...args: unknown[]) => {
      console.debug(prefix, message, ...args)
    },
    info: (message: string, ...args: unknown[]) => {
      console.info(prefix, message, ...args)
    },
    warn: (message: string, ...args: unknown[]) => {
      console.warn(prefix, message, ...args)
    },
    error: (message: string, ...args: unknown[]) => {
      console.error(prefix, message, ...args)
    },
  }
}

/**
 * Simple client-safe logger (synchronous version for client components)
 *
 * Safe for SSR + Hydration: Silent on server, logs only in browser
 */
export const clientLogger = {
  create(context: string) {
    const prefix = `[${context}]`

    // Runtime check function - evaluates fresh each time
    const isBrowser = () => globalThis.window !== undefined

    return {
      debug: (...args: unknown[]) => {
        if (!isBrowser()) return
        console.debug(prefix, ...args)
      },
      info: (...args: unknown[]) => {
        if (!isBrowser()) return
        console.info(prefix, ...args)
      },
      warn: (...args: unknown[]) => {
        if (!isBrowser()) return
        console.warn(prefix, ...args)
      },
      error: (...args: unknown[]) => {
        if (!isBrowser()) return
        console.error(prefix, ...args)
      },
    }
  },
}
