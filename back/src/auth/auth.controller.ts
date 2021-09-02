import express, { Request, Response } from "express";
import * as authService from "./auth.service";

const router: express.Router = express.Router();

router.get("/", (request: Request, response: Response) => {
  authService.getTest(request, response);
});

export default router;
