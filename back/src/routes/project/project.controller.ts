import express, { Request, Response } from "express";
import * as projectService from "./project.service";

const router: express.Router = express.Router();

router.get("/", (request: Request, response: Response) => {
  projectService.getList(request, response);
});

export default router;