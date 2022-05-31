import Express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = Express();
dotenv.config();

import "./config/database";

app.get("/", (req: Request, res: Response) => {
  res.send("this is a test route");
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
