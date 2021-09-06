import express from "express";
import auth from "./auth/auth.controller";

const router: express.Router = express.Router();

//  app.use(authorization); // <- jwt 체크, 상태 request.auth 같은 곳에 저장, request.user 에 유저 받기
//guards();를 라우트 함수 내부 첫줄에서 호출하면 request.auth 체크하고 인증 실패 경우 httpException 반환
router.use("/auth", auth);

export default router;
