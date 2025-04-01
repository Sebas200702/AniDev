import { createClient } from 'redis'

/**
 * Redis client instance for caching and session management.
 *
 * @description This module initializes and exports a Redis client instance configured
 * with connection details for a Redis Cloud instance. The client is used throughout
 * the application for caching, rate limiting, and session management.
 *
 * The client is configured with:
 * - Username and password for authentication
 * - Redis Cloud host and port
 * - Error handling for connection issues
 *
 * The module includes:
 * - A configured Redis client instance
 * - Error event handler for client errors
 * - Connection function to establish Redis connection
 *
 * @example
 * // Connect to Redis
 * await connectRedis();
 *
 * // Set a value
 * await redis.set('key', 'value');
 *
 * // Get a value
 * const value = await redis.get('key');
 */
export const redis = createClient({
  username: 'default',
  password: 'c84gKiknzQ491k77kqEO1f9DUAnDPujA',
  socket: {
    host: 'redis-14957.crce181.sa-east-1-2.ec2.redns.redis-cloud.com',
    port: 14957,
  },
})

redis.on('error', (err) => {
  console.error('Redis Client Error', err)
})

/**
 * Establishes connection to the Redis server.
 *
 * @description This function attempts to connect to the Redis server using the configured
 * client instance. It includes proper error handling and logging for both successful
 * connections and connection failures.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established
 * or rejects if the connection fails
 *
 * @example
 * try {
 *   await connectRedis();
 *   console.log('Successfully connected to Redis');
 * } catch (error) {
 *   console.error('Failed to connect to Redis:', error);
 * }
 */
export const connectRedis = async () => {
  try {
    await redis.connect()
    console.log('Conectado a Redis')
  } catch (err) {
    console.error('Error al conectar con Redis:', err)
  }
}
