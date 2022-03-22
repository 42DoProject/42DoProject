import express from "express";
import auth from "./auth/auth.controller";
import user from "./user/user.controller";
import project from "./project/project.controller";
import lounge from "./lounge/lounge.controller";
import chat from "./chat/chat.controller";
import search from "./search/search.controller";
import statistics from "./statistics/statistics.controller";

const router: express.Router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/project", project);
router.use("/lounge", lounge);
router.use("/chat", chat);
router.use("/search", search);
router.use("/statistics", statistics);

router.get("/v", (request, response) => {
  response.status(200).send("v1");
});

export default router;
