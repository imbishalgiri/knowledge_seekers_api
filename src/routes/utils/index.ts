import { UploadImageController } from "./../../controllers/utilsController/index";
import parser from "app/config/cloudinary";
import Express from "express";

const UtilsRouter = Express.Router();

UtilsRouter.route("/upload-image").post(
  parser.single("image"),
  UploadImageController
);

export default UtilsRouter;
