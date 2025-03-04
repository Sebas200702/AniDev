import { createClient } from 'redis'

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

export const connectRedis = async () => {
  try {
    await redis.connect()
    console.log('Conectado a Redis')
  } catch (err) {
    console.error('Error al conectar con Redis:', err)
  }
}
