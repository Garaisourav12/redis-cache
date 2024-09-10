const {
	register,
	login,
	logout,
	userProfile,
} = require("../../controllers/userController");
const isAuth = require("../../middlewares/isAuth");
const checkCache = require("../../middlewares/checkCache");
const userRouter = require("express").Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", isAuth, logout);
userRouter.get("/current-user", isAuth, checkCache, userProfile);

module.exports = userRouter;
