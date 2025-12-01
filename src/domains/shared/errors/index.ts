const ERROR_TYPES = {
  validation: { status: 400, operational: true },
  notFound: { status: 404, operational: true },
  permission: { status: 403, operational: true },
  unauthorized: { status: 401, operational: true },
  timeout: { status: 408, operational: true },
  conflict: { status: 409, operational: true },
  gone: { status: 410, operational: true },
  tooLarge: { status: 413, operational: true },
  tooManyRequests: { status: 429, operational: true },
  network: { status: 502, operational: true },
  externalApi: { status: 502, operational: true },
  serviceUnavailable: { status: 503, operational: true },
  gatewayTimeout: { status: 504, operational: true },
  database: { status: 500, operational: true },
  cache: { status: 500, operational: true },
  configuration: { status: 500, operational: false },
  invalidState: { status: 500, operational: true },
  notImplemented: { status: 501, operational: false },
} as const

type ErrorType = keyof typeof ERROR_TYPES

interface ErrorMetadata {
  readonly type: ErrorType
  readonly status: number
  readonly operational: boolean
  readonly context?: Record<string, unknown>
  readonly timestamp: Date
}

function createError(
  type: ErrorType,
  message: string,
  context?: Record<string, unknown>
): Error & ErrorMetadata {
  const config = ERROR_TYPES[type]
  const error = new Error(message) as Error & ErrorMetadata

  Object.defineProperties(error, {
    type: { value: type, enumerable: true },
    status: { value: config.status, enumerable: true },
    operational: { value: config.operational, enumerable: true },
    context: { value: context, enumerable: true },
    timestamp: { value: new Date(), enumerable: true },
  })

  error.name = `${type.charAt(0).toUpperCase() + type.slice(1)}Error`
  return error
}

export const AppError = {
  validation: (msg: string, ctx?: Record<string, unknown>) =>
    createError('validation', msg, ctx),
  notFound: (msg: string, ctx?: Record<string, unknown>) =>
    createError('notFound', msg, ctx),
  permission: (msg: string, ctx?: Record<string, unknown>) =>
    createError('permission', msg, ctx),
  unauthorized: (msg: string, ctx?: Record<string, unknown>) =>
    createError('unauthorized', msg, ctx),
  timeout: (msg: string, ctx?: Record<string, unknown>) =>
    createError('timeout', msg, ctx),
  conflict: (msg: string, ctx?: Record<string, unknown>) =>
    createError('conflict', msg, ctx),
  gone: (msg: string, ctx?: Record<string, unknown>) =>
    createError('gone', msg, ctx),
  tooLarge: (msg: string, ctx?: Record<string, unknown>) =>
    createError('tooLarge', msg, ctx),
  tooManyRequests: (msg: string, ctx?: Record<string, unknown>) =>
    createError('tooManyRequests', msg, ctx),
  network: (msg: string, ctx?: Record<string, unknown>) =>
    createError('network', msg, ctx),
  externalApi: (msg: string, ctx?: Record<string, unknown>) =>
    createError('externalApi', msg, ctx),
  serviceUnavailable: (msg: string, ctx?: Record<string, unknown>) =>
    createError('serviceUnavailable', msg, ctx),
  gatewayTimeout: (msg: string, ctx?: Record<string, unknown>) =>
    createError('gatewayTimeout', msg, ctx),
  database: (msg: string, ctx?: Record<string, unknown>) =>
    createError('database', msg, ctx),
  cache: (msg: string, ctx?: Record<string, unknown>) =>
    createError('cache', msg, ctx),
  configuration: (msg: string, ctx?: Record<string, unknown>) =>
    createError('configuration', msg, ctx),
  invalidState: (msg: string, ctx?: Record<string, unknown>) =>
    createError('invalidState', msg, ctx),
  notImplemented: (msg: string, ctx?: Record<string, unknown>) =>
    createError('notImplemented', msg, ctx),
}

export function isAppError(error: unknown): error is Error & ErrorMetadata {
  return error instanceof Error && 'type' in error && 'status' in error
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}

export function getHttpStatus(error: unknown): number {
  return isAppError(error) ? error.status : 500
}

export function formatError(error: unknown) {
  if (isAppError(error)) {
    return {
      message: error.message,
      type: error.type,
      context:
        process.env.NODE_ENV === 'development' ? error.context : undefined,
    }
  }
  return { message: getErrorMessage(error) }
}

export type { ErrorType, ErrorMetadata }
