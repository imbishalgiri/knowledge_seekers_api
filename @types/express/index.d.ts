import { IUser } from "app/types/modelTypes";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: User;
    }
  }
}

export {};
