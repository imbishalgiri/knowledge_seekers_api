import { ICommentLikes, IUser } from "./../../types/modelTypes/index";
import Post from "app/models/post";
import Comment from "app/models/comment";
import User from "app/models/user";
import { Response, Request } from "express";
import { IComment } from "app/types/modelTypes";
import Like from "app/models/like";
import { validateError } from "app/utils/validator";
import { TypedRequestBody } from "app/types/typeUtils";

export interface ReqUser extends Request {
  user: IUser;
}

// 1) controller to create post
const createComment = async (
  req: ReqUser,
  res: Response
): Promise<Response> => {
  try {
    const bodyUser = req?.user._id;

    // check if user can post to like or not
    // if cannot post terminate right here
    const userId = bodyUser;

    console.log("user id -->", userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({
        status: "failed",
        message: "User not found to comment to a post",
      });
    }

    // create new like here and send acknowledge message to the user
    const requestedComment = new Comment({ ...req.body, user: userId });
    const commentAdded = await (
      await requestedComment.save()
    ).populate("user", "-_id -__v");
    // updating the post
    await Post.findByIdAndUpdate(
      req.body.post,
      {
        $push: { comments: commentAdded._id },
      },
      { new: true, upsert: true }
    );

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
      .populate({
        path: "user",
        select: "firstName lastName",
      });

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

// 3) to delete a single comment
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
interface Ireply extends ReqUser {
  comment: string;
  description: string;
}
// 4) To add reply to the comment
const addReplyToTheComment = async (
  req: Ireply,
  res: Response
): Promise<Response> => {
  try {
    // updating the post
    const updatedComment = await Comment.findByIdAndUpdate(
      req.body.comment,
      {
        $push: {
          replies: { description: req.body.description, user: req.user._id },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedComment)
      return res.status(403).send({
        status: "failed",
        message: "sorry that comment id is invalid",
      });

    return res.status(201).send({
      status: "success",
      comment: updatedComment,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

// 5) to add like to the comment
const likeComment = async (req: Ireply, res: Response): Promise<Response> => {
  try {
    // check if user can post to like or not
    // if cannot post terminate right here
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({
        status: "failed",
        message: "User not found to like a comment",
      });
    }
    // check whether that entry is already in database
    const commentData = await Comment.findById(req.body.comment);
    if (!commentData)
      return res.status(403).send({
        status: "failed",
        message: "no comment found by that id",
      });

    const likes = commentData.likes;
    const existingLike = likes.find((el: any) => el?.user == req.user?._id);
    if (existingLike) {
      const newLikes = likes.filter((el: any) => el.user != req.user?._id);
      const likeData = await Comment.findByIdAndUpdate(req.body.comment, {
        likes: newLikes,
      });
      return res.status(200).send({
        status: "success",
        data: likeData,
      });
    }

    const latestComment = await Comment.findByIdAndUpdate(
      req.body.comment,
      {
        $push: {
          likes: { user: req.user?._id, likeType: req.body.likeType },
        },
      },
      { new: true, upsert: true }
    );
    return res.status(201).send({
      status: "success",
      Like: latestComment,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

export {
  createComment,
  updateSingleComment,
  getAllComments,
  deleteSingleComment,
  addReplyToTheComment,
  likeComment,
};
