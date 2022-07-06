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
    const userId = bodyUser;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({
        status: "failed",
        message: "User not found to like a post",
      });
    }

    // const like = await Like.find({post: })

    // create new like here
    const requestedLike = new Like(req.body);
    const likeAdded = await (
      await requestedLike.save()
    ).populate("user", "-_id -__v");
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
