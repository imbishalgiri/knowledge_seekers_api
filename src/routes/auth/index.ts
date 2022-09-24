import {
  loginController,
  forgotPasswordController,
  confirmCodeController,
} from "app/controllers/authController/login";
import { updatePasswordController } from "app/controllers/userController";
import express from "express";

const AuthRouter = express.Router();

// AuthRouter.route("/signup").post(signupController);

AuthRouter.route("/login").post(loginController);
AuthRouter.route("/send-mail").post(forgotPasswordController);
AuthRouter.route("/confirm-code").post(confirmCodeController);
AuthRouter.route("/change-password").post(updatePasswordController);

export default AuthRouter;
