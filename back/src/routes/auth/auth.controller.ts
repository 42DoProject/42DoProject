import express, { Request, Response } from "express";
import * as authService from "./auth.service";

const router: express.Router = express.Router();

router.get(
  "/signin",
  /*jwtGuards,*/ (request: Request, response: Response) => {
    authService.signIn(request, response);
  }
);

export default router;
