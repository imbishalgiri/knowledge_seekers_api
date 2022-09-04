import { loginController } from "app/controllers/authController/login";
import express from "express";

const AuthRouter = express.Router();

// AuthRouter.route("/signup").post(signupController);

AuthRouter.route("/login").post(loginController);

export default AuthRouter;
