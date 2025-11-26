export interface CacheEntry<T> {
  key: string
  value: T
  ttl?: number // Time to live in seconds
}

export enum TtlValues {
  MINUTE = 60, // 1 minute
  HOUR = 3600, // 1 hour
  DAY = 86400, // 24 hours
  WEEK = 604800, // 7 days
  MONTH = 2592000, // 30 days
  YEAR = 31536000, // 365 days
}
