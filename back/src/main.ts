import express, { Request, Response } from "express";
import dotenv from "dotenv";
import auth from "./auth/auth.controller";
import sequelize from "../models";

sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
});

dotenv.config();

async function bootstrap() {
  const app: express.Application = express();

  app.use("/auth", auth);

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
