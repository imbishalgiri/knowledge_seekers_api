import { IMessages } from "./../../types/modelTypes/index";
import { Schema, model } from "mongoose";

const UserMessageSchema = new Schema<IMessages>(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, trim: true },
    type: { type: String, trim: true },
  },
  { timestamps: true }
);

const UserMessage = model<IMessages>("UserMesage", UserMessageSchema);
export default UserMessage;
