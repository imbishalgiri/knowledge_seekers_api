import { verifyPostAccess } from "./../../middlewares/index";
import Express from "express";
import appStorage from "app/config/multer";

const PostRouter = Express.Router();
import passport from "passport";
// controllers import
import {
  createPost,
  deleteSinglePost,
  getAllPosts,
  getAllPostsForMe,
  getSinglePost,
  updateSinglePost,
} from "app/controllers/postController";
import parser from "app/config/cloudinary";

PostRouter.route("/create").post(
  passport.authenticate("jwt", { session: false }),
  parser.single("image"),
  createPost
);

PostRouter.route("/").get(
  passport.authenticate("jwt", { session: false }),
  getAllPosts
);

PostRouter.route("/my/:id").get(
  passport.authenticate("jwt", { session: false }),
  getAllPostsForMe
);

// this gotta be authorized
PostRouter.route("/:id")
  .get(passport.authenticate("jwt", { session: false }), getSinglePost)
  .put(
    passport.authenticate("jwt", { session: false }),
    verifyPostAccess,
    updateSinglePost
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    verifyPostAccess,
    deleteSinglePost
  );

export default PostRouter;
