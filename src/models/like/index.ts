import { Schema, model } from "mongoose";
import { ILikes } from "app/types/modelTypes";

const LikeSchema = new Schema<ILikes>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post id is required"],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID is required"],
    },
    likeType: {
      type: String,
      enum: ["u", "d"],
      default: "u",
    },
  },
  { timestamps: true }
);

const Like = model<ILikes>("Like", LikeSchema);
export default Like;
