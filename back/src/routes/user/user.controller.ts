import express, { Request, Response } from "express";
import * as userService from "./user.service";

const router: express.Router = express.Router();

router.get("/profile/:id", (request: Request, response: Response) => {
  userService.profileMain(request, response);
});

export default router;
