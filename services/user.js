const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { SALT, JWT_SECRET } = require("../config/envConfig");
const {
	BadRequestError,
	InternalServerError,
	NotFoundError,
} = require("../errors");
const { dataMissing } = require("../utils/commonUtils");
const redis = require("../config/redis");

const createUser = async ({ username, email, password }) => {
	if (dataMissing(username, email, password)) {
		throw new BadRequestError("All fields are required.");
	}

	try {
		let userAlreadyExists = null;

		userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			throw new BadRequestError("Email already exists.");
		}

		userAlreadyExists = await User.findOne({ username });
		if (userAlreadyExists) {
			throw new BadRequestError("Username already exists.");
		}

		const hashedPassword = await bcrypt.hash(password, SALT);

		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();

		if (!newUser) {
			throw new BadRequestError("Registration failed!");
		}

		return newUser;
	} catch (error) {
		throw new InternalServerError("Internal Server Error!");
	}
};

const loginUser = async ({ email, password }) => {
	if (dataMissing(email, password)) {
		throw new BadRequestError("All fields are required.");
	}

	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			throw new NotFoundError("Email Id not registered!");
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw new BadRequestError("Invalid credentials!");
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET, {
			expiresIn: "1d",
		});

		return token;
	} catch (error) {
		console.log(error);
		throw new InternalServerError("Internal Server Error!");
	}
};

const logoutUser = async (id) => {
	if (dataMissing(id)) {
		throw new BadRequestError("All fields are required.");
	}

	try {
		const data = redis.del(id);
		if (!data) {
			throw new InternalServerError("Internal Server Error!");
		}
	} catch (error) {
		throw new InternalServerError("Internal Server Error!");
	}
};

const getUserById = async (id) => {
	if (dataMissing(id)) {
		throw new BadRequestError("All fields are required.");
	}

	try {
		const user = await User.findById(id);

		if (!user) {
			throw new NotFoundError("User not found!");
		}

		const { password, ...userProfile } = user._doc;

		const data = redis.set(
			user._id,
			JSON.stringify(userProfile),
			"EX",
			120
		); // With 2min expiry

		if (!data) {
			throw new InternalServerError("Internal Server Error!");
		}

		return userProfile;
	} catch (error) {
		console.log(error);
		throw new InternalServerError("Internal Server Error!");
	}
};

module.exports = { createUser, loginUser, logoutUser, getUserById };
