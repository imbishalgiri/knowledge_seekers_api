import Express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = Express();
dotenv.config();

import "./config/database";

app.get("/", (req: Request, res: Response) => {
  res.send("new test");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
