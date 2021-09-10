import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sequelize } from "./models";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { authorization, expiredTokenCollector } from "./routes/auth/oauth";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();
  const app: express.Application = express();

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(authorization);
  app.use(routes);

  expiredTokenCollector();

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
