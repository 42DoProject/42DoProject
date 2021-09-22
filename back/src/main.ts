import dotenv from "dotenv";
import { mongoose, sequelize, initModel } from "./models";
import http from "http";
import express from "express";
import socket from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import * as auth from "./routes/auth/oauth";
import * as bridge from "./socket/bridge";
import * as ws from "./socket";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();
  await mongoose();
  await initModel();

  const app: express.Application = express();
  const server: http.Server = http.createServer(app);
  const io: socket.Server = new socket.Server(server, {
    cors: {
      origin: "*",
    },
  });

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(auth.authorization);
  app.use(routes);

  io.on("connection", ws.handlersFactory(io));

  bridge.set(io);

  auth.expiredTokenCollector();

  server.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
