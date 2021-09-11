import express, { Request, Response } from "express";
import { jwtGuards } from "../auth/oauth";
import * as userService from "./user.service";

const router: express.Router = express.Router();

router.get("/profile/:id", (request: Request, response: Response) => {
  userService.profileMain(request, response);
});

router.get("/follow/:id", jwtGuards, (request: Request, response: Response) => {
  userService.follow(request, response);
});

router.get(
  "/unfollow/:id",
  jwtGuards,
  (request: Request, response: Response) => {
    userService.unfollow(request, response);
  }
);

export default router;
