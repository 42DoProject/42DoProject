import express, { Request, Response } from "express";
import * as projectService from "./project.service";

const router: express.Router = express.Router();

router.get("/", (request: Request, response: Response) => {
    projectService.signIn(request, response);
  });

router.get("/signin", (request: Request, response: Response) => {
  projectService.signIn(request, response);
});

// router.get("/signout", jwtGuards, (request: Request, response: Response) => {
//   authService.signOut(request, response);
// });

export default router;