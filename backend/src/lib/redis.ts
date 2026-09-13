import RedisPackage from 'ioredis';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not configured");
}
else console.log(process.env.REDIS_URL.slice(0,20));

// Connects to REDIS_URL
const redis = new RedisPackage.Redis(process.env.REDIS_URL);

// Event listeners to monitor connection state
redis.on('connect', () => console.info('Redis client connected!'));
redis.on('error', (err: any) => console.error(`Redis Error: ${err}`));

export default redis;