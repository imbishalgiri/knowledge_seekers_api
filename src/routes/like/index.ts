import Express from "express";

const LikeRouter = Express.Router();

// controllers import
import {
  createLike,
  getAllLikes,
  deleteSingleLike,
} from "app/controllers/likeController";

LikeRouter.route("/create").post(createLike);

LikeRouter.route("/").get(getAllLikes);

LikeRouter.route("/:id").delete(deleteSingleLike);

export default LikeRouter;
