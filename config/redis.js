const Redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = require("./envConfig");

// Replace with your actual Redis credentials
const redis = new Redis({
	host: REDIS_HOST, // e.g., 'localhost' or 'redis-12345.example.com'
	port: REDIS_PORT, // Default Redis port
	password: REDIS_PASS, // If a password is set
});

module.exports = redis;
