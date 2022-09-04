import Express from "express";
import appStorage from "app/config/multer";

const PostRouter = Express.Router();
import passport from "passport";
// controllers import
import {
  createPost,
  deleteSinglePost,
  getAllPosts,
  getSinglePost,
  updateSinglePost,
} from "app/controllers/postController";
import parser from "app/config/cloudinary";

PostRouter.route("/create").post(
  passport.authenticate("jwt", { session: false }),
  parser.single("image"),
  createPost
);

PostRouter.route("/").get(getAllPosts);

PostRouter.route("/:id")
  .get(getSinglePost)
  .put(updateSinglePost)
  .delete(deleteSinglePost);

export default PostRouter;
