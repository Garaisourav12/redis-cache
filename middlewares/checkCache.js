const redis = require("../config/redis");

const checkCache = async (req, res, next) => {
	const { id } = req.user;

	try {
		const user = await redis.get(id);
		if (user) {
			return res.status(200).json({
				success: true,
				source: "cache",
				message: "Current user profile fetched successfully!",
				data: JSON.parse(user),
				statusCode: 200,
			});
		}

		next();
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			success: false,
			error:
				error instanceof HttpError
					? error.message
					: "Internal Server Error",
			statusCode: error.statusCode || 500,
		});
	}
};

module.exports = checkCache;
