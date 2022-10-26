import Post from "app/models/post";
import { ReqPostUser } from "./../controllers/postController/index";
import { User } from "app/models";
import { NextFunction, Request, Response } from "express";

// this on is for operations for user itself
export const verifyUser = async (
  req: ReqPostUser,
  res: Response,
  next: NextFunction
) => {
  const user = req.params.id || req.body._id;
  try {
    const userData = await User.findById(req.user._id);
    const userRole = userData.role;
    if (userRole === "admin") return next();
    if (user == req.user._id) return next();
    return res.status(400).send({
      status: "failed",
      error: "you are not authorised carry out this action",
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      error: err,
    });
  }
};

// middleware that controls privilidge for users
export const verifyPostAccess = async (
  req: ReqPostUser,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserId = req.user._id;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    const userIdFromPost = post.user;
    console.log("userId From post", userIdFromPost, loggedInUserId);
    const user = await User.findById(loggedInUserId);
    const userRole = user.role;
    if (userRole === "admin") return next();
    if (loggedInUserId.equals(userIdFromPost)) return next();
    return res.status(400).send({
      status: "failed",
      error: "you are not authorised to carry out this action",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
