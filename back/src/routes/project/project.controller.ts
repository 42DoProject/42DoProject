import express, { Request, Response } from "express";
import * as projectService from "./project.service";

const router: express.Router = express.Router();

router.get("/", (request: Request, response: Response) => {
  projectService.getList(request, response);
});

router.post("/", (request: Request, response: Response) => {
  projectService.postList(request, response);
});

router.delete("/", (request: Request, response: Response) => {
  projectService.deleteList(request, response);
});

export default router;