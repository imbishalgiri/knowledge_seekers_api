import { Types } from "mongoose";
import { User } from "app/models";
import { validateError } from "app/utils/validator";
import { Response, Request } from "express";
import Post from "app/models/post";
import { IPosts, IUser } from "app/types/modelTypes";
import { TypedRequestBody } from "app/types/typeUtils";
import Like from "app/models/like";
import Comment from "app/models/comment";
import ContentBasedRecommender from "content-based-recommender";

const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100,
});

// interface Iquery {
//   limit: number;
//   page: number;
//   title: string;
// }

export interface ReqPostUser extends Request {
  description: string;
  image: string;
  tags: string[];
  title: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
  user: IUser;
}
export interface newUserReq
  extends Request<
    { id: string },
    {},
    {},
    { page: number; limit: number; title: string }
  > {
  description: string;
  image: string;
  tags: string[];
  title: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
  user: IUser;
}
// 1) controller to create post
const createPost = async (
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
    const requestedPost = new Post({ ...req.body, image, user: userId });
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

interface reqParams {
  title: string;
  page: number;
  limit: number;
}
// 2) controller to get all post
const getAllPosts = async (
  req: newUserReq,
  res: Response
): Promise<Response> => {
  const search = req.query.title || "";
  const page = req.query.page;
  const limit = req.query.limit;
  const user = req.user?._id;

  try {
    const foundUser = await User.findById(user);
    const userCategories = foundUser.likedCategories;
    let recommendedPost: any = [];

    if (!search) {
      recommendedPost = await Post.find({
        category: { $in: [...userCategories] },
      })
        .limit(limit)
        .skip(limit * page)
        .select("-__v")
        .populate("user")
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
    }

    if (search) {
      recommendedPost = await Post.find({
        title: new RegExp(`${search}`, "gi"),
      })
        .limit(limit)
        .skip(limit * page)
        .select("-__v")
        .populate("user")
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
    }

    if (!recommendedPost.length) {
      recommendedPost = await Post.find({})
        .limit(limit)
        .skip(limit * page)
        .select("-__v")
        .populate("user")
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
    }
    const recommendedByAi = recommender.train(recommendedPost);
    const suggestedPost = recommendedByAi.getSimilarDocuments();
    return res.status(200).send({
      status: "success",
      data: recommendedPost,
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
      .populate("user");
    const likes = await Like.find({ post: id }).select("-__v").populate("user");

    const comments = await Comment.find({ post: id })
      .select("-__v")
      .populate("user")
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
        image: singlePost.image,
        title: singlePost.title,
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
//5) controller to delete a single post
const getAllPostsForMe = async (req: newUserReq, res: Response) => {
  const user = req.params.id;

  try {
    const posts = await Post.find({ user });
    return res.status(200).send({
      status: "success",
      posts,
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
  getAllPostsForMe,
};
