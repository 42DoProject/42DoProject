import express from "express";
import auth from "./auth/auth.controller";
import project from "./project/project.controller";
import { jwtGuards } from "./auth/oauth";

const router: express.Router = express.Router();

router.use("/auth", auth);
router.use("/project", project);

/* back에서 intra api를 받기 위한 router, 임시용, 원래는 index에는 라우터만 추가해야 합니다 */
router.get("/success", (request, response) => {
  response.redirect(
    `http://localhost:5000/auth/signin?code=${request.query.code}`
  );
});

export default router;
