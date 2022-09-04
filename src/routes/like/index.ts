import Express from "express";
import passport from "passport";
const LikeRouter = Express.Router();

// controllers import
import {
  createLike,
  getAllLikes,
  deleteSingleLike,
} from "app/controllers/likeController";

LikeRouter.route("/create").post(
  passport.authenticate("jwt", { session: false }),
  createLike
);

LikeRouter.route("/").get(getAllLikes);

LikeRouter.route("/:id").delete(deleteSingleLike);

export default LikeRouter;
