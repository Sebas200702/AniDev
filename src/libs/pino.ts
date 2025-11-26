import pino from 'pino'

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Main Pino logger instance with environment-specific configuration.
 *
 * Development: Uses pino-pretty for human-readable colored output
 * Production: Uses JSON format for structured logging and log aggregation
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Pretty printing only in development
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: false,
          errorLikeObjectKeys: ['err', 'error'],
        },
      }
    : undefined,

  // Base context included in all logs
  base: {
    env: process.env.NODE_ENV,
    app: 'anidev',
  },

  // Custom error serialization for better error tracking
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  // Format timestamps consistently
  timestamp: pino.stdTimeFunctions.isoTime,

  // Redact sensitive information in production
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    censor: '[REDACTED]',
  },
})

/**
 * Creates a context-aware logger with consistent structured logging patterns.
 *
 * @param context - The context identifier (e.g., service name, component name)
 * @returns Logger object with info, error, warn, and debug methods
 *
 * @example
 * const logger = createContextLogger('UserService')
 * logger.info('User logged in', { userId: '123' })
 * logger.error('Failed to fetch user', error)
 */
export const createContextLogger = (context: string) => {
  return {
    /**
     * Log informational messages
     * @param msg - The log message
     * @param data - Additional structured data to log
     */
    info: (msg: string, data?: any) => {
      logger.info({ context, ...data }, msg)
    },

    /**
     * Log error messages with proper error serialization
     * @param msg - The error message
     * @param error - Error object or additional data
     */
    error: (msg: string, error?: any) => {
      // If error is an Error object, use proper serialization
      if (error instanceof Error) {
        logger.error({ context, err: error }, msg)
      } else {
        logger.error({ context, error }, msg)
      }
    },

    /**
     * Log warning messages
     * @param msg - The warning message
     * @param data - Additional structured data to log
     */
    warn: (msg: string, data?: any) => {
      logger.warn({ context, ...data }, msg)
    },

    /**
     * Log debug messages (only in development or when LOG_LEVEL=debug)
     * @param msg - The debug message
     * @param data - Additional structured data to log
     */
    debug: (msg: string, data?: any) => {
      logger.debug({ context, ...data }, msg)
    },
  }
}
