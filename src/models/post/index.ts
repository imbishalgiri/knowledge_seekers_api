import { Schema, model } from "mongoose";
import { IPosts } from "app/types/modelTypes";

const PostSchema = new Schema<IPosts>(
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
    title: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [
        {
          type: String,
        },
      ],
      default: undefined,
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Like",
        },
      ],
    },
    comments: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
    },
  },
  { timestamps: true }
);

const Post = model<IPosts>("Post", PostSchema);
export default Post;
