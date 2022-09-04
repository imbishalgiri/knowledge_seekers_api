import { User } from "app/models";
import { validateError } from "app/utils/validator";
import { Response, Request } from "express";
import Post from "app/models/post";
import { IPosts } from "app/types/modelTypes";
import { TypedRequestBody } from "app/types/typeUtils";
import Like from "app/models/like";
import Comment from "app/models/comment";

// 1) controller to create post
const createPost = async (
  req: TypedRequestBody<IPosts>,
  res: Response
): Promise<Response> => {
  try {
    const { description, user: bodyUser } = req.body;
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
    const requestedPost = new Post({ ...req.body, image });
    const postAdded = await (
      await requestedPost.save()
    ).populate("user", "-_id -__v");
    return res.status(201).send({
      status: "success",
      post: postAdded,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

// 2) controller to get all post
const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
  const search = req.query.description || "";
  try {
    const post = await Post.find({
      description: new RegExp(`${search}`, "gi"),
    })
      .select("-__v -createdAt -updatedAt")
      .populate("user", "firstName lastName -_id")
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: {
            path: "user",
          },
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "likes",
          populate: {
            path: "user",
          },
        },
      });

    return res.status(200).send({
      status: "success",
      data: post,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

//3) controller to get single post
const getSinglePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  try {
    let singlePost = await Post.findById(id)
      .select("-__v -likes -comments")
      .populate("user", "firstName lastName  ");
    const likes = await Like.find({ post: id })
      .select("-__v")
      .populate("user", "firstName lastName -_id");

    const comments = await Comment.find({ post: id })
      .select("-__v")
      .populate("user", "firstName lastName -_id")
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "replies",
        populate: {
          path: "user",
        },
      });
    // final and formatted response
    return res.status(200).send({
      status: "success",
      data: {
        _id: singlePost._id,
        description: singlePost.description,
        user: singlePost.user,
        createdAt: singlePost.createdAt,
        updatedAt: singlePost.updatedAt,
        likes,
        comments,
      },
    });
  } catch (err) {
    res.send({
      status: "failed",
      error: err,
    });
  }
};

//4) controller to update single post
const updateSinglePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    const filter = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, filter);
    res.status(200).send({
      status: "success",
      data: updatedPost,
    });
  } catch (err) {
    return res.send({
      status: "failed",
      error: err,
    });
  }
};

//5) controller to delete a single post
const deleteSinglePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    return res.status(200).send({
      status: "success",
      deletedPost,
    });
  } catch (err) {
    return res.send({
      status: "failed",
      error: err,
    });
  }
};

export {
  createPost,
  getAllPosts,
  getSinglePost,
  updateSinglePost,
  deleteSinglePost,
};
