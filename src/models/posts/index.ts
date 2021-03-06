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
      required: [true, "User is required"],
    },
    tags: {
      type: [
        {
          type: String,
        },
      ],
      default: undefined,
    },
  },
  { timestamps: true }
);

const Post = model<IPosts>("Post", PostSchema);
export default Post;
