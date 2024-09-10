const dotenv = require("dotenv");

dotenv.config();

// Export all environment variables from .env file
module.exports = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	SALT: Number(process.env.SALT),
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASS: process.env.REDIS_PASS,
};
