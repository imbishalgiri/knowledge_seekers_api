import { Types } from "mongoose";
export interface IUser {
  _id?: any;
  firstName: string;
  middleName?: string;
  lastName: string;
  faculty: string;
  email: string;
  role: string;
  password?: string;
  confirmCode?: string;
  name: string;
  avatar?: string;
  isBrandNew: boolean;
  likedCategories: string[];
  semester: string;
  likedHashtags: string[];
  pinnedPosts: Types.ObjectId[];
  isValidPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
export interface IPosts {
  description: string;
  image: string;
  user: Types.ObjectId;
  tags: string[];
  title: string;
  category: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
}

export interface Inotice {
  description: string;
  image: string;
  audience: string;
  user: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export interface ILikes {
  post: Types.ObjectId;
  user: Types.ObjectId;
  likeType: string;
}

export interface ICommentLikes {
  comment: Types.ObjectId;
  user: Types.ObjectId;
  likeType: string;
}

export interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  comment: string;
  likes: Types.ObjectId[];
  replies: { user: Types.ObjectId; description: string }[];
}
