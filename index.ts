import Express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import passport from "passport";
import { Server } from "socket.io";

// imports for ----> (ROUTES)
import UserRouter from "app/routes/user";
import PostRouter from "app/routes/post";
import LikeRouter from "app/routes/like";
import CommentRouter from "app/routes/comment";
import AuthRouter from "app/routes/auth";
import NoticeRouter from "app/routes/notice";
import UtilsRouter from "app/routes/utils";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "app/types/socket";

// express instantiation
const app = Express();

// dot env setup
dotenv.config();

// hooking some third party middlewares
app.use(Express.json());
app.use(cors());

// passport js setup
app.use(passport.initialize());
import "app/config/passport";

// database configuration import
import "app/config/database";

import "app/config/multer";

// -------------------------------

// ---------> (ROUTES)
app.use("/api/v1/users", UserRouter); // refactored
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/likes", LikeRouter);
app.use("/api/v1/comments", CommentRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/notice", NoticeRouter);
app.use("/api/v1/utils", UtilsRouter);

// base route AKA Homepage
app.get("/", (req: Request, res: Response) => {
  res.send({
    title: "success",
    value: "This is a homepage and a placeholder response (CD CHECK)..",
  });
});

// Swagger definition -----------------------
const swaggerDefinition = {
  info: {
    title: "REST API for Knowledge Seekers", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the REST API for our final year project Knowledge Seekers", // short description of the app
  },
  host: "ks-api.vercel.app", // the host or url of the app
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
// ------------------------- end of swagger and error logging

// Launching the app
const server = app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});

// creating socket io server   --- WEB SOCKETS
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket .io");

  socket.on("joinPost", (id) => {
    socket.join(id);
  });

  socket.on("addComment", (comment, room) => {
    console.log("add comment", comment, room);
    socket.to(room).emit("receiveComment", comment);
  });

  socket.on("addReply", (reply, room) => {
    console.log("add reply", reply, room);
    socket.to(room).emit("receiveReply", reply);
  });
});
