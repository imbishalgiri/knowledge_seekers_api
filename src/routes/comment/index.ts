import Express from "express";
import passport from "passport";

const CommentRouter = Express.Router();

import {
  createComment,
  getAllComments,
  deleteSingleComment,
  updateSingleComment,
  addReplyToTheComment,
  likeComment,
} from "app/controllers/commentController";

CommentRouter.route("/create").post(
  passport.authenticate("jwt", { session: false }),
  createComment
);

CommentRouter.route("/").get(getAllComments);

CommentRouter.route("/:id")
  .delete(deleteSingleComment)
  .put(updateSingleComment);

CommentRouter.route("/reply/create").put(
  passport.authenticate("jwt", { session: false }),
  addReplyToTheComment
);
CommentRouter.route("/like").post(
  passport.authenticate("jwt", { session: false }),
  likeComment
);

export default CommentRouter;
