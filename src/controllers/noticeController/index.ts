import User from "app/models/user";
import Notice from "app/models/notice";
import { validateError } from "app/utils/validator";
import { Request, Response } from "express";
import { ReqPostUser } from "../postController";

// 1) controller to create post
export const createNotice = async (
  req: ReqPostUser,
  res: Response
): Promise<Response> => {
  try {
    const { description } = req.body;
    const bodyUser = req.user._id;
    const image = req.file?.path;
    // base empty check
    if (!description && !image)
      return res.status(400).send({
        status: "failed",
        message: "give me either description or image",
      });
    // check if user can create post or not
    const userId = bodyUser;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({
        status: "failed",
        message: "This user cannot create post",
      });
    }
    // create new post here
    const requestedNotice = new Notice({ ...req.body, image, user: userId });
    const postAdded = await (
      await requestedNotice.save()
    ).populate("user", "-_id -__v");
    return res.status(201).send({
      status: "success",
      post: postAdded,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

export const getAllNotice = async (req: ReqPostUser, res: Response) => {
  const bodyUser = req.user._id;
  try {
    const thatUser = await User.findById(bodyUser);
    const facultyOfThatUser = thatUser.faculty;
    console.log("faculty of that user", facultyOfThatUser);
    const noticeData = await Notice.find({
      audience: { $in: ["all", facultyOfThatUser] },
    });
    res.status(200).send({
      status: "success",
      notice: noticeData,
    });
  } catch (error) {
    res.status(400).send(validateError(error));
  }
};

export const deleteSingleNotice = async (req: ReqPostUser, res: Response) => {
  const id = req.params.id;
  try {
    const deleted = await Notice.findByIdAndDelete(id);
    return res.status(200).send({
      status: "success",
      deleted,
    });
  } catch (error) {
    return res.status(400).send(validateError(error));
  }
};
