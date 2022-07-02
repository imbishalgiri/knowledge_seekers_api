import Express from "express";
import appStorage from "app/config/multer";

const UserRouter = Express.Router();

// controllers import
import {
  getAllUsers,
  addToUsers,
  addUsersFromExcel,
} from "app/controllers/user";

UserRouter.route("/").get(getAllUsers).post(addToUsers);

UserRouter.route("/upload-users").post(
  appStorage.single("users"),
  addUsersFromExcel
);

export default UserRouter;
