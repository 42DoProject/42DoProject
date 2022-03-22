import express, { Request, Response } from "express";
import * as statisticsService from "./statistics.service";

const router: express.Router = express.Router();

router.get("/", (request: Request, response: Response) => {
  statisticsService.base(request, response);
});

export default router;
