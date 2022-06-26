import { Schema, model, connect } from "mongoose";
import { IUser } from "app/types/modelTypes";

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "First Name is required."],
    trim: true,
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, "Last Name is required."],
    trim: true,
  },
  faculty: { type: String, trim: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: { type: String, trim: true },
  confirmCode: { type: String, trim: true },
});

const User = model<IUser>("User", UserSchema);
export default User;
