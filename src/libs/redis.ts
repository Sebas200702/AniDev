import { createClient } from 'redis'

export const redis = createClient({
  username: 'default',
  password: import.meta.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-11912.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
    port: 11912,
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
