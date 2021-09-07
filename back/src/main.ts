import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./models";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { authorization } from "./routes/auth/oauth";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();
  const app: express.Application = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(authorization);
  app.use(routes);

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
