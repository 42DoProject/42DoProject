import express, { Request, Response } from "express";
import { jwtGuards } from "../auth/oauth";
import * as userService from "./user.service";

const router: express.Router = express.Router();

router.get("/feed", jwtGuards, (request: Request, response: Response) => {
  userService.getFeed(request, response);
});

router.get("/me", jwtGuards, (request: Request, response: Response) => {
  userService.getMe(request, response);
});

router.post("/me", jwtGuards, (request: Request, response: Response) => {
  userService.modifyMe(request, response);
});

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

router.get(
  "/following/:id",
  jwtGuards,
  (request: Request, response: Response) => {
    userService.following(request, response);
  }
);

router.get(
  "/follower/:id",
  jwtGuards,
  (request: Request, response: Response) => {
    userService.follower(request, response);
  }
);

export default router;
