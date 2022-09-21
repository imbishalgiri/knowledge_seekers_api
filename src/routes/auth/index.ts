import { loginController } from "app/controllers/authController/login";
import express from "express";
import transporter from "app/config/nodemailer";

const AuthRouter = express.Router();

// AuthRouter.route("/signup").post(signupController);

AuthRouter.route("/login").post(loginController);
AuthRouter.route("/send-mail").post(async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"KS-APP" <noreply@ksapp.com>',
      to: "giribishal09@gmail.com",
      subject: "Hello from node",
      text: "Hello world?",
      html: "<strong>Hello world?</strong>",
      headers: { "x-myheader": "test header" },
    });
    console.log("response -->", info.response);
  } catch (error) {
    console.log("mail error", error);
  }
});

export default AuthRouter;
