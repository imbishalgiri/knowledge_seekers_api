import Express from "express";
import appStorage from "app/config/multer";

const PostRouter = Express.Router();

// controllers import
import {
  createPost,
  deleteSinglePost,
  getAllPosts,
  getSinglePost,
  updateSinglePost,
} from "app/controllers/postController";

PostRouter.route("/create").post(createPost);

PostRouter.route("/").get(getAllPosts);

PostRouter.route("/:id")
  .get(getSinglePost)
  .put(updateSinglePost)
  .delete(deleteSinglePost);

export default PostRouter;
