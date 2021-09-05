import express from "express";
import dotenv from "dotenv";
import auth from "./auth/auth.controller";
import { sequelize } from "./models";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();
  const app: express.Application = express();

  app.use("/auth", auth);

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
