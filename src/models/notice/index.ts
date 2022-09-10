import { Schema, model } from "mongoose";
import { Inotice } from "app/types/modelTypes";

const NoticeSchema = new Schema<Inotice>(
  {
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID is required"],
    },
    audience: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Notice = model<Inotice>("Notice", NoticeSchema);
export default Notice;
