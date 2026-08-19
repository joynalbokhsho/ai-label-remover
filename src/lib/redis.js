import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize a singleton connection to prevent multiple connections in development
const globalForRedis = global;

const redis = globalForRedis.redis || new Redis(redisUrl);

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

export default redis;
