import { ReqPostUser } from "./../controllers/postController/index";
import { User } from "app/models";
import { NextFunction, Request, Response } from "express";
export const verifyUser = async (
  req: ReqPostUser,
  res: Response,
  next: NextFunction
) => {
  const user = req.params.id || req.body._id;

  console.log(user, req.user._id);

  try {
    const userData = await User.findById(req.user._id);
    const userRole = userData.role;
    if (userRole === "admin") return next();
    if (user == req.user._id) return next();
    return res.status(400).send({
      status: "failed",
      error: "you are not authorised to do this action",
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      error: err,
    });
  }
};
