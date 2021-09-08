import express, { Request, Response } from "express";
import * as authService from "./auth.service";
import { jwtGuards } from "./oauth";

const router: express.Router = express.Router();

router.get("/signin", (request: Request, response: Response) => {
  authService.signIn(request, response);
});

router.get("/signout", jwtGuards, (request: Request, response: Response) => {
  authService.signOut(request, response);
});

export default router;
