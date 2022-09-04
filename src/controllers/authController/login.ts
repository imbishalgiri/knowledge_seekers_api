import { Request, Response, NextFunction } from "express";
import { User } from "app/models";
import jwt from "jsonwebtoken";
import { verifyLogin } from "./validator";

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
    const { _id, firstName, lastName, email, faculty, avatar, role } =
      userFound;
    const payload = { _id, firstName, lastName, email, faculty, avatar, role };
    const token = jwt.sign({ user: payload }, `${process.env.JWT_SECRET}`);

    return res.status(200).send({
      status: "success",
      token: `Bearer ${token}`,
    });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

export { loginController };
