import express from "express";
import dotenv from "dotenv";
import auth from "./auth/auth.controller";
import { sequelize } from "./models";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();
  const app: express.Application = express();

  app.use(express.json());
  //  app.use(authorization); // <- jwt 체크, 상태 request.auth 같은 곳에 저장, request.user 에 유저 받기
  //guards();를 라우트 함수 내부 첫줄에서 호출하면 request.auth 체크하고 인증 실패 경우 httpException 반환
  app.use("/auth", auth);

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
