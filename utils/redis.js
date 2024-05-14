import redis from 'redis';
import { promisify } from 'util';

/**
 * Class for performing operations with Redis service
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
    this.client.on('connect', () => {
      //   console.log('Redis client connected to the server');
    });
  }

  /**
   * Check if connection to Redis is Alive
   * @return true if connection alive or false if not
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * get value corresponding to key in redis
   * @key {string} key to search for in redis
   * @return {string} value of key
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Create a new key in redis with a specific TTL
   * @key {string} key to be saved in redis
   * @value {string} value to be asigned to key
   * @duration {number} TTL of key
   * @return {undefined}  No return
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * Delete key in redis service
   * @key {string} key to be deleted
   * @return {undefined} No return
   */
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = RedisClient();
module.exports = redisClient;
