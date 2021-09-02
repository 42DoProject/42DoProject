import express, { Request, Response } from "express";
import dotenv from "dotenv";
import auth from "./auth/auth.controller";

dotenv.config();

async function bootstrap() {
  const app: express.Application = express();

  app.use("/auth", auth);

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
