import Express, { Request, Response } from "express";
import { getMessage } from "./server/index";

const app = Express();

app.get("/", (req: Request, res: Response) => {
  res.send(getMessage());
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
