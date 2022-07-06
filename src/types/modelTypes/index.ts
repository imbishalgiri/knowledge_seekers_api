import { Types } from "mongoose";
export interface IUser {
  firstName: string;
  middleName?: string;
  lastName: string;
  faculty: string;
  email: string;
  password?: string;
  confirmCode?: string;
}
export interface IPosts {
  description: string;
  image: string;
  user: Types.ObjectId;
  tags: string[];
}

export interface ILikes {
  post: Types.ObjectId;
  user: Types.ObjectId;
  likeType: string;
}

export interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  comment: string;
  replies: string[];
}
