import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app: express.Application = express();

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}
bootstrap();
