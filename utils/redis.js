const redis = require("redis");
const { promisify } = require("util");

/**
 * RedisClient - Class for performing operations with Redis service
 */
class RedisClient {
  /**
   * Creates an instance of RedisClient.
   */
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.client.on("error", (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
    this.client.on("connect", () => {
      console.log("Redis client connected to the server");
    });
  }

  /**
   * Check if connection to Redis is alive.
   * @returns {boolean} True if connection is alive, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value corresponding to the key in Redis.
   * @param {string} key - The key to search for in Redis.
   * @returns {Promise<string>} The value associated with the key.
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Create a new key in Redis with a specific TTL.
   * @param {string} key - The key to be saved in Redis.
   * @param {string} value - The value to be assigned to the key.
   * @param {number} duration - The TTL of the key.
   * @returns {undefined} No return value.
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * Delete a key from the Redis service.
   * @param {string} key - The key to be deleted.
   * @returns {undefined} No return value.
   */
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
