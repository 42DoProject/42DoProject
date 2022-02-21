import express, { Request, Response } from "express";
import * as authService from "./auth.service";
import { jwtGuards } from "./oauth";

const router: express.Router = express.Router();

/* refresh token */
router.get("/refresh", (request: Request, response: Response) => {
  authService.refreshToken(request, response);
});

/* linking */
router.get(
  "/linking/google",
  jwtGuards,
  (request: Request, response: Response) => {
    authService.linkingGoogle(request, response);
  }
);

/* intra */
router.get("/signup/intra", (request: Request, response: Response) => {
  authService.signUpIntra(request, response);
});

router.get("/signin/intra", (request: Request, response: Response) => {
  authService.signInIntra(request, response);
});

/* google */
router.get("/signin/google", (request: Request, response: Response) => {
  authService.signInGoogle(request, response);
});

/* sign out */
router.get("/signout", jwtGuards, (request: Request, response: Response) => {
  authService.signOut(request, response);
});

export default router;
