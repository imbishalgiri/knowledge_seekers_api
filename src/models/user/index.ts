import { Schema, model } from "mongoose";
import { IUser } from "app/types/modelTypes";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required."],
      trim: true,
    },
    middleName: { type: String, trim: true },

    isBrandNew: { type: Boolean, default: true },

    lastName: {
      type: String,
      required: [true, "Last Name is required."],
      trim: true,
    },

    faculty: { type: String, trim: true },

    semester: { type: String, trim: true },

    avatar: { type: String, trim: true },

    role: { type: String, trim: true },

    likedCategories: {
      type: [{ type: String }],
    },

    likedHashtags: {
      type: [{ type: String }],
    },

    pinnedPosts: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "Post",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },

    password: { type: String, trim: true },

    confirmCode: { type: String, trim: true },
  },
  { timestamps: true }
);

// pre save hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

// pre save hook to hash password
UserSchema.pre("insertMany", async function (next: NextFunction, docs: any) {
  if (Array.isArray(docs) && docs.length) {
    const hashedUsers = docs.map(async (user) => {
      return await new Promise(async (resolve, reject) => {
        let password = user.password.toString();
        try {
          user.password = await bcrypt.hash(password, 12);
          resolve(user);
        } catch (err) {
          reject(err);
        }
      });
    });
    docs = await Promise.all(hashedUsers);
    next();
  } else {
    return next(new Error("user should not be empty"));
  }
});

// password verification mongoose model
UserSchema.methods.isValidPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model<IUser>("User", UserSchema);
export default User;
