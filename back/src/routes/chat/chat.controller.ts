import express, { Request, Response } from "express";
import { getUserSocket, io as sockets } from "../../socket/bridge";
import { jwtGuards } from "../auth/oauth";
import * as chatService from "./chat.service";

const router: express.Router = express.Router();

router.get("/join", jwtGuards, (request: Request, response: Response) => {
  chatService.join(request, response);
});

router.get("/test", jwtGuards, (request: Request, response: Response) => {
  const a = getUserSocket(1);
  console.log(a);
  a?.emit("chat:on", { message: "notification test" });
});

export default router;
