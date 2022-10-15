import passport from "passport";
import Express from "express";
import {
  createMessage,
  deleteSingleMessage,
  getAllMessages,
} from "app/controllers/userMessageController";

const AddMessageRouter = Express.Router();

AddMessageRouter.route("/").get(getAllMessages).post(createMessage);
AddMessageRouter.route("/:id").delete(deleteSingleMessage);

export default AddMessageRouter;
