import Express from "express";
import appStorage from "app/config/multer";

const NoticeRouter = Express.Router();
import passport from "passport";
// controllers import
import {
  createNotice,
  deleteSingleNotice,
  getAllNotice,
} from "app/controllers/noticeController";
import parser from "app/config/cloudinary";

NoticeRouter.route("/")
  .post(
    passport.authenticate("jwt", { session: false }),
    parser.single("image"),
    createNotice
  )
  .get(passport.authenticate("jwt", { session: false }), getAllNotice);

NoticeRouter.route("/:id").delete(deleteSingleNotice);

export default NoticeRouter;
