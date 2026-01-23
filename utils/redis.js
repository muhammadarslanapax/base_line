const { createClient } = require('redis');

// Create Redis client - support both URL and individual config
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });
} else {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    password: process.env.REDIS_PASSWORD || undefined,
  });
}

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err);
});

// OTP helper functions
const OTP_PREFIX = 'driver:otp:';
const OTP_EXPIRY = 600; // 10 minutes in seconds

/**
 * Store OTP in Redis
 * @param {string} email - Email address
 * @param {string} otp - OTP code
 * @returns {Promise<boolean>} - Success status
 */
const storeOTP = async (email, otp) => {
  try {
    const key = `${OTP_PREFIX}${email}`;
    await redisClient.setEx(key, OTP_EXPIRY, otp);
    return true;
  } catch (error) {
    console.error('Error storing OTP in Redis:', error);
    throw error;
  }
};

/**
 * Get OTP from Redis
 * @param {string} email - Email address
 * @returns {Promise<string|null>} - OTP code or null if not found/expired
 */
const getOTP = async (email) => {
  try {
    const key = `${OTP_PREFIX}${email}`;
    const otp = await redisClient.get(key);
    return otp;
  } catch (error) {
    console.error('Error getting OTP from Redis:', error);
    throw error;
  }
};

/**
 * Delete OTP from Redis
 * @param {string} email - Email address
 * @returns {Promise<boolean>} - Success status
 */
const deleteOTP = async (email) => {
  try {
    const key = `${OTP_PREFIX}${email}`;
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting OTP from Redis:', error);
    throw error;
  }
};

module.exports = {
  redisClient,
  storeOTP,
  getOTP,
  deleteOTP,
};