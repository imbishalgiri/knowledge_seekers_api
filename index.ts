import Express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// imports for ----> (ROUTES)
import UserRouter from "app/routes/user";
import PostRouter from "app/routes/post";
// express instantiation
const app = Express();

// dot env setup
dotenv.config();

// hooking some third party middlewares
app.use(Express.json());
app.use(cors());

// database configuration import
import "app/config/database";

import "app/config/multer";

// ---------> (ROUTES)
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/posts", PostRouter);

// base route AKA Homepage
app.get("/", (req: Request, res: Response) => {
  res.send({
    title: "success",
    value: "This is a homepage and a placeholder response (CD CHECK)..",
  });
});

// Swagger definition
const swaggerDefinition = {
  info: {
    title: "REST API for Knowledge Seekers", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the REST API for our final year project Knowledge Seekers", // short description of the app
  },
  host: "https://ks-api.vercel.app", // the host or url of the app
  basePath: "/api/v1", // the basepath of your endpoint
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./docs/**/*.yaml"],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// use swagger-Ui-express for your app documentation endpoint
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
