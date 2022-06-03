import Express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = Express();
dotenv.config();

import "config/database";
export const lastName = "lastName";
app.get("/", (req: Request, res: Response) => {
  res.send({
    title: "success",
    value: "This is a homepage and a placeholder response",
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});

// base url for vercel app
// https://ks-api.vercel.app/
