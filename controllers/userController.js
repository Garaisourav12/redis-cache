const {
	createUser,
	loginUser,
	getUserById,
	logoutUser,
} = require("../services/user");

const register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const user = await createUser({ username, email, password });
		res.status(201).json({
			success: true,
			message: "Registration successful!",
			data: user,
			statusCode: 201,
		});
	} catch (error) {
		return res.status(error.statusCode).json({
			success: false,
			error: error.message,
			statusCode: error.statusCode,
		});
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const token = await loginUser({ email, password });

		return res
			.status(200)
			.cookie("token", token, {
				expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
				httpOnly: true,
				secure: false,
				sameSite: "none",
			})
			.json({
				success: true,
				message: "Login successful!",
				token, // Just for checking
				statusCode: 200,
			});
	} catch (error) {
		console.log(error);
		return res.status(error.statusCode).json({
			success: false,
			error: error.message,
			statusCode: error.statusCode,
		});
	}
};

const logout = async (req, res) => {
	const { id } = req.user;

	try {
		await logoutUser(id);

		return res.status(200).clearCookie("token").json({
			success: true,
			message: "Logout successful!",
			statusCode: 200,
		});
	} catch (error) {
		console.log(error);
		return res.status(error.statusCode).json({
			success: false,
			error: error.message,
			statusCode: error.statusCode,
		});
	}
};

const userProfile = async (req, res) => {
	const { id } = req.user;

	try {
		const user = await getUserById(id);

		return res.status(200).json({
			success: true,
			source: "database",
			message: "Current user profile fetched successfully!",
			data: user,
			statusCode: 200,
		});
	} catch (error) {
		console.log(error);

		return res.status(error.statusCode).json({
			success: false,
			error: error.message,
			statusCode: error.statusCode,
		});
	}
};

module.exports = { register, login, logout, userProfile };
