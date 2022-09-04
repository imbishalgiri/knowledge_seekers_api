import Post from "app/models/post";
import { User } from "app/models";
import { Response, Request } from "express";
import { ILikes } from "app/types/modelTypes";
import Like from "app/models/like";
import { validateError } from "app/utils/validator";
import { TypedRequestBody } from "app/types/typeUtils";

// 1) controller to create post
const createLike = async (
  req: TypedRequestBody<ILikes>,
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
        message: "User not found to like a post",
      });
    }
    // check whether that entry is already in database
    const existingLike = await Like.find({
      post: req.body.post,
      user: req.body.user,
    });
    // if in database update the data and terminate
    if (existingLike.length) {
      const data = await Like.findOneAndUpdate(
        { post: req.body.post, user: req.body.user },
        { likeType: req.body.likeType }
      );
      return res.status(201).send({
        status: "success",
        message: data,
      });
    }

    // create new like here and send acknowledge message to the user
    const requestedLike = new Like(req.body);
    const likeAdded = await (
      await requestedLike.save()
    ).populate("user", "-_id -__v");
    console.log("like added -->", likeAdded);

    // updating the post
    await Post.findByIdAndUpdate(
      req.body.post,
      {
        $push: { likes: likeAdded._id },
      },
      { new: true, upsert: true }
    );

    return res.status(201).send({
      status: "success",
      Like: likeAdded,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

// 2) controller to get all likes while a post id is provided
const getAllLikes = async (req: Request, res: Response): Promise<Response> => {
  const search = req.query.postId || "";
  try {
    const likes = await Like.find({
      post: new RegExp(`${search}`, "gi"),
    })
      .select("-__v -createdAt -updatedAt")
      .populate("user", "firstName lastName -_id");

    return res.status(200).send({
      status: "success",
      data: likes,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

//3) controller to delete a single post
const deleteSingleLike = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  try {
    const deletedLike = await Like.findByIdAndDelete(id);
    return res.status(200).send({
      status: "success",
      deletedLike,
    });
  } catch (err) {
    return res.send({
      status: "failed",
      error: err,
    });
  }
};

export { createLike, deleteSingleLike, getAllLikes };
