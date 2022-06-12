import Express from "express";
import appStorage from "config/multer";

const UserRouter = Express.Router();

// controllers import
import { getAllUsers, addToUsers, addUsersFromExcel } from "controllers";

UserRouter.route("/").get(getAllUsers).post(addToUsers);

UserRouter.route("/upload-users").post(
  appStorage.single("users"),
  addUsersFromExcel
);

export default UserRouter;
