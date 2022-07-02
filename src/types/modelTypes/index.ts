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
