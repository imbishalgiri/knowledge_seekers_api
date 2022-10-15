import passport from "passport";
import Express from "express";
import {
  createMessage,
  getAllMessages,
} from "app/controllers/userMessageController";

const AddMessageRouter = Express.Router();

AddMessageRouter.route("/").get(getAllMessages).post(createMessage);

export default AddMessageRouter;
