import Express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

// imports for ----> (ROUTES)
import { UserRouter } from "routes";

// express instantiation
const app = Express();

// dot env setup
dotenv.config();

// hooking some third party middlewares
app.use(Express.json());
app.use(cors());

// database configuration import
import "config/database";

import "config/multer";

// ---------> (ROUTES)
app.use("/api/v1/users", UserRouter);

// base route AKA Homepage
app.get("/", (req: Request, res: Response) => {
  res.send({
    title: "success",
    value: "This is a homepage and a placeholder response",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({
    status: "failed",
    message: err.message,
  });
});

// Launching the app
app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});

// https://ks-api.vercel.app/
