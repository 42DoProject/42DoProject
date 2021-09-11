import dotenv from "dotenv";
import { sequelize } from "./models";
import http from "http";
import express from "express";
import io from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import * as auth from "./routes/auth/oauth";
import * as ws from "./socket";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();

  const app: express.Application = express();
  const server: http.Server = http.createServer(app);
  const socket: io.Server = new io.Server(server, {
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

  socket.use(ws.authorization);
  socket.on("connection", ws.handlers);

  auth.expiredTokenCollector();

  server.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
