import express, { Request, Response } from "express";
import * as searchService from "./search.service";

const router: express.Router = express.Router();

router.get("/user", (request: Request, response: Response) => {
  searchService.getUser(request, response);
});

router.post("/user", (request: Request, response: Response) => {
  searchService.getUserFilter(request, response);
});

router.get("/user/:keyword", (request: Request, response: Response) => {
  searchService.searchUser(request, response);
});

router.get("/project", (request: Request, response: Response) => {
  searchService.getProject(request, response);
});

router.get("/project/:keyword", (request: Request, response: Response) => {
  searchService.searchProject(request, response);
});

router.get("/:keyword", (request: Request, response: Response) => {
  searchService.searchKeyword(request, response);
});

export default router;
