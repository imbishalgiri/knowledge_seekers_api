import { Schema, model } from "mongoose";
import { IComment } from "app/types/modelTypes";

const CommentSchema = new Schema<IComment>(
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
    comment: {
      type: String,
      required: [true, "Comment is Required"],
    },
    likes: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          likeType: String,
        },
      ],
    },
    replies: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          description: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", CommentSchema);
export default Comment;
