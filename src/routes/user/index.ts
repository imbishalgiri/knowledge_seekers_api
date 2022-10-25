import { verifyUser } from "./../../middlewares/index";
import {
  deleteSingleUser,
  updateSingleUser,
} from "./../../controllers/userController/index";
import parser from "app/config/cloudinary";
import passport from "passport";
import Express from "express";
import appStorage from "app/config/multer";

const UserRouter = Express.Router();

// controllers import
import {
  getAllUsers,
  getSingleUser,
  addToUsers,
  addUsersFromExcel,
} from "app/controllers/userController";

UserRouter.route("/")
  .get(passport.authenticate("jwt", { session: false }), getAllUsers)
  .post(passport.authenticate("jwt", { session: false }), addToUsers);

UserRouter.route("/:id")
  .get(passport.authenticate("jwt", { session: false }), getSingleUser)
  .delete(
    passport.authenticate("jwt", { session: false }),
    verifyUser,
    deleteSingleUser
  );

UserRouter.route("/upload-users").post(
  passport.authenticate("jwt", { session: false }),
  appStorage.single("users"),
  addUsersFromExcel
);

UserRouter.route("/update").put(
  passport.authenticate("jwt", { session: false }),
  verifyUser,
  parser.single("image"),
  updateSingleUser
);

export default UserRouter;
