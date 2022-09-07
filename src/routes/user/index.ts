import { updateSingleUser } from "./../../controllers/userController/index";
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

UserRouter.route("/").get(getAllUsers).post(addToUsers);
UserRouter.route("/:id").get(getSingleUser);

UserRouter.route("/upload-users").post(
  appStorage.single("users"),
  addUsersFromExcel
);

UserRouter.route("/update").put(
  passport.authenticate("jwt", { session: false }),
  parser.single("image"),
  updateSingleUser
);

export default UserRouter;
