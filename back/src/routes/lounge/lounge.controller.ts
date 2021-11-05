import express, { Request, Response } from "express";

import { jwtGuards } from "../auth/oauth";
import * as loungeService from "./lounge.service";

const router: express.Router = express.Router();

// lounge API
router.get("/", (request: Request, response: Response) => {
    loungeService.getLounge(request, response);
});

router.post("/", jwtGuards, (request: Request, response: Response) => {
    loungeService.postLounge(request, response);
});

router.put("/:loungeId", jwtGuards, (request: Request, response: Response) => {
    loungeService.updateLounge(request, response);
});

router.delete("/:loungeId", jwtGuards, (request: Request, response: Response) => {
    loungeService.deleteLounge(request, response);
});

// replyoflounge API
router.get("/reply/:loungeId", (request: Request, response: Response) => {
    loungeService.getReplyOfLounge(request, response);
});

router.post("/reply/:loungeId", jwtGuards, (request: Request, response: Response) => {
    loungeService.postReplyOfLounge(request, response);
});

router.put("/reply/:replyId", jwtGuards, (request: Request, response: Response) => {
    loungeService.updateReplyOfLounge(request, response);
});

router.delete("/reply/:replyId", jwtGuards, (request: Request, response: Response) => {
    loungeService.deleteReplyOfLounge(request, response);
});

// likelounge API
router.put("/like/:loungeId", jwtGuards, (request: Request, response: Response) => {
    loungeService.likeLounge(request, response);
});

router.put("/unlike/:loungeId", jwtGuards, (request: Request, response: Response) => {
    loungeService.unlikeLounge(request, response);
});

// likereply API
router.put("/reply/like/:replyId", jwtGuards, (request: Request, response: Response) => {
    loungeService.likeReply(request, response);
});

router.put("/reply/unlike/:replyId", jwtGuards, (request: Request, response: Response) => {
    loungeService.unlikeReply(request, response);
});

export default router;