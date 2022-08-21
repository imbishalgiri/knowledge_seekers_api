import Comment from "app/models/comment";
import User from "app/models/user";
import { Response, Request } from "express";
import { IComment } from "app/types/modelTypes";
import Like from "app/models/like";
import { validateError } from "app/utils/validator";
import { TypedRequestBody } from "app/types/typeUtils";

// 1) controller to create post
const createComment = async (
  req: TypedRequestBody<IComment>,
  res: Response
): Promise<Response> => {
  try {
    const { user: bodyUser } = req.body;

    // check if user can post to like or not
    // if cannot post terminate right here
    const userId = bodyUser;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({
        status: "failed",
        message: "User not found to comment to a post",
      });
    }

    // create new like here and send acknowledge message to the user
    const requestedComment = new Comment(req.body);
    const commentAdded = await (
      await requestedComment.save()
    ).populate("user", "-_id -__v");
    return res.status(201).send({
      status: "success",
      comment: commentAdded,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

// 2) controller to get all likes while a post id is provided
const getAllComments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const search = req.query.postId || "";
  try {
    const comments = await Comment.find({
      post: new RegExp(`${search}`, "gi"),
    })
      .select("-__v -createdAt -updatedAt")
      .populate("user", "firstName lastName -_id");

    return res.status(200).send({
      status: "success",
      data: comments,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

// 3) controller to Update a single comment
const updateSingleComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params?.id;
  const filter = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, filter);
    return res.status(200).send({
      status: "succcess",
      data: updatedComment,
    });
  } catch (err) {
    return res.send({
      status: "failed",
      error: err,
    });
  }
};

const deleteSingleComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    return res.status(200).send({
      status: "success",
      deletedComment,
    });
  } catch (err) {
    return res.send({
      status: "failed",
      error: err,
    });
  }
};

export {
  createComment,
  updateSingleComment,
  getAllComments,
  deleteSingleComment,
};
