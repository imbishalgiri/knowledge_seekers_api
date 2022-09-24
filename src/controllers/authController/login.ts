import { Request, Response, NextFunction } from "express";
import { User } from "app/models";
import jwt from "jsonwebtoken";
import { verifyLogin } from "./validator";
import transporter from "app/config/nodemailer";

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { error } = verifyLogin(req.body);

  if (error) {
    return res.status(400).send(error);
  }
  try {
    const userFound = await User.findOne({ email: req.body.email });
    // if user not found
    if (!userFound) {
      return res.status(401).send({
        status: "failed",
        data: {
          field: "email",
          message: "This user does not exist",
        },
      });
    }
    // if user found but password invalid
    if (
      !(await userFound.isValidPassword(req.body.password, userFound.password))
    ) {
      return res.status(401).send({
        status: "failed",
        data: { field: "password", message: "Incorrect Password" },
      });
    }
    // if all the tests get successful
    const {
      _id,
      firstName,
      lastName,
      email,
      faculty,
      avatar,
      role,
      isBrandNew,
      likedCategories,
      likedHashtags,
      semester,
    } = userFound;
    const payload = {
      _id,
      firstName,
      lastName,
      email,
      faculty,
      semester,
      avatar,
      role,
      isBrandNew,
      likedHashtags,
      likedCategories,
    };
    const token = jwt.sign({ user: payload }, `${process.env.JWT_SECRET}`);

    return res.status(200).send({
      status: "success",
      token: `Bearer ${token}`,
    });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

// controller to handle forgot password logic
const forgotPasswordController = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const randomCode = (Math.random() + 1).toString(36).substring(7);

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { confirmCode: randomCode }
    );
    if (!user) {
      res.status(400).send({
        status: "failed",
        error: "This email is not registered",
      });
    }
    await transporter.sendMail({
      from: '"KNOWLEDGE-SEEKERS" <noreply@ksapp.com>',
      to: email,
      subject: "Confirmation code for password change",
      html: `please use this code to verify your email <h2> ${randomCode} </h2>`,
      headers: { "x-myheader": "test header" },
    });
    res.status(200).send({
      status: "success",
      message: "email sent",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      error,
    });
  }
};

const confirmCodeController = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    const confirmCode = user.confirmCode;
    if (confirmCode === code) {
      return res.status(200).send({
        status: "success",
        message: "code verified",
      });
    } else {
      return res.status(400).send({
        status: "failed",
        message: "code did not match",
      });
    }
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: "err",
    });
  }
};

export { loginController, forgotPasswordController, confirmCodeController };
