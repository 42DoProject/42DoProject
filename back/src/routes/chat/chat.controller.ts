import express, { Request, Response } from "express";
import { jwtGuards } from "../auth/oauth";
import * as chatService from "./chat.service";

const router: express.Router = express.Router();

router.get("/", jwtGuards, (request: Request, response: Response) => {
  chatService.getAllChats(request, response);
});

router.post("/", jwtGuards, (request: Request, response: Response) => {
  chatService.makeChatRoom(request, response);
});

router.get("/:uuid", jwtGuards, (request: Request, response: Response) => {
  chatService.getChats(request, response);
});

router.post("/:uuid", jwtGuards, (request: Request, response: Response) => {
  chatService.inviteUser(request, response);
});

router.delete("/:uuid", jwtGuards, (request: Request, response: Response) => {
  chatService.leave(request, response);
});

export default router;
